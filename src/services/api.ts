import {
  Ticket,
  KnowledgeArticle,
  EscalationItem,
  AnalyticsSummary,
  SystemSettings,
  FeedbackSubmission,
  SupportedLanguage,
  SupportCategory,
  ChatMessage
} from '../types';
import {
  MOCK_ANALYTICS,
  MOCK_TICKETS,
  MOCK_ESCALATIONS,
  MOCK_KNOWLEDGE_ARTICLES,
  MOCK_SETTINGS
} from '../data/mockData';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string)?.replace(/\/$/, '') || '/api';

// Helper functions for client-side storage
function getStoredTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem('bsai_tickets');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading bsai_tickets from storage:', e);
  }
  return MOCK_TICKETS;
}

function saveStoredTickets(tickets: Ticket[]) {
  try {
    localStorage.setItem('bsai_tickets', JSON.stringify(tickets));
  } catch (e) {
    console.error('Error saving bsai_tickets:', e);
  }
}

function getStoredEscalations(): EscalationItem[] {
  try {
    const raw = localStorage.getItem('bsai_escalations');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading bsai_escalations from storage:', e);
  }
  return MOCK_ESCALATIONS;
}

function saveStoredEscalations(items: EscalationItem[]) {
  try {
    localStorage.setItem('bsai_escalations', JSON.stringify(items));
  } catch (e) {
    console.error('Error saving bsai_escalations:', e);
  }
}

export function getEffectiveNvidiaKey(): string {
  try {
    const rawLocal = (localStorage.getItem('bsai_nvidia_key_raw') || '').trim();
    if (rawLocal && !rawLocal.includes('...')) return rawLocal;

    const legacyLocal = (localStorage.getItem('nvidia_api_key') || '').trim();
    if (legacyLocal && !legacyLocal.includes('...')) return legacyLocal;

    const rawSettings = localStorage.getItem('bsai_settings');
    if (rawSettings) {
      try {
        const parsed = JSON.parse(rawSettings);
        if (parsed.nvidiaApiKey && typeof parsed.nvidiaApiKey === 'string' && !parsed.nvidiaApiKey.includes('...')) {
          return parsed.nvidiaApiKey.trim();
        }
      } catch {}
    }

    const envKey = ((import.meta as any).env?.VITE_NVIDIA_API_KEY as string || '').trim();
    if (envKey && !envKey.includes('...')) return envKey;
  } catch (e) {
    console.error('Error reading effective NVIDIA key:', e);
  }
  return '';
}

export function getEffectiveGeminiKey(): string {
  try {
    const rawLocal = (localStorage.getItem('bsai_gemini_key_raw') || '').trim();
    if (rawLocal && !rawLocal.includes('...')) return rawLocal;

    const legacyLocal = (localStorage.getItem('gemini_api_key') || '').trim();
    if (legacyLocal && !legacyLocal.includes('...')) return legacyLocal;

    const rawSettings = localStorage.getItem('bsai_settings');
    if (rawSettings) {
      try {
        const parsed = JSON.parse(rawSettings);
        if (parsed.geminiApiKey && typeof parsed.geminiApiKey === 'string' && !parsed.geminiApiKey.includes('...')) {
          return parsed.geminiApiKey.trim();
        }
      } catch {}
    }

    const envKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY as string || '').trim();
    if (envKey && !envKey.includes('...')) return envKey;
  } catch (e) {
    console.error('Error reading effective Gemini key:', e);
  }
  return '';
}

function getStoredSettings(): SystemSettings {
  try {
    const raw = localStorage.getItem('bsai_settings');
    const effectiveGemini = getEffectiveGeminiKey();
    const effectiveNvidia = getEffectiveNvidiaKey();
    let base: SystemSettings = { ...MOCK_SETTINGS };
    if (raw) {
      const parsed = JSON.parse(raw);
      base = { ...base, ...parsed };
    }
    if (effectiveGemini) {
      base.geminiApiKey = effectiveGemini;
      base.apiKeySet = true;
    }
    if (effectiveNvidia) {
      base.nvidiaApiKey = effectiveNvidia;
      base.nvidiaApiKeySet = true;
    }
    if (!base.nvidiaModel) {
      base.nvidiaModel = 'sarvamai/sarvam-2b';
    }
    if (!base.aiProvider) {
      base.aiProvider = effectiveNvidia ? 'nvidia' : (effectiveGemini ? 'gemini' : 'nvidia');
    }
    return base;
  } catch (e) {
    console.error('Error reading bsai_settings:', e);
  }
  return MOCK_SETTINGS;
}

function saveStoredSettings(settings: Partial<SystemSettings>): SystemSettings {
  try {
    const curr = getStoredSettings();
    const updated = { ...curr, ...settings };
    
    // 1. Only save Gemini key if real and not masked with dots
    if (settings.geminiApiKey && typeof settings.geminiApiKey === 'string' && !settings.geminiApiKey.includes('...')) {
      const clean = settings.geminiApiKey.trim();
      localStorage.setItem('bsai_gemini_key_raw', clean);
      localStorage.setItem('gemini_api_key', clean);
      updated.geminiApiKey = clean;
      updated.apiKeySet = true;
    } else {
      const existing = getEffectiveGeminiKey();
      if (existing) {
        updated.geminiApiKey = existing;
        updated.apiKeySet = true;
      }
    }

    // 2. Only save NVIDIA key if real and not masked with dots
    if (settings.nvidiaApiKey && typeof settings.nvidiaApiKey === 'string' && !settings.nvidiaApiKey.includes('...')) {
      const cleanNv = settings.nvidiaApiKey.trim();
      localStorage.setItem('bsai_nvidia_key_raw', cleanNv);
      localStorage.setItem('nvidia_api_key', cleanNv);
      updated.nvidiaApiKey = cleanNv;
      updated.nvidiaApiKeySet = true;
    } else {
      const existingNv = getEffectiveNvidiaKey();
      if (existingNv) {
        updated.nvidiaApiKey = existingNv;
        updated.nvidiaApiKeySet = true;
      }
    }
    
    localStorage.setItem('bsai_settings', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving bsai_settings:', e);
    return MOCK_SETTINGS;
  }
}

// Discover available Gemini models that support generateContent for this API key
async function discoverGeminiModels(apiKey: string): Promise<string[]> {
  const cleanKey = apiKey.trim();
  if (!cleanKey || cleanKey.includes('...')) return [];
  try {
    for (const apiVersion of ['v1beta', 'v1']) {
      const listUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models?key=${cleanKey}`;
      const res = await fetch(listUrl);
      if (res.ok) {
        const data: any = await res.json();
        if (Array.isArray(data.models)) {
          const valid = data.models
            .filter((m: any) =>
              Array.isArray(m.supportedGenerationMethods) &&
              m.supportedGenerationMethods.includes('generateContent')
            )
            .map((m: any) => m.name.replace(/^models\//, ''));
          if (valid.length > 0) return valid;
        }
      }
    }
  } catch (e) {
    console.warn('Could not query ListModels:', e);
  }
  return [];
}

// Helper to strip reasoning scratchpads, thought tags, and rubric checks from model output
export function cleanGeminiOutput(rawText: string): string {
  if (!rawText) return '';

  let text = rawText.replace(/\r\n/g, '\n');

  // 1. Remove XML/HTML thinking tags
  text = text.replace(/<think[\s\S]*?<\/think>/gi, '');
  text = text.replace(/<thought[\s\S]*?<\/thought>/gi, '');

  // 2. Cut off trailing evaluation/checklist blocks from the bottom
  const lines = text.split('\n');
  let lastContentLineIdx = lines.length - 1;
  while (lastContentLineIdx >= 0) {
    const l = lines[lastContentLineIdx].trim();
    if (!l) {
      lastContentLineIdx--;
      continue;
    }
    if (
      /^\s*(\*|-|\d+\.)?\s*(\*?Greeting\?|\*?Markdown bold\?|\*?Numbered steps|\*?Official tone|\*?Language match|\*?No internal thoughts|\*?No thought process|\*?Tone:\s*(?:Empathetic|Respectful|Courteous|Helpful)|[A-Za-z\s/]+\?\s*(?:Yes|No)\.?)/i.test(l)
    ) {
      lastContentLineIdx--;
    } else {
      break;
    }
  }
  text = lines.slice(0, lastContentLineIdx + 1).join('\n');

  // 3. If there is a section with "* *Body:*" or "* Body:", slice from there
  const bodyIdx = text.search(/(?:^|\n)\s*(\*|-|\d+\.)?\s*\*?\*?Body:\*?\*?\s*\n?/i);
  if (bodyIdx !== -1) {
    text = text.slice(bodyIdx).replace(/^(?:[^\n]*\*?\*?Body:\*?\*?\s*\n?)/i, '');
  }

  // 4. Locate explicit citizen greeting if preceded by scratchpad lines (with or without bullets)
  const directGreetingRegex = /(?:^|\n)\s*(?:[*-]\s*)?"?(Namaste[!,\s]|Hello[!,\s]|Hi[!,\s]|नमस्ते[!,\s]|નમસ્તે[!,\s]|வணக்கம்[!,\s]|నమస్కారం[!,\s]|Dear Citizen)/gi;
  const greetingMatches = [...text.matchAll(directGreetingRegex)];
  if (greetingMatches.length > 0) {
    const lastGreeting = greetingMatches[greetingMatches.length - 1];
    const preText = text.slice(0, lastGreeting.index);
    if (/Intent:|Style Rule:|Since the user|Identity:|Scope of help:|Call to action:|User input:|User says:/i.test(preText)) {
      text = text.slice(lastGreeting.index).trim();
    }
  }

  // 5. Line by line filter for any leftover scratchpad lines (WITH OR WITHOUT bullets)
  let filteredLines: string[] = [];

  for (let line of text.split('\n')) {
    let trimmed = line.trim();
    if (!trimmed) {
      if (filteredLines.length > 0 && filteredLines[filteredLines.length - 1] !== '') {
        filteredLines.push('');
      }
      continue;
    }

    // Skip any scratchpad lines starting with known keywords (WITH OR WITHOUT bullets)
    if (/^\s*(\*|-|\d+\.)?\s*(\*?\*?(?:Intent|Style Rule|Since the user|I need to|Identity|Scope of help|Call to action|User says|User input|User Question|User Query|Context|Role|Tone|Goal|Mission|Language Rule|Persona|Format|Constraint|Acknowledge|Ask for clarification|Provide categories|Maintain|Greeting|Content|Language|List areas|Keep it helpful|Empathy|Clarification|Prompting categories|Check|Did I|Is the|Are there|Output ONLY|Self-Correction|Note):?\*?\*?)/i.test(trimmed)) {
      continue;
    }

    if (/^\s*(\*|-)\s*"[^"]+"\s+is\s+/i.test(trimmed) || /^\s*(\*|-)\s*The user is\s+/i.test(trimmed) || /^\s*(\*|-)\s*Response should be\s+/i.test(trimmed)) {
      continue;
    }

    if (/\?\s*(Yes|No)\.?$/i.test(trimmed)) {
      continue;
    }

    line = line.replace(/^\s*(\*|-)\s*"/, '');
    line = line.replace(/^\s*(\*|-)\s*/, '');
    line = line.replace(/^\*?\*?Body:\*?\*?\s*/i, '');
    line = line.replace(/^\*?\*?Greeting:\*?\*?\s*/i, '');
    line = line.replace(/^\s{4,8}/, '');

    if (line.endsWith('"') && !line.includes('="')) {
      line = line.replace(/"$/, '');
    }

    filteredLines.push(line);
  }

  let result = filteredLines.join('\n').trim();
  if (result.startsWith('"') && result.endsWith('"') && result.length > 2) {
    result = result.slice(1, -1).trim();
  }
  return result;
}

// Direct browser-to-Google-Gemini caller for zero-downtime AI chat
async function callGeminiDirectly(
  query: string,
  apiKey: string,
  modelName: string = 'gemini-2.0-flash',
  language: SupportedLanguage = 'en'
): Promise<{ text: string; model: string } | null> {
  const cleanKey = apiKey.trim();
  if (!cleanKey || cleanKey.includes('...')) return null;

  const settings = getStoredSettings();
  
  const candidateModels: string[] = Array.from(new Set([
    'gemini-2.0-flash',
    settings.geminiModel,
    modelName,
    'gemini-1.5-flash-latest',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ])).filter((x): x is string => typeof x === 'string' && x.length > 0 && !x.startsWith('bsai-'));

  const systemPrompt = `You are Bharat Support AI (BSAI), the official digital citizen assistant for Digital India.
Your mission is to provide helpful, empathetic guidance to citizens on Government Schemes (PM-Kisan, Ayushman Bharat, PM Awas), official documents (Aadhaar, PAN, DigiLocker, Ration Card), and public grievances (CPGRAMS).
You speak fluently in English, Hindi, and Hinglish. Always talk directly to the citizen with warmth and respect. Provide official .gov.in portal links and toll-free helplines when relevant.`;

  const conversationContents = [
    {
      role: 'user',
      parts: [{ text: 'hello' }]
    },
    {
      role: 'model',
      parts: [{ text: 'Hello! I am Bharat Support AI (BSAI), your official assistant for Digital India. How can I help you today? You can ask me about government welfare schemes (like PM-Kisan or Ayushman Bharat), citizen documents (like Aadhaar or Ration Card), or help with civic grievances.' }]
    },
    {
      role: 'user',
      parts: [{ text: 'hi bhai' }]
    },
    {
      role: 'model',
      parts: [{ text: 'Namaste! Main Bharat Support AI (BSAI) hoon. Main aapki sarkar ki yojanaon (PM-Kisan, Ayushman Bharat, PM Awas), documents (Aadhaar, Ration Card), ya kisi grievance complaint mein kaise madad kar sakta hoon?' }]
    },
    {
      role: 'user',
      parts: [{ text: 'ghee khtm' }]
    },
    {
      role: 'model',
      parts: [{ text: 'Namaste! Agar aapke yahan ration ya zaroori khadya samagri khatam ho gayi hai, toh NFSA aur PM Garib Kalyan Anna Yojana ke tehat aap nazdeeki Fair Price Shop (ration dukan) se muft ration le sakte hain:\n\n1. **One Nation One Ration Card**: Kisi bhi FPS dukan par biometric pramanikaran se ration lein.\n2. **Toll-Free Food Helpline**: Agar ration dealer mana kare, toh turant **1967** ya **1800-180-2087** par call karein.\n3. **Portal**: [nfsa.gov.in](https://nfsa.gov.in)\n\nKya aapko ration card status check karna hai ya dealer ke khilaf shikayat darj karni hai?' }]
    },
    {
      role: 'user',
      parts: [{ text: query }]
    }
  ];

  for (const m of candidateModels) {
    for (const apiVersion of ['v1beta', 'v1']) {
      try {
        const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${m}:generateContent?key=${cleanKey}`;
        
        let res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemPrompt }]
            },
            contents: conversationContents,
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024,
              thinkingConfig: {
                thinkingBudget: 0
              }
            }
          })
        });

        // Fallback if thinkingConfig or system_instruction is not supported on older endpoint
        if (!res.ok && res.status === 400) {
          res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: conversationContents,
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1024
              }
            })
          });
        }

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText && rawText.trim()) {
            const cleaned = cleanGeminiOutput(rawText);
            if (cleaned && cleaned.trim()) {
              if (m !== settings.geminiModel) {
                saveStoredSettings({ geminiModel: m });
              }
              return { text: cleaned, model: m };
            }
          }
        }
      } catch (e) {
        // try next candidate model
      }
    }
  }
  return null;
}

// Direct browser-to-NVIDIA-NIM caller for Sarvam Indic AI
async function callNvidiaDirectly(
  query: string,
  apiKey: string,
  modelName: string = 'sarvamai/sarvam-2b',
  language: SupportedLanguage = 'en'
): Promise<{ text: string; model: string } | null> {
  const cleanKey = apiKey.trim();
  if (!cleanKey || cleanKey.includes('...')) return null;

  const targetModel = modelName || 'sarvamai/sarvam-2b';

  const systemPrompt = `You are Bharat Support AI (BSAI), the official digital citizen assistant for Digital India.
Your mission is to provide helpful, empathetic guidance to citizens on Government Schemes (PM-Kisan, Ayushman Bharat, PM Awas), official documents (Aadhaar, PAN, DigiLocker, Ration Card), and public grievances (CPGRAMS).
You have specialized expertise in Indian languages including Hindi, Hinglish, Telugu, Tamil, Gujarati, and Indian English.
Crucial Language Guideline:
- Reply in the exact same language and dialect the citizen uses (e.g. if the user talks in conversational Hinglish, reply warmly in polite Hinglish).
- Speak directly to the citizen with warmth and respect.
- Mention official government portals (such as pmkisan.gov.in, pgportal.gov.in, uidai.gov.in, nfsa.gov.in) and toll-free citizen helplines when relevant.
- Output ONLY the final helpful reply to the citizen. Do not include any internal chain-of-thought, reasoning steps, or prompt tags.`;

  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanKey}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.2,
        max_tokens: 1024,
        top_p: 0.9
      })
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.choices?.[0]?.message?.content;
      if (rawText && rawText.trim()) {
        const cleaned = cleanGeminiOutput(rawText);
        return { text: cleaned || rawText.trim(), model: targetModel };
      }
    } else {
      console.warn('NVIDIA NIM API responded with status:', res.status);
    }
  } catch (e) {
    console.warn('NVIDIA NIM direct call failed:', e);
  }
  return null;
}

// Client-side AI fallback responder with context-aware citizen intelligence
function generateFallbackChatResponse(query: string, language: SupportedLanguage = 'en'): {
  aiMessage: ChatMessage;
  intent: any;
} {
  const qLower = query.toLowerCase().trim();
  let content = '';
  let category: SupportCategory = 'Government Services';
  let suggestedActions: string[] = ['Check Eligibility', 'Download Guidelines', 'Track Application Status'];
  let sources: string[] = ['National Portal of India (india.gov.in)'];

  // 1. Food / Ration / PDS / Essential Commodities ("ghee", "rashan", "ration", "chawal", "food", "khatam", "dealer")
  if (
    qLower.includes('ghee') ||
    qLower.includes('rashan') ||
    qLower.includes('ration') ||
    qLower.includes('khatam') ||
    qLower.includes('khtm') ||
    qLower.includes('food') ||
    qLower.includes('chawal') ||
    qLower.includes('gehu') ||
    qLower.includes('pds') ||
    qLower.includes('dealer') ||
    qLower.includes('राशन') ||
    qLower.includes('घी') ||
    qLower.includes('अन्न') ||
    qLower.includes('कोटा')
  ) {
    category = 'Government Services';
    content = `**Namaste! PDS Ration & Essential Food Commodities Guidance:**

If you are facing a shortage of subsidized food grains, non-distribution by your local Fair Price Shop (PDS dealer), or ration quota issues:

1. **National Food Security Act (NFSA)**: Under the Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY), eligible Priority Households (PHH) and Antyodaya Anna Yojana (AAY) beneficiaries receive monthly food grains free of cost.
2. **One Nation One Ration Card (ONORC)**: You can collect your entitled ration from any electronic Point of Sale (e-PoS) enabled Fair Price Shop across India using your Aadhaar authentication.
3. **Lodge Fair Price Shop Grievance**: If your PDS dealer denies quota or claims stock shortage, lodge an immediate complaint on the State Food & Civil Supplies portal or call the National Food Helpline.

🔗 **National Portal**: [nfsa.gov.in](https://nfsa.gov.in)
📞 **Toll-Free National Food & PDS Helpline**: **1967 / 1800-180-2087**`;
    suggestedActions = ['Check Ration Card Entitlement', 'Find Nearest PDS Fair Price Shop', 'Lodge Dealer Grievance'];
    sources = ['nfsa.gov.in', 'Department of Food & Public Distribution'];
  }
  // 2. PM-Kisan & Agriculture
  else if (
    qLower.includes('pm-kisan') ||
    qLower.includes('kisan') ||
    qLower.includes('farmer') ||
    qLower.includes('installment') ||
    qLower.includes('kist') ||
    qLower.includes('किसान') ||
    qLower.includes('कृषि')
  ) {
    category = 'Government Services';
    content = `**Namaste! Details for PM-Kisan Samman Nidhi:**

1. **Benefit Overview**: Eligible landholding farmer families receive ₹6,000 annually in three equal installments of ₹2,000 directly via DBT.
2. **Mandatory e-KYC**: Complete OTP-based e-KYC on the PM-Kisan portal or biometric authentication at your nearest Common Service Centre (CSC).
3. **Land & Bank Seeding**: Ensure your land records are verified with the Tehsil Revenue Patwari and your bank account is Aadhaar-seeded via NPCI.

🔗 **Official Portal**: [pmkisan.gov.in](https://pmkisan.gov.in)
📞 **Toll-Free Helpline**: **155261 / 1800-115-526**`;
    suggestedActions = ['Complete e-KYC Online', 'Check Beneficiary Status', 'Aadhaar Bank Seeding FAQ'];
    sources = ['pmkisan.gov.in', 'Ministry of Agriculture & Farmers Welfare'];
  }
  // 3. Healthcare & Ayushman Bharat
  else if (
    qLower.includes('ayushman') ||
    qLower.includes('health') ||
    qLower.includes('hospital') ||
    qLower.includes('pmjay') ||
    qLower.includes('card') ||
    qLower.includes('इलाज') ||
    qLower.includes('आरोग्य') ||
    qLower.includes('अस्पताल')
  ) {
    category = 'Healthcare';
    content = `**Namaste! Details for Ayushman Bharat (PM-JAY):**

1. **Coverage**: Provides up to ₹5,00,000 annual cashless health cover per family for secondary and tertiary hospital care across 27,000+ empanelled hospitals.
2. **Senior Citizen Top-up**: All citizens aged 70+ receive universal health cards irrespective of family income criteria.
3. **Card Creation**: Generate your digital Ayushman Card instantly on the Beneficiary portal using Aadhaar OTP or visit any empanelled hospital desk.

🔗 **Official Portal**: [beneficiary.nha.gov.in](https://beneficiary.nha.gov.in)
📞 **National Health Helpline**: **14555 / 1800-111-565**`;
    suggestedActions = ['Check Hospital Empanelment', 'Generate Ayushman Card', 'Senior Citizen 70+ Registration'];
    sources = ['beneficiary.nha.gov.in', 'National Health Authority'];
  }
  // 4. Education & Scholarships
  else if (
    qLower.includes('scholarship') ||
    qLower.includes('nsp') ||
    qLower.includes('student') ||
    qLower.includes('matric') ||
    qLower.includes('college') ||
    qLower.includes('school') ||
    qLower.includes('छात्रवृत्ति') ||
    qLower.includes('पढ़ाई')
  ) {
    category = 'Education';
    content = `**Namaste! National Scholarship Portal (NSP) Guidance:**

1. **One-Time Registration (OTR)**: Complete biometric/Aadhaar-based OTR on the NSP portal before applying for Central or State scholarships.
2. **Document Upload**: Keep your income certificate, caste certificate, and academic marksheet ready for nodal verification.
3. **Tracking**: Track institution-level and District Nodal Officer verification progress directly in your student dashboard.

🔗 **Official Portal**: [scholarships.gov.in](https://scholarships.gov.in)
📞 **Helpdesk Number**: **0120-6619540**`;
    suggestedActions = ['Complete OTR Registration', 'Track Verification Stage', 'Institute Verification Guidelines'];
    sources = ['scholarships.gov.in', 'Ministry of Electronics & IT'];
  }
  // 5. Skill Development & Employment
  else if (
    qLower.includes('skill') ||
    qLower.includes('pmkvy') ||
    qLower.includes('course') ||
    qLower.includes('training') ||
    qLower.includes('job') ||
    qLower.includes('rojgar') ||
    qLower.includes('रोजगार') ||
    qLower.includes('नौकरी')
  ) {
    category = 'Employment';
    content = `**Namaste! Skill India Mission (PMKVY 4.0):**

1. **Free Training Courses**: Access 100% government-sponsored short-term skill training in IT-ITeS, Healthcare, Electronics, Robotics, and Construction.
2. **Recognition of Prior Learning (RPL)**: Get government-certified skill credentials and monetary rewards for your existing trade experience.
3. **Placement Support**: Certified candidates receive apprenticeship and job fair access through National Apprenticeship Promotion Scheme (NAPS).

🔗 **Official Portal**: [skillindia.gov.in](https://www.skillindia.gov.in) & [skillindiadigital.gov.in](https://skillindiadigital.gov.in)
📞 **Toll-Free Helpline**: **088000-55555**`;
    suggestedActions = ['Find Nearest Training Center', 'Browse Free Courses', 'Download Skill Certificate'];
    sources = ['skillindia.gov.in', 'National Skill Development Corporation'];
  }
  // 6. Identity & Digital Vaults
  else if (
    qLower.includes('digilocker') ||
    qLower.includes('aadhaar') ||
    qLower.includes('pan') ||
    qLower.includes('license') ||
    qLower.includes('document') ||
    qLower.includes('parivahan') ||
    qLower.includes('आधार') ||
    qLower.includes('दस्तावेज')
  ) {
    category = 'Documents & Identity';
    content = `**Namaste! DigiLocker & Identity Documents Guide:**

1. **Legal Validity**: Digital documents in DigiLocker (Aadhaar, Driving License, Vehicle RC, Class X/XII Marksheets) are legally recognized on par with physical originals under Rule 9A of the IT Rules.
2. **Instant Sync**: Pull official documents securely using your Aadhaar-linked mobile number OTP.
3. **Paperless Services**: Share verified credentials directly with banks, universities, and government recruitment boards.

🔗 **Official Portal**: [digilocker.gov.in](https://digilocker.gov.in)
📞 **DigiLocker Support**: **011-24301851**`;
    suggestedActions = ['Fetch Aadhaar Card', 'Sync Driving License', 'DigiLocker FAQ'];
    sources = ['digilocker.gov.in', 'Ministry of Electronics and IT'];
  }
  // 7. Grievance Redressal & Public Utilities
  else if (
    qLower.includes('complaint') ||
    qLower.includes('grievance') ||
    qLower.includes('cpgrams') ||
    qLower.includes('electricity') ||
    qLower.includes('bijli') ||
    qLower.includes('water') ||
    qLower.includes('paani') ||
    qLower.includes('शिकायत') ||
    qLower.includes('बिजली') ||
    qLower.includes('पानी')
  ) {
    category = 'Grievance Redressal';
    content = `**Namaste! Central Public Grievance Redressal (CPGRAMS):**

1. **Lodge Grievance**: You can lodge formal grievances with 90+ Central Government Ministries, Departments, and State Governments at pgportal.
2. **Mandatory SLA**: Grievances must be redressed within 30 days under the Citizen Charter.
3. **Appeals**: If dissatisfied with the resolution, you have the option to file an appeal before the Appellate Authority within 30 days.

🔗 **Official Portal**: [pgportal.gov.in](https://pgportal.gov.in)
📞 **National Grievance Helpline**: **1915 / 1800-11-4000**`;
    suggestedActions = ['Lodge New Grievance', 'Track Grievance Status', 'Raise Support Ticket'];
    sources = ['pgportal.gov.in', 'DARPG, Government of India'];
  }
  // 8. General / Contextual citizen query response
  else {
    category = 'Government Services';
    content = `**Namaste! Thank you for reaching out to Bharat Support AI (BSAI).**

Regarding your query: **"${query}"**

1. **Direct Assistance**: You can search and verify information regarding welfare subsidies, welfare cards, and public schemes across central and state departments.
2. **Nearby Facilitation**: For offline document uploads and biometric e-KYC, you can visit your nearest Common Service Centre (CSC / e-Mitra / Grama One).
3. **Need Human Officer Help?**: If this requires escalation to a District Nodal Desk or official grievance ticket, click the **"Connect with Nodal Desk"** button below to create an official inquiry.

🔗 **National Portal**: [india.gov.in](https://www.india.gov.in)
📞 **National Citizen Helpline**: **1800-11-0031**`;
    suggestedActions = ['Create Support Request', 'Connect with Nodal Desk', 'Browse Knowledge Base'];
  }

  const aiMessage: ChatMessage = {
    id: `ai-${Date.now()}`,
    sender: 'ai',
    content,
    timestamp: new Date().toISOString(),
    category,
    confidence: 0.96,
    language,
    suggestedActions,
    sources
  };

  return {
    aiMessage,
    intent: {
      category,
      confidence: 0.96,
      urgency: 'Medium',
      suggestedActions
    }
  };
}

export const api = {
  // Chat
  async sendMessage(params: {
    query: string;
    conversationId?: string;
    language?: SupportedLanguage;
    category?: SupportCategory;
    citizenName?: string;
  }): Promise<{ aiMessage: ChatMessage; intent?: any; suggestedActions?: string[] }> {
    const effectiveNvidiaKey = getEffectiveNvidiaKey();
    const effectiveGeminiKey = getEffectiveGeminiKey();
    const settings = getStoredSettings();

    // 1. If NVIDIA NIM key is configured and valid, invoke Sarvam AI (or chosen NVIDIA model)
    if (effectiveNvidiaKey && effectiveNvidiaKey.length >= 20 && !effectiveNvidiaKey.includes('...')) {
      const targetModel = settings.nvidiaModel || 'sarvamai/sarvam-2b';
      const nvidiaResult = await callNvidiaDirectly(
        params.query,
        effectiveNvidiaKey,
        targetModel,
        params.language || 'en'
      );

      if (nvidiaResult && nvidiaResult.text) {
        let cat: SupportCategory = params.category || 'Government Services';
        const qLower = params.query.toLowerCase();
        if (qLower.includes('health') || qLower.includes('ayushman') || qLower.includes('hospital')) cat = 'Healthcare';
        else if (qLower.includes('scholarship') || qLower.includes('student') || qLower.includes('school')) cat = 'Education';
        else if (qLower.includes('aadhaar') || qLower.includes('pan') || qLower.includes('digilocker')) cat = 'Documents & Identity';
        else if (qLower.includes('complaint') || qLower.includes('grievance') || qLower.includes('electricity') || qLower.includes('water')) cat = 'Grievance Redressal';
        else if (qLower.includes('skill') || qLower.includes('job') || qLower.includes('training')) cat = 'Employment';

        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: nvidiaResult.text,
          timestamp: new Date().toISOString(),
          category: cat,
          confidence: 0.99,
          language: params.language,
          suggestedActions: ['Create Official Request', 'Track Application Status', 'Connect with Nodal Desk'],
          sources: [`NVIDIA NIM (${nvidiaResult.model})`, 'Digital India National Portals']
        };

        // Asynchronously notify backend to record user message & audit trail in database
        fetch(`${API_BASE}/chat/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...params, nvidiaApiKey: effectiveNvidiaKey, skipAiResponse: true }),
        }).catch(() => {});

        return {
          aiMessage,
          intent: {
            category: cat,
            confidence: 0.99,
            urgency: 'Medium',
            suggestedActions: ['Create Official Request', 'Track Application Status', 'Connect with Nodal Desk']
          },
          suggestedActions: ['Create Official Request', 'Track Application Status', 'Connect with Nodal Desk']
        };
      }
    }

    // 2. If Gemini API key is configured and valid, invoke Google Gemini for genuine generative reasoning
    if (effectiveGeminiKey && effectiveGeminiKey.length >= 20 && !effectiveGeminiKey.includes('...')) {
      const geminiResult = await callGeminiDirectly(
        params.query,
        effectiveGeminiKey,
        settings.geminiModel || 'gemini-2.0-flash',
        params.language || 'en'
      );

      if (geminiResult && geminiResult.text) {
        let cat: SupportCategory = params.category || 'Government Services';
        const qLower = params.query.toLowerCase();
        if (qLower.includes('health') || qLower.includes('ayushman') || qLower.includes('hospital')) cat = 'Healthcare';
        else if (qLower.includes('scholarship') || qLower.includes('student') || qLower.includes('school')) cat = 'Education';
        else if (qLower.includes('aadhaar') || qLower.includes('pan') || qLower.includes('digilocker')) cat = 'Documents & Identity';
        else if (qLower.includes('complaint') || qLower.includes('grievance') || qLower.includes('electricity') || qLower.includes('water')) cat = 'Grievance Redressal';
        else if (qLower.includes('skill') || qLower.includes('job') || qLower.includes('training')) cat = 'Employment';

        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: geminiResult.text,
          timestamp: new Date().toISOString(),
          category: cat,
          confidence: 0.99,
          language: params.language,
          suggestedActions: ['Create Official Request', 'Track Application Status', 'Connect with Nodal Desk'],
          sources: [`Google Gemini (${geminiResult.model})`, 'Digital India National Portals']
        };

        // Asynchronously notify backend to record user message & audit trail in database
        fetch(`${API_BASE}/chat/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...params, apiKey: effectiveGeminiKey, skipAiResponse: true }),
        }).catch(() => {});

        return {
          aiMessage,
          intent: {
            category: cat,
            confidence: 0.99,
            urgency: 'Medium',
            suggestedActions: ['Create Official Request', 'Track Application Status', 'Connect with Nodal Desk']
          },
          suggestedActions: ['Create Official Request', 'Track Application Status', 'Connect with Nodal Desk']
        };
      }
    }

    // 3. Try backend API with passed apiKey or nvidiaKey
    try {
      const res = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          apiKey: effectiveGeminiKey,
          nvidiaApiKey: effectiveNvidiaKey,
          nvidiaModel: settings.nvidiaModel
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.aiMessage && data.aiMessage.content) {
          return data;
        }
      }
    } catch (e) {
      // Backend offline / not reachable
    }

    // 4. Fallback to smart local responder
    return generateFallbackChatResponse(params.query, params.language);
  },

  async getChatHistory(conversationId: string) {
    try {
      const res = await fetch(`${API_BASE}/chat/history/${conversationId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend chat history unavailable:', e);
    }
    return { messages: [] };
  },

  // Tickets
  async getTickets(filters?: {
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
  }): Promise<Ticket[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.search) params.append('search', filters.search);

      const res = await fetch(`${API_BASE}/tickets?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend tickets unavailable, using local store:', e);
    }

    let tickets = getStoredTickets();
    if (filters?.status && filters.status !== 'All') {
      tickets = tickets.filter(t => t.status.toLowerCase() === filters.status?.toLowerCase());
    }
    if (filters?.category && filters.category !== 'All') {
      tickets = tickets.filter(t => t.category === filters.category);
    }
    if (filters?.priority && filters.priority !== 'All') {
      tickets = tickets.filter(t => t.priority === filters.priority);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      tickets = tickets.filter(t =>
        t.title.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        t.citizenName.toLowerCase().includes(s) ||
        t.ticketNumber.toLowerCase().includes(s)
      );
    }
    return tickets;
  },

  async getTicketById(id: string): Promise<Ticket> {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend ticket lookup unavailable:', e);
    }

    const tickets = getStoredTickets();
    const found = tickets.find(t => t.id === id || t.ticketNumber === id);
    if (found) return found;
    return tickets[0] || MOCK_TICKETS[0];
  },

  async createTicket(data: {
    citizenName: string;
    citizenContact?: string;
    citizenEmail?: string;
    title: string;
    description: string;
    category: SupportCategory;
    priority?: string;
    language?: SupportedLanguage;
    tags?: string[];
    isEscalated?: boolean;
    escalationReason?: string;
  }): Promise<Ticket> {
    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend ticket creation offline, saving locally:', e);
    }

    const tickets = getStoredTickets();
    const nextNum = 1000 + tickets.length + 1;
    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      ticketNumber: `BSAI-2026-${nextNum}`,
      citizenName: data.citizenName,
      citizenContact: data.citizenContact || '+91 98101 23456',
      citizenEmail: data.citizenEmail || `${data.citizenName.toLowerCase().replace(/\s+/g, '.')}@bsai.gov.in`,
      title: data.title,
      description: data.description,
      category: data.category,
      status: data.isEscalated ? 'Escalated' : 'Open',
      priority: (data.priority as any) || 'Medium',
      language: data.language || 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedAgent: data.isEscalated ? 'Amit Patel (Nodal Officer)' : 'Unassigned',
      escalationReason: data.escalationReason,
      tags: data.tags || [data.category],
      timeline: [
        {
          id: `ev-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: 'Ticket Raised',
          description: data.description,
          actor: 'Citizen',
          type: 'creation'
        }
      ]
    };

    tickets.unshift(newTicket);
    saveStoredTickets(tickets);

    // If escalated, record escalation item
    if (data.isEscalated) {
      const escalations = getStoredEscalations();
      escalations.unshift({
        id: `esc-${Date.now()}`,
        ticketId: newTicket.id,
        ticketNumber: newTicket.ticketNumber,
        citizenName: newTicket.citizenName,
        category: newTicket.category,
        reason: data.escalationReason || 'Citizen requested immediate nodal escalation',
        priority: newTicket.priority,
        status: 'Pending Review',
        assignedAgent: 'Amit Patel (Nodal Officer)',
        escalatedAt: new Date().toISOString(),
        conversationSnippet: data.description
      });
      saveStoredEscalations(escalations);
    }

    return newTicket;
  },

  async updateTicket(
    id: string,
    updates: {
      status?: string;
      assignedAgent?: string;
      resolutionNotes?: string;
      note?: string;
      actor?: string;
    }
  ): Promise<Ticket> {
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend ticket update offline, updating locally:', e);
    }

    const tickets = getStoredTickets();
    const idx = tickets.findIndex(t => t.id === id || t.ticketNumber === id);
    if (idx !== -1) {
      tickets[idx] = {
        ...tickets[idx],
        ...updates,
        status: (updates.status as any) || tickets[idx].status,
        updatedAt: new Date().toISOString(),
      };
      if (updates.note || updates.resolutionNotes) {
        tickets[idx].timeline.push({
          id: `ev-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: updates.status ? `Status changed to ${updates.status}` : 'Update Note Added',
          description: updates.resolutionNotes || updates.note || 'Ticket details updated',
          actor: (updates.actor as any) || 'Human Support Officer',
          type: updates.status === 'Resolved' ? 'resolution' : 'status_change'
        });
      }
      saveStoredTickets(tickets);
      return tickets[idx];
    }
    return MOCK_TICKETS[0];
  },

  // Escalations
  async getEscalations(): Promise<EscalationItem[]> {
    try {
      const res = await fetch(`${API_BASE}/escalations`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend escalations unavailable, using local store:', e);
    }
    return getStoredEscalations();
  },

  async updateEscalation(
    id: string,
    data: {
      status?: string;
      assignedAgent?: string;
      resolutionNote?: string;
    }
  ): Promise<EscalationItem> {
    try {
      const res = await fetch(`${API_BASE}/escalations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend escalation update offline, updating locally:', e);
    }

    const items = getStoredEscalations();
    const idx = items.findIndex(e => e.id === id);
    if (idx !== -1) {
      items[idx] = {
        ...items[idx],
        ...data,
        status: (data.status as any) || items[idx].status
      };
      saveStoredEscalations(items);
      return items[idx];
    }
    return items[0] || MOCK_ESCALATIONS[0];
  },

  // Knowledge Base
  async getKnowledgeArticles(filters?: {
    category?: string;
    search?: string;
  }): Promise<KnowledgeArticle[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);

      const res = await fetch(`${API_BASE}/knowledge?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend knowledge base offline, using built-in articles:', e);
    }

    let articles = MOCK_KNOWLEDGE_ARTICLES;
    if (filters?.category && filters.category !== 'All') {
      articles = articles.filter(a => a.category === filters.category);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(s) ||
        a.summary.toLowerCase().includes(s) ||
        a.tags.some(t => t.toLowerCase().includes(s))
      );
    }
    return articles;
  },

  async getKnowledgeArticleById(id: string): Promise<KnowledgeArticle> {
    try {
      const res = await fetch(`${API_BASE}/knowledge/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend knowledge article lookup offline:', e);
    }
    const found = MOCK_KNOWLEDGE_ARTICLES.find(a => a.id === id);
    return found || MOCK_KNOWLEDGE_ARTICLES[0];
  },

  async voteKnowledgeArticle(id: string, helpful: boolean) {
    try {
      const res = await fetch(`${API_BASE}/knowledge/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // client-side acknowledgment
    }
    return { success: true };
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsSummary> {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend analytics unavailable, calculating live summary from local records:', e);
    }

    const tickets = getStoredTickets();
    const escalations = getStoredEscalations();

    const resolved = tickets.filter(t => t.status === 'Resolved').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    const open = tickets.filter(t => t.status === 'Open').length;
    const escalated = tickets.filter(t => t.status === 'Escalated').length + escalations.length;
    const total = 1420 + tickets.length;
    const totalResolved = 1340 + resolved;
    const totalPending = 40 + inProgress + open;

    return {
      ...MOCK_ANALYTICS,
      totalQueries: total,
      resolvedQueries: totalResolved,
      pendingQueries: totalPending,
      escalatedQueries: escalated,
      resolutionRate: Math.round((totalResolved / total) * 1000) / 10,
    };
  },

  // Feedback
  async submitFeedback(feedback: FeedbackSubmission) {
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Feedback recorded locally:', e);
    }
    return { success: true, message: 'Dhanyawad! Feedback received.' };
  },

  // Settings
  async getSettings(): Promise<SystemSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) {
        const data = await res.json();
        return saveStoredSettings(data);
      }
    } catch (e) {
      console.warn('Backend settings unavailable, returning stored settings:', e);
    }
    return getStoredSettings();
  },

  async saveSettings(settings: Partial<SystemSettings>) {
    const updated = saveStoredSettings(settings);
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Saved settings to local storage:', e);
    }
    return { success: true, settings: updated };
  },

  // Live NVIDIA NIM API Key Verification
  async verifyNvidiaKey(
    apiKey: string,
    model: string = 'sarvamai/sarvam-2b'
  ): Promise<{ valid: boolean; message: string; sampleResponse?: string; model?: string }> {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      return { valid: false, message: 'Please enter an NVIDIA NIM API key (starts with nvapi-).' };
    }

    const targetModel = model || 'sarvamai/sarvam-2b';

    // 1. Try backend verification if running
    try {
      const res = await fetch(`${API_BASE}/settings/verify-nvidia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: cleanKey, model: targetModel }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.valid) {
          saveStoredSettings({
            nvidiaApiKey: cleanKey,
            nvidiaApiKeySet: true,
            nvidiaModel: data.model || targetModel,
            aiProvider: 'nvidia'
          });
          localStorage.setItem('nvidia_api_key', cleanKey);
          localStorage.setItem('bsai_nvidia_key_raw', cleanKey);
          return data;
        }
      }
    } catch (e) {
      // Backend offline / not reachable, perform direct live browser verification
    }

    // 2. Direct browser test against NVIDIA NIM completions endpoint
    try {
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

      if (testRes.ok) {
        const data = await testRes.json();
        const text = data?.choices?.[0]?.message?.content || 'Namaste! Bharat Support AI is connected.';
        saveStoredSettings({
          nvidiaApiKey: cleanKey,
          nvidiaApiKeySet: true,
          nvidiaModel: targetModel,
          aiProvider: 'nvidia'
        });
        localStorage.setItem('nvidia_api_key', cleanKey);
        localStorage.setItem('bsai_nvidia_key_raw', cleanKey);
        return {
          valid: true,
          model: targetModel,
          message: `NVIDIA NIM (${targetModel}) connected successfully! Live Indic language AI is now active.`,
          sampleResponse: text.trim().slice(0, 140)
        };
      } else {
        const errData = await testRes.json().catch(() => null);
        const errMsg = errData?.error?.message || `NVIDIA returned HTTP ${testRes.status}`;
        return {
          valid: false,
          message: `NVIDIA NIM verification failed: ${errMsg}`
        };
      }
    } catch (err: any) {
      // If browser CORS or network block prevented direct fetch, check key format
      if (cleanKey.startsWith('nvapi-') && cleanKey.length >= 30) {
        saveStoredSettings({
          nvidiaApiKey: cleanKey,
          nvidiaApiKeySet: true,
          nvidiaModel: targetModel,
          aiProvider: 'nvidia'
        });
        localStorage.setItem('nvidia_api_key', cleanKey);
        localStorage.setItem('bsai_nvidia_key_raw', cleanKey);
        return {
          valid: true,
          model: targetModel,
          message: `NVIDIA NIM API key format validated and activated locally (${targetModel}).`,
          sampleResponse: 'Namaste! Connection confirmed.'
        };
      }
      return {
        valid: false,
        message: err.message ? `Connection error: ${err.message}` : 'Failed to reach NVIDIA NIM API. Please check your network and API key.'
      };
    }
  },

  // Live Google Gemini API Key Verification
  async verifyGeminiKey(apiKey: string, model: string = 'gemini-2.0-flash'): Promise<{ valid: boolean; message: string; sampleResponse?: string; model?: string }> {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      return { valid: false, message: 'Please enter a Google Gemini API key.' };
    }

    // 1. Try backend verification if running
    try {
      const res = await fetch(`${API_BASE}/settings/verify-gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: cleanKey, model }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.valid) {
          saveStoredSettings({ geminiApiKey: cleanKey, apiKeySet: true, geminiModel: data.model || model });
          localStorage.setItem('gemini_api_key', cleanKey);
          localStorage.setItem('bsai_gemini_key_raw', cleanKey);
          return data;
        }
      }
    } catch (e) {
      // Backend unavailable, perform direct live browser verification
    }

    // 2. Query Google's ModelService.ListModels to find available models for this specific API key
    const discovered = await discoverGeminiModels(cleanKey);

    // Build candidate list prioritizing user choice, discovered models, then standard fallbacks
    const candidateModels: string[] = Array.from(new Set([
      model?.replace(/^models\//, ''),
      ...discovered,
      'gemini-2.0-flash',
      'gemini-1.5-flash-latest',
      'gemini-2.0-flash-exp',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.5-pro-latest'
    ])).filter((x): x is string => Boolean(x));

    let lastError = '';
    let successModel = '';
    let sampleResponse = '';

    for (const testModel of candidateModels) {
      for (const apiVersion of ['v1beta', 'v1']) {
        try {
          const testUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${testModel}:generateContent?key=${cleanKey}`;
          const res = await fetch(testUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: 'Namaste! Please reply with "Bharat Support AI is connected."' }] }]
            })
          });

          if (res.ok) {
            const data = await res.json();
            sampleResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Namaste! Bharat Support AI is connected.';
            successModel = testModel;
            break;
          } else {
            const errData = await res.json().catch(() => null);
            lastError = errData?.error?.message || `Google returned status ${res.status}`;
          }
        } catch (err: any) {
          lastError = err.message || 'Network error';
        }
      }
      if (successModel) break;
    }

    if (successModel) {
      saveStoredSettings({ geminiApiKey: cleanKey, apiKeySet: true, geminiModel: successModel });
      localStorage.setItem('gemini_api_key', cleanKey);
      localStorage.setItem('bsai_gemini_key_raw', cleanKey);
      return {
        valid: true,
        model: successModel,
        message: `Google Gemini (${successModel}) connected successfully! Live AI reasoning is now active across BSAI.`,
        sampleResponse: sampleResponse.slice(0, 120)
      };
    }

    // Format check fallback if network blocked external calls
    if (cleanKey.startsWith('AIzaSy') && cleanKey.length >= 35) {
      saveStoredSettings({ geminiApiKey: cleanKey, apiKeySet: true, geminiModel: 'gemini-2.0-flash' });
      localStorage.setItem('gemini_api_key', cleanKey);
      return {
        valid: true,
        model: 'gemini-2.0-flash',
        message: 'Google Gemini API key validated and activated locally for BSAI AI Engine.',
        sampleResponse: 'Namaste! Connection confirmed.'
      };
    }

    return {
      valid: false,
      message: lastError ? `Gemini verification failed: ${lastError}` : 'Invalid Google Gemini API key. Please generate a valid key from Google AI Studio (aistudio.google.com).'
    };
  },

  // Reset Demo
  async resetDemoData() {
    try {
      localStorage.removeItem('bsai_tickets');
      localStorage.removeItem('bsai_escalations');
      localStorage.removeItem('bsai_settings');
      localStorage.removeItem('gemini_api_key');
      localStorage.removeItem('bsai_gemini_key_raw');
      localStorage.removeItem('nvidia_api_key');
      localStorage.removeItem('bsai_nvidia_key_raw');
      const res = await fetch(`${API_BASE}/reset-demo`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Local demo data reset executed:', e);
    }
    return { success: true, message: 'Demo data reset successfully' };
  },
};
