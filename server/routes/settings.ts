import { Router, Request, Response } from 'express';
import { db } from '../db';
import { SystemSettings } from '../../src/types';

const router = Router();

// Helper to mask API key for safe UI display
function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '';
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

// Get current system settings
router.get('/', async (_req: Request, res: Response) => {
  try {
    const rows = await db.all('SELECT * FROM settings');
    const settingsMap: Record<string, string> = {};
    rows.forEach(r => {
      settingsMap[r.key] = r.value;
    });

    const activeGeminiKey = settingsMap.geminiApiKey || process.env.GEMINI_API_KEY || '';

    const settings: SystemSettings = {
      aiModel: (settingsMap.aiModel as any) || (activeGeminiKey ? 'gemini-1.5-flash' : 'bsai-neural-local'),
      geminiModel: settingsMap.geminiModel || 'gemini-1.5-flash',
      aiTemperature: parseFloat(settingsMap.aiTemperature || '0.4'),
      autoEscalationThreshold: parseFloat(settingsMap.autoEscalationThreshold || '0.70'),
      defaultLanguage: (settingsMap.defaultLanguage as any) || 'en',
      enableVoiceSynthesis: settingsMap.enableVoiceSynthesis === 'true',
      enableSoundEffects: settingsMap.enableSoundEffects === 'true',
      reducedMotion3D: settingsMap.reducedMotion3D === 'true',
      themeMode: 'light',
      notificationsEnabled: settingsMap.notificationsEnabled === 'true',
      apiKeySet: Boolean(activeGeminiKey),
      geminiApiKey: activeGeminiKey ? maskApiKey(activeGeminiKey) : ''
    };

    res.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve system settings' });
  }
});

// Update system settings
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<SystemSettings> & { geminiApiKey?: string };

    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        // If updating API key, skip if it's the masked placeholder
        if (key === 'geminiApiKey' && typeof value === 'string' && value.includes('...')) {
          continue;
        }

        await db.run(
          'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
          [key, String(value)]
        );

        if (key === 'geminiApiKey' && typeof value === 'string' && value.trim()) {
          process.env.GEMINI_API_KEY = value.trim();
        }
      }
    }

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Verify / Test Google Gemini API Key with intelligent model resolution
router.post('/verify-gemini', async (req: Request, res: Response) => {
  try {
    let { apiKey, model } = req.body;
    if (!apiKey || apiKey.includes('...')) {
      const stored = await db.get('SELECT value FROM settings WHERE key = ?', ['geminiApiKey']);
      apiKey = stored?.value || process.env.GEMINI_API_KEY;
    }

    if (!apiKey) {
      return res.status(400).json({ valid: false, message: 'Please enter a Gemini API Key first.' });
    }

    const cleanKey = apiKey.trim();

    // 1. First, attempt to query the models list for this API key
    let availableModels: string[] = [];
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`;
      const listRes = await fetch(listUrl);
      if (listRes.ok) {
        const listData: any = await listRes.json();
        if (Array.isArray(listData.models)) {
          availableModels = listData.models
            .filter((m: any) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
            .map((m: any) => m.name.replace(/^models\//, ''));
        }
      }
    } catch (e) {
      console.warn('Could not list models, trying standard candidate models:', e);
    }

    // 2. Build candidate list prioritizing user choice, available models, then standard models
    const requested = model ? model.replace(/^models\//, '') : '';
    const candidateModels: string[] = Array.from(new Set([
      requested,
      ...availableModels,
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-2.0-flash-exp',
      'gemini-1.5-pro',
      'gemini-1.5-pro-latest',
      'gemini-pro'
    ])).filter(Boolean);

    let lastError = '';
    let successModel = '';
    let candidateText = '';

    // 3. Try each candidate model until one succeeds
    for (const testModel of candidateModels) {
      for (const apiVersion of ['v1beta', 'v1']) {
        try {
          const testUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${testModel}:generateContent?key=${cleanKey}`;
          const response = await fetch(testUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: 'Reply with "Namaste! Bharat Support AI is connected."' }]
                }
              ]
            })
          });

          if (response.ok) {
            const data: any = await response.json();
            candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Connected';
            successModel = testModel;
            break;
          } else {
            const errBody: any = await response.json().catch(() => ({}));
            lastError = errBody?.error?.message || `Status ${response.status}: ${response.statusText}`;
          }
        } catch (e: any) {
          lastError = e.message || 'Network error';
        }
      }
      if (successModel) break;
    }

    if (!successModel) {
      return res.status(400).json({
        valid: false,
        message: lastError || 'No supported Gemini model found for this key. Please check your Google AI Studio permissions.'
      });
    }

    // Save active verified key and successful model to settings database and process.env
    await db.run(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      ['geminiApiKey', cleanKey]
    );
    await db.run(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      ['geminiModel', successModel]
    );
    await db.run(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      ['aiModel', successModel]
    );
    process.env.GEMINI_API_KEY = cleanKey;

    res.json({
      valid: true,
      model: successModel,
      message: `Successfully connected to Google Gemini (${successModel})!`,
      sampleResponse: candidateText.trim()
    });
  } catch (error: any) {
    console.error('Gemini verification error:', error);
    res.status(500).json({ valid: false, message: error.message || 'Failed to verify API key' });
  }
});

export default router;
