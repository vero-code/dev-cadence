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
    startDate: Schema.string(),
    endDate: Schema.string(),
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
      startDate: data.startDate || '',
      endDate: data.endDate || '',
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