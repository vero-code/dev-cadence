import { initializeApp } from 'firebase/app';
import { initializeAppCheck, CustomProvider } from 'firebase/app-check';
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  InferenceMode,
  Schema,
} from 'firebase/ai';
import { CLOUD_FALLBACK_MODEL } from '../constants';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize FirebaseApp
export const firebaseApp = initializeApp(firebaseConfig);

self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
initializeAppCheck(firebaseApp, {
  provider: new CustomProvider({
    getToken: async () => ({
      token: '',
      expireTimeMillis: Date.now(),
    }),
  }),
  isTokenAutoRefreshEnabled: true,
});

// Initialize the Gemini Developer API backend service
const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance
export const model = getGenerativeModel(ai, {
  mode: InferenceMode.PREFER_ON_DEVICE,
  inCloudParams: { model: CLOUD_FALLBACK_MODEL },
});

export const initDeviceModel = (onProgress) =>
  model.initializeDeviceModel((val) => {
    const percent = Math.round(val * 10000) / 100;
    console.log(`Download progress: ${percent}%`);
    onProgress?.(percent);
  });

export const generateHybridText = async (prompt) => {
  await initDeviceModel().catch(() => {});

  const result = await model.generateContent(prompt);
  const inferenceSource = result.response.inferenceSource;
  const text = result.response.text();

  console.log('You used: ' + inferenceSource);
  console.log(text);

  return {
    text,
    inferenceSource,
  };
};

// Uncomment for check in console:
// window.testHybridAi = () => generateHybridText('Say hello in one short sentence.');

// Write into console: await window.testHybridAi();
// Return:
// {text: 'Hello!', inferenceSource: 'on_device'}

const sprintJsonSchema = Schema.object({
  properties: {
    title: Schema.string(),
    deadline: Schema.string(),
  },
  optionalProperties: ['deadline'],
});

export const sprintExtractorModel = getGenerativeModel(ai, {
  mode: InferenceMode.PREFER_ON_DEVICE,
  inCloudParams: {
    model: CLOUD_FALLBACK_MODEL,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: sprintJsonSchema,
    },
  },
  onDeviceParams: {
    promptOptions: {
      responseConstraint: sprintJsonSchema,
    },
  },
});

export const extractSprintFromText = async (pageText, todayStr) => {
  await sprintExtractorModel.initializeDeviceModel().catch(() => {});

  const prompt = [
    `Today is ${todayStr}. Extract sprint or event details from the text below.`,
    'Format all dates as YYYY-MM-DD (or empty string "" if missing).',
    '',
    pageText.slice(0, 6000),
  ].join('\n');

  const result = await sprintExtractorModel.generateContent(prompt);
  const inferenceSource = result.response.inferenceSource;
  const data = JSON.parse(result.response.text());

  console.log('You used: ' + inferenceSource);
  console.log(data);

  return {
    data,
    inferenceSource,
  };
};

export const readActiveTabContent = () =>
  new Promise((resolve, reject) => {
    if (!chrome?.tabs?.query || !chrome?.scripting?.executeScript) {
      reject(new Error('Tab extraction is only available in the Chrome Extension.'));
      return;
    }

    chrome.tabs.query({ active: true, windowType: 'normal' }, ([tab]) => {
      if (!tab?.id) {
        reject(new Error('No active browser tab found.'));
        return;
      }

      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => ({
            url: window.location.href,
            title: document.title,
            text:
              window.getSelection()?.toString().trim() ||
              document.body?.innerText ||
              '',
          }),
        },
        (results) => {
          if (chrome.runtime.lastError || !results?.[0]?.result) {
            reject(
              new Error(
                'Cannot read this tab. Open a standard https:// webpage and try again.',
              ),
            );
            return;
          }
          resolve(results[0].result);
        },
      );
    });
  });

export const extractSprintFromActiveTab = async () => {
  const { url, title, text } = await readActiveTabContent();
  if (!text.trim()) {
    throw new Error('The active tab has no readable text.');
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const combinedText = `Page Title: ${title}\n\n${text}`;
  const { data, inferenceSource } = await extractSprintFromText(
    combinedText,
    todayStr,
  );

  return {
    data: {
      title: data.title || title || '',
      deadline: data.deadline || '',
      url: url || '',
    },
    inferenceSource,
  };
};

// Uncomment for check in console:
// window.testExtractTab = () => extractSprintFromActiveTab();

// Write into console: await window.testExtractTab();
// Return:
// You used: on_device
// {title: '#BuildHybridAI 2026', startDate: '2026-11-18', endDate: '2026-12-01', deadline: '2026-12-01'}
// {data: {title: '#BuildHybridAI 2026',…}, inferenceSource: 'on_device'}

export const adviseScheduleWithAi = async ({
  sprints,
  year,
  month,
  targetRest,
  freeDays,
  overlapDaysCount,
}) => {
  const monthName = new Date(year, month, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const sprintLines = sprints
    .map(
      (s) =>
        `- "${s.name}": ${s.startDate} to ${s.endDate}${s.deadline ? ` (deadline: ${s.deadline})` : ''}, status: ${s.status}`,
    )
    .join('\n');

  const prompt = [
    `You are a concise developer capacity advisor for ${monthName}.`,
    `Target rest: ${targetRest} days. Remaining free/rest days: ${freeDays}. Overlapping sprint days: ${overlapDaysCount}.`,
    'Scheduled sprints:',
    sprintLines || 'None',
    '',
    'Provide 2-3 short, actionable bullet points (max 45 words total):',
    '1) Which sprint to de-scope to a minimal MVP.',
    '2) How to shift start/end work dates to eliminate overlaps and protect rest days.',
  ].join('\n');

  return generateHybridText(prompt);
};

// Uncomment, npm run build, reload app in chrome://extensions
// await window.testAdvisor();
// Return:
// You used: on_device.
// Here's a concise capacity plan: ...
window.testAdvisor = () =>
  adviseScheduleWithAi({
    sprints: [
      { name: 'Sprint A', startDate: '2026-11-18', endDate: '2026-11-25', deadline: '2026-11-25', status: 'Join' },
      { name: 'Sprint B', startDate: '2026-11-20', endDate: '2026-11-28', deadline: '2026-11-30', status: 'Interest' },
    ],
    year: 2026,
    month: 10,
    targetRest: 8,
    freeDays: 3,
    overlapDaysCount: 6,
  });