import { initializeApp } from 'firebase/app';
import { initializeAppCheck, CustomProvider } from 'firebase/app-check';
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  InferenceMode,
} from 'firebase/ai';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

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

const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

export const model = getGenerativeModel(ai, {
  mode: InferenceMode.PREFER_ON_DEVICE,
  inCloudParams: { model: 'gemini-4-hydrogen' },
});

export const generateHybridText = async (prompt) => {
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