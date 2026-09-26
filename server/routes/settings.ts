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
    const activeNvidiaKey = settingsMap.nvidiaApiKey || process.env.NVIDIA_API_KEY || '';

    const settings: SystemSettings = {
      aiModel: (settingsMap.aiModel as any) || (activeNvidiaKey ? (settingsMap.nvidiaModel || 'sarvamai/sarvam-2b') : (activeGeminiKey ? 'gemini-1.5-flash' : 'sarvamai/sarvam-2b')),
      geminiModel: settingsMap.geminiModel || 'gemini-1.5-flash',
      nvidiaModel: settingsMap.nvidiaModel || 'sarvamai/sarvam-2b',
      aiProvider: (settingsMap.aiProvider as any) || (activeNvidiaKey ? 'nvidia' : (activeGeminiKey ? 'gemini' : 'nvidia')),
      aiTemperature: parseFloat(settingsMap.aiTemperature || '0.4'),
      autoEscalationThreshold: parseFloat(settingsMap.autoEscalationThreshold || '0.70'),
      defaultLanguage: (settingsMap.defaultLanguage as any) || 'en',
      enableVoiceSynthesis: settingsMap.enableVoiceSynthesis === 'true',
      enableSoundEffects: settingsMap.enableSoundEffects === 'true',
      reducedMotion3D: settingsMap.reducedMotion3D === 'true',
      themeMode: 'light',
      notificationsEnabled: settingsMap.notificationsEnabled === 'true',
      apiKeySet: Boolean(activeGeminiKey),
      geminiApiKey: activeGeminiKey ? maskApiKey(activeGeminiKey) : '',
      nvidiaApiKeySet: Boolean(activeNvidiaKey),
      nvidiaApiKey: activeNvidiaKey ? maskApiKey(activeNvidiaKey) : ''
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
    const body = req.body as Partial<SystemSettings> & { geminiApiKey?: string; nvidiaApiKey?: string };

    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        // If updating API key, skip if it's the masked placeholder
        if ((key === 'geminiApiKey' || key === 'nvidiaApiKey') && typeof value === 'string' && value.includes('...')) {
          continue;
        }

        await db.run(
          'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
          [key, String(value)]
        );

        if (key === 'geminiApiKey' && typeof value === 'string' && value.trim()) {
          process.env.GEMINI_API_KEY = value.trim();
        }
        if (key === 'nvidiaApiKey' && typeof value === 'string' && value.trim()) {
          process.env.NVIDIA_API_KEY = value.trim();
        }
      }
    }

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Verify / Test NVIDIA NIM API Key with Sarvam AI
router.post('/verify-nvidia', async (req: Request, res: Response) => {
  try {
    let { apiKey, model } = req.body;
    if (!apiKey || apiKey.includes('...')) {
      const stored = await db.get('SELECT value FROM settings WHERE key = ?', ['nvidiaApiKey']);
      apiKey = stored?.value || process.env.NVIDIA_API_KEY;
    }

    if (!apiKey) {
      return res.status(400).json({ valid: false, message: 'Please enter an NVIDIA NIM API Key first.' });
    }

    const cleanKey = apiKey.trim();
    const targetModel = model || 'sarvamai/sarvam-2b';

    const testRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanKey}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [
          { role: 'user', content: 'Namaste! Please reply with "Bharat Support AI is connected."' }
        ],
        temperature: 0.2,
        max_tokens: 64
      })
    });

    if (!testRes.ok) {
      const errData: any = await testRes.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `NVIDIA returned HTTP ${testRes.status}: ${testRes.statusText}`;
      return res.status(400).json({
        valid: false,
        message: `NVIDIA verification failed: ${errMsg}`
      });
    }

    const data: any = await testRes.json();
    const candidateText = data?.choices?.[0]?.message?.content || 'Namaste! Bharat Support AI is connected.';

    // Save active verified key and model to settings database and process.env
    await db.run(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      ['nvidiaApiKey', cleanKey]
    );
    await db.run(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      ['nvidiaModel', targetModel]
    );
    await db.run(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      ['aiProvider', 'nvidia']
    );
    await db.run(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      ['aiModel', targetModel]
    );
    process.env.NVIDIA_API_KEY = cleanKey;

    res.json({
      valid: true,
      model: targetModel,
      message: `Successfully connected to NVIDIA NIM (${targetModel})! Sarvam Indic language AI is now active.`,
      sampleResponse: candidateText.trim().slice(0, 140)
    });
  } catch (error: any) {
    console.error('NVIDIA verification error:', error);
    res.status(500).json({ valid: false, message: error.message || 'Failed to verify NVIDIA API key' });
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
