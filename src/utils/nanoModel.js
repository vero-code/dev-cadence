const EXPECTED_OPTIONS = {
  expectedInputs: [{ type: 'text', languages: ['en'] }],
  expectedOutputs: [{ type: 'text', languages: ['en'] }],
};

let state = {
  status: 'checking',
  progress: null,
  error: '',
};

let abortController = null;
const listeners = new Set();

const notify = () => {
  listeners.forEach((fn) => fn({ ...state }));
};

const setState = (patch) => {
  state = { ...state, ...patch };
  notify();
};

export const subscribeNanoModel = (listener) => {
  listeners.add(listener);
  listener({ ...state });
  return () => listeners.delete(listener);
};

export const checkNanoStatus = async () => {
  if (!('LanguageModel' in self)) {
    setState({ status: 'unavailable', error: '' });
    return;
  }
  try {
    const availability = await LanguageModel.availability(EXPECTED_OPTIONS);
    setState({
      status: availability,
      progress: availability === 'available' ? 100 : state.progress,
      error: '',
    });
  } catch (err) {
    setState({ status: 'unavailable', error: err.message });
  }
};

export const downloadNanoModel = async () => {
  if (abortController) return;
  abortController = new AbortController();
  setState({ status: 'downloading', progress: 0, error: '' });

  try {
    const session = await LanguageModel.create({
      ...EXPECTED_OPTIONS,
      signal: abortController.signal,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Downloaded ${e.loaded * 100}%`);
          setState({ progress: Math.round(e.loaded * 100) });
        });
      },
    });
    session.destroy();
  } catch (err) {
    if (err.name !== 'AbortError') {
      setState({ error: err.message });
    }
  } finally {
    abortController = null;
    await checkNanoStatus();
  }
};

export const cancelNanoDownload = () => {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
};