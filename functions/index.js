const { setGlobalOptions } = require('firebase-functions');
const { onRequest } = require('firebase-functions/https');
const logger = require('firebase-functions/logger');
const { initializeApp } = require('firebase-admin/app');
const { getAppCheck } = require('firebase-admin/app-check');

initializeApp();
setGlobalOptions({ maxInstances: 5 });

exports.getAppCheckToken = onRequest(async (req, res) => {
  const allowedIds = (process.env.ALLOWED_EXTENSION_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  const allowedOrigins = allowedIds.map((id) => `chrome-extension://${id}`);

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
  }
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (!allowedOrigins.includes(origin)) {
    res.status(403).json({ error: 'Forbidden origin' });
    return;
  }

  const appId = process.env.APPCHECK_WEB_APP_ID;
  if (!appId) {
    res.status(500).json({ error: 'Missing APPCHECK_WEB_APP_ID' });
    return;
  }

  try {
    const { token, ttlMillis } = await getAppCheck().createToken(appId);
    res.status(200).json({
      token,
      expireTimeMillis: Date.now() + ttlMillis,
    });
  } catch (err) {
    logger.error('Failed to mint App Check token', err);
    res.status(500).json({ error: 'Failed to create App Check token' });
  }
});