import { db } from './db';
import { SupportCategory, SupportedLanguage, ChatMessage } from '../src/types';

interface AIProcessingResult {
  reply: string;
  category: SupportCategory;
  confidence: number;
  sources: string[];
  suggestedActions: string[];
  requiresHumanReview: boolean;
  detectedIntent: string;
}

interface IntentPattern {
  intent: string;
  category: SupportCategory;
  keywords: string[];
  confidenceBase: number;
  replyEn: (query: string) => string;
  replyHi: (query: string) => string;
  suggestedActions: string[];
  sources: string[];
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: 'pm_kisan_inquiry',
    category: 'Government Services',
    keywords: ['pm kisan', 'pmkisan', 'kisan', 'farmer', 'installment', 'samman nidhi', 'kist', '6000', 'किसान', 'किस्त', 'सम्मान निधि', 'रुपये'],
    confidenceBase: 0.95,
    replyEn: () => `**PM-Kisan Samman Nidhi Assistance:**

Under the PM-Kisan scheme, eligible landholding farmer families receive ₹6,000 annually in three 4-monthly installments of ₹2,000 directly into their bank account via Aadhaar-linked DBT.

**Recommended Action Steps:**
1. **Verify e-KYC**: Visit [pmkisan.gov.in](https://pmkisan.gov.in) and complete Aadhaar OTP e-KYC.
2. **Check Land Seeding**: Ensure your local Revenue Officer/Patwari has verified your land record mapping.
3. **NPCI Bank Seeding**: Confirm your active bank account is mapped to the DBT gateway.

*Helpline: 155261 / 1800-115-526*`,
    replyHi: () => `**प्रधानमंत्री किसान सम्मान निधि सहायता:**

पीएम-किसान योजना के तहत पात्र किसान परिवारों को प्रति वर्ष ₹6,000 की वित्तीय सहायता ₹2,000 की तीन 4-मासिक किस्तों में सीधे आधार-सीडेड बैंक खाते में दी जाती है।

**आवश्यक कदम:**
1. **ई-केवाईसी पूर्ण करें**: [pmkisan.gov.in](https://pmkisan.gov.in) पर आधार ओटीपी से ई-केवाईसी जांचें।
2. **भू-सत्यापन (Land Seeding)**: तहसील/पटवारी रिकॉर्ड में अपनी खतौनी का अंकन सुनिश्चित करें।
3. **डीबीटी मैपिंग**: सुनिश्चित करें कि बैंक खाता एनपीसीआई पोर्टल से जुड़ा हुआ है।

*टोल-फ्री हेल्पलाइन: 155261 / 1800-115-526*`,
    suggestedActions: ['Check PM-Kisan Status', 'Create Land Seeding Ticket', 'Read e-KYC Guidelines'],
    sources: ['PM-Kisan Official Portal (pmkisan.gov.in)', 'Ministry of Agriculture & Farmers Welfare']
  },
  {
    intent: 'ayushman_card_inquiry',
    category: 'Healthcare',
    keywords: ['ayushman', 'pmjay', 'health card', 'golden card', '5 lakh', 'hospital', 'cashless', 'आयुष्मान', 'गोल्डन कार्ड', 'इलाज', 'अस्पताल', 'स्वास्थ्य'],
    confidenceBase: 0.94,
    replyEn: () => `**Ayushman Bharat PM-JAY Assistance:**

Ayushman Bharat provides **₹5,00,000 per family per year** for secondary and tertiary hospitalization across 27,000+ empanelled government and private hospitals across India.

**How to generate/download your Ayushman Golden Card:**
1. Visit [beneficiary.nha.gov.in](https://beneficiary.nha.gov.in) or download the Ayushman App.
2. Log in using your mobile number and Aadhaar OTP.
3. Search by Ration Card ID or Aadhaar Number.
4. Complete instant e-KYC with live photo to download your PDF Golden Card.
*Senior Citizens 70+ can now apply for the dedicated Ayushman Vaya Vandana Card.*

*Helpline: 14555*`,
    replyHi: () => `**आयुष्मान भारत (PM-JAY) सहायता:**

आयुष्मान भारत योजना के तहत प्रति परिवार प्रति वर्ष **₹5,00,000 तक का मुफ्त व कैशलेस इलाज** देश के 27,000+ सूचीबद्ध अस्पतालों में उपलब्ध है।

**आयुष्मान गोल्डन कार्ड बनाने की विधि:**
1. [beneficiary.nha.gov.in](https://beneficiary.nha.gov.in) या आयुष्मान ऐप खोलें।
2. मोबाइल नंबर व आधार ओटीपी से लॉगिन करें।
3. राशन कार्ड या आधार नंबर से परिवार का विवरण खोजें।
4. ई-केवाईसी पूर्ण करके तुरंत अपना गोल्डन कार्ड डाउनलोड करें।

*हेल्पलाइन: 14555*`,
    suggestedActions: ['Download Ayushman Card', 'Find Empanelled Hospital', 'Senior Citizen 70+ Card Guide'],
    sources: ['National Health Authority (beneficiary.nha.gov.in)', 'Ministry of Health and Family Welfare']
  },
  {
    intent: 'aadhaar_services',
    category: 'Documents & Identity',
    keywords: ['aadhaar', 'aadhar', 'address', 'uidai', 'mobile update', 'pvc card', 'biometric', 'आधार', 'पता', 'मोबाइल लिंक', 'पीवीसी'],
    confidenceBase: 0.96,
    replyEn: () => `**UIDAI Aadhaar Citizen Services:**

You can manage your Aadhaar details securely through the official myAadhaar portal.

**Key Procedures:**
- **Online Address Update**: Log in at [myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in) with Aadhaar OTP, upload valid proof of address (Electricity bill, Passport, Bank Passbook), and pay ₹50. Turnaround: 3-7 days.
- **Mobile Number / Biometric Changes**: Requires a one-time physical visit to any Aadhaar Seva Kendra or nearby Post Office. Book appointment online to avoid queues.
- **Order Secure PVC Card**: Order high-security waterproof plastic Aadhaar card with speed post delivery for ₹50 on the myAadhaar portal.

*Helpline: 1947*`,
    replyHi: () => `**यूआईडीएआई आधार नागरिक सेवाएं:**

आप myAadhaar पोर्टल के माध्यम से अपने आधार विवरण को सुरक्षित रूप से अपडेट कर सकते हैं।

**मुख्य प्रक्रियाएं:**
- **ऑनलाइन पता परिवर्तन**: myaadhaar.uidai.gov.in पर आधार ओटीपी से लॉगिन करें, निवास प्रमाण पत्र अपलोड करें और ₹50 का भुगतान करें।
- **मोबाइल नंबर या बायोमेट्रिक अपडेट**: इसके लिए नजदीकी आधार सेवा केंद्र या डाकघर में बायोमेट्रिक प्रमाणीकरण आवश्यक है।
- **पीवीसी आधार कार्ड**: ₹50 में स्पीड पोस्ट द्वारा नया प्लास्टिक वाटरप्रूफ कार्ड ऑर्डर करें।

*टोल-फ्री हेल्पलाइन: 1947*`,
    suggestedActions: ['Update Address Online', 'Book Aadhaar Kendra Appointment', 'Order PVC Card'],
    sources: ['UIDAI Official Portal (myaadhaar.uidai.gov.in)']
  },
  {
    intent: 'scholarship_nsp',
    category: 'Education',
    keywords: ['scholarship', 'nsp', 'student', 'matric', 'college', 'tuition', 'fee', 'otr', 'छात्रवृत्ति', 'स्कॉलरशिप', 'शिक्षा', 'कॉलेज'],
    confidenceBase: 0.92,
    replyEn: () => `**National Scholarship Portal (NSP) Guide:**

NSP facilitates central and state scholarships for pre-matric, post-matric, higher education, and technical studies for students across India.

**Steps to Apply:**
1. **Generate OTR**: Download the NSP FaceRD app or visit [scholarships.gov.in](https://scholarships.gov.in) to generate your lifelong One-Time Registration (OTR).
2. **Select Eligible Scheme**: Browse schemes based on caste, merit, or income (e.g., Post-Matric, CSSS, PM-YASASVI).
3. **Upload Documents**: Keep your Bonafide Certificate, Income Certificate, Previous Marksheet, and Aadhaar-seeded Bank details ready.

*Helpline: 0120-6619540*`,
    replyHi: () => `**राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) सहायता:**

एनएसपी पोर्टल केंद्र और राज्य सरकार की सभी छात्रवृत्तियों (प्री-मैट्रिक, पोस्ट-मैट्रिक व उच्च शिक्षा) के लिए एकीकृत मंच है।

**आवेदन प्रक्रिया:**
1. **OTR नंबर बनाएं**: [scholarships.gov.in](https://scholarships.gov.in) पर आधार फेस/ओटीपी सत्यापन द्वारा अपना OTR नंबर प्राप्त करें।
2. **योजना चुनें**: अपनी श्रेणी (एससी/एसटी/ओबीसी/अल्पसंख्यक/सामान्य मेरिट) के अनुसार योजना चुनें।
3. **दस्तावेज संलग्न करें**: बोनाफाइड प्रमाण पत्र, आय प्रमाण पत्र, अंकसूची और आधार से जुड़ा बैंक खाता।

*हेल्पलाइन: 0120-6619540*`,
    suggestedActions: ['Create OTR Number', 'View Open Scholarships 2026', 'Track Application Status'],
    sources: ['National Scholarship Portal (scholarships.gov.in)']
  },
  {
    intent: 'cpgrams_grievance',
    category: 'Grievance Redressal',
    keywords: ['grievance', 'complaint', 'cpgrams', 'pgportal', 'police', 'delay', 'bribe', 'officer', 'dispute', 'शिकायत', 'समस्या', 'विभाग', 'अधिकारी'],
    confidenceBase: 0.93,
    replyEn: () => `**CPGRAMS Central Citizen Grievance Redressal:**

The Centralized Public Grievance Redress and Monitoring System (CPGRAMS) is a 24/7 government portal to hold central and state authorities accountable.

**How CPGRAMS Works:**
1. **Lodge Complaint**: File at [pgportal.gov.in](https://pgportal.gov.in) against railways, banking, electricity, roads, pensions, or municipal departments.
2. **21-Day Resolution Guarantee**: The department must resolve your issue within 21 working days.
3. **Appellate Authority**: If unsatisfied with the officer's answer, submit a 1-click appeal to higher administrative oversight.

*Would you like BSAI to file a formal grievance ticket on your behalf right now?*`,
    replyHi: () => `**सीपीजीआरएएमएस (CPGRAMS) लोक शिकायत निवारण:**

सीपीजीआरएएमएस केंद्र व राज्य सरकार के विभागों, रेलवे, बैंकिंग, बिजली, सड़क व पेंशन से संबंधित शिकायतों के निवारण हेतु आधिकारिक २४/७ राष्ट्रीय मंच है।

**शिकायत दर्ज करने की प्रक्रिया:**
1. [pgportal.gov.in](https://pgportal.gov.in) पर लॉगिन करें।
2. संबंधित विभाग/मंत्रालय चुनें और समस्या का विवरण लिखें।
3. **२१ दिनों में निवारण गारंटी**: विभाग को निर्धारित समयसीमा में समाधान देना अनिवार्य है।

*क्या आप चाहते हैं कि भारत सपोर्ट एआई आपके लिए अभी एक शिकायत टिकट दर्ज करे?*`,
    suggestedActions: ['Lodge CPGRAMS Ticket', 'Track Grievance Number', 'Escalate to Human Officer'],
    sources: ['Department of Administrative Reforms and Public Grievances (pgportal.gov.in)']
  },
  {
    intent: 'digilocker_services',
    category: 'Documents & Identity',
    keywords: ['digilocker', 'driving license', 'rc', 'marksheet', 'pan card', 'certificate', 'डिजिलॉकर', 'लाइसेंस', 'दस्तावेज', 'प्रमाण पत्र'],
    confidenceBase: 0.95,
    replyEn: () => `**DigiLocker Paperless Citizen Ecosystem:**

Documents stored and issued via DigiLocker are legally equivalent to original physical documents under Rule 9A of the IT Rules 2016.

**Supported Documents:**
- Vehicle Driving License & Registration Certificate (RC)
- Class 10 & 12 Marksheets (CBSE, CISCE & State Boards)
- e-PAN Card from Income Tax Department
- Ration Card, Caste, and Domicile Certificates

*Access now at [digilocker.gov.in](https://digilocker.gov.in) with your Aadhaar login.*`,
    replyHi: () => `**डिजिलॉकर डिजिटल दस्तावेज सेवा:**

डिजिलॉकर में उपलब्ध दस्तावेज आईटी नियमों के तहत मूल कागजी दस्तावेजों के समान कानूनी रूप से पूर्णतः मान्य हैं।

**उपलब्ध सेवाएं:**
- ड्राइविंग लाइसेंस एवं वाहन आरसी
- १०वीं और १२वीं की डिजिटल मार्कशीट
- ई-पैन कार्ड, राशन कार्ड और निवास प्रमाण पत्र।

*लॉगिन करें: [digilocker.gov.in](https://digilocker.gov.in)*`,
    suggestedActions: ['Fetch Driving License', 'Download e-PAN', 'Link DigiLocker to BSAI'],
    sources: ['Digital India DigiLocker (digilocker.gov.in)']
  },
  {
    intent: 'msme_mudra_loans',
    category: 'Employment',
    keywords: ['msme', 'mudra', 'loan', 'udyam', 'business', 'startup', 'subsidy', 'लोन', 'मुद्रा', 'उद्यम', 'व्यापार', 'व्यवसाय'],
    confidenceBase: 0.94,
    replyEn: () => `**Udyam MSME Registration & PM Mudra Yojana:**

For micro, small, and medium entrepreneurs:
- **Free Udyam Registration**: Obtain official MSME certificate at [udyamregistration.gov.in](https://udyamregistration.gov.in) with zero government fees.
- **PM Mudra Collateral-Free Loans**:
  - *Shishu*: Up to ₹50,000 for new small ventures
  - *Kishore*: ₹50,001 to ₹5,00,000 for expansion
  - *Tarun / Tarun Plus*: ₹5,00,000 to ₹20,00,000 for established units.`,
    replyHi: () => `**उद्यम पंजीकरण एवं पीएम मुद्रा लोन योजना:**

- **मुफ्त उद्यम रजिस्ट्रेशन**: [udyamregistration.gov.in](https://udyamregistration.gov.in) पर बिना किसी शुल्क के त्वरित एमएसएमई प्रमाण पत्र बनाएं।
- **पीएम मुद्रा योजना (बिना गारंटी ऋण)**:
  - *शिशु*: ₹50,000 तक
  - *किशोर*: ₹50,000 से ₹5 लाख
  - *तरुण/तरुण प्लस*: ₹5 लाख से ₹20 लाख तक।`,
    suggestedActions: ['Register Free Udyam', 'Apply PM Mudra Loan', 'Check Eligibility'],
    sources: ['Ministry of MSME (udyamregistration.gov.in)', 'MUDRA Portal']
  }
];

// Comprehensive helper to clean any model scratchpads, planning drafts, or outline artifacts
function cleanGeminiOutput(rawText: string): string {
  if (!rawText) return '';

  let text = rawText.replace(/\r\n/g, '\n');

  // 1. Remove XML/HTML thinking tags
  text = text.replace(/<thought[\s\S]*?<\/thought>/gi, '');
  text = text.replace(/<thinking[\s\S]*?<\/thinking>/gi, '');

  // 2. Normalize draft headers and greetings before slicing
  text = text.replace(/(?:\n|^)\s*(\*|-|\d+\.)\s*\*?Header:\*?\s*/gi, '\n### ');
  text = text.replace(/(?:\n|^)\s*(\*|-|\d+\.)\s*\*?Greeting:\*?\s*/gi, '\n');

  // 3. Cut off trailing self-correction, drafting review, or checklist blocks
  const cutoffMatch = text.search(/(?:\n\s*\n|\n)\s*(\*|-|\d+\.)?\s*\(?(\*?Self-Correction|\*?Final Structure|\*?Final Response|\*?Ensure the tone|\*?Verify the link|\*?Steps to find specific courses|\(Proceeding|\*?Check:|\*?Evaluation)/i);
  if (cutoffMatch !== -1 && cutoffMatch > 0) {
    text = text.slice(0, cutoffMatch);
  }

  // 4. If there is a clear start of the direct citizen response (### Header or ## Header)
  const h3Idx = text.indexOf('### ');
  const h2Idx = text.indexOf('## ');
  if (h3Idx > 0) {
    text = text.slice(h3Idx);
  } else if (h2Idx > 0) {
    text = text.slice(h2Idx);
  }

  let lines = text.split('\n');
  let cleanLines: string[] = [];

  for (let line of lines) {
    let trimmed = line.trim();

    // Skip empty lines if at start
    if (!trimmed) {
      if (cleanLines.length > 0 && cleanLines[cleanLines.length - 1] !== '') cleanLines.push('');
      continue;
    }

    // Skip parenthetical self-corrections or drafting notes
    if (/^\(Self-Correction/i.test(trimmed) || /^\(Note/i.test(trimmed) || /^\(Drafting/i.test(trimmed) || /^\(Proceeding/i.test(trimmed)) {
      continue;
    }

    // Skip metadata / rubric / planning scratchpad bullet lines
    if (/^(\*|-|\d+\.)\s*(User Question|User Query|User Intent|Citizen Query|User asks|Context|Identity|Persona|Role|My Role|Mission|Purpose|Response Format|Goal|Format|Outline|Checklist|Did I|Is the tone|Are links|Is it in|Scheme Name|Topic|Constraint Check|Sectors:|Steps:|Directly to citizen|Markdown formatting|Official portal links|No meta-commentary|Help\/Support|Greeting Rule|Introduction of services|Call to action|Intent|Is there any|Output the exact|Input:|Objective:|Key Features:|Check|Acknowledge|Explain what|List common|Provide steps|Provide official):?/i.test(trimmed)) {
      continue;
    }

    // Skip numbered rubric items (e.g. "1. Direct, structured answer with markdown", "2. Official website links", "3. Tone: Courteous")
    if (/^\d+\.\s*(Direct, structured answer|Official website links|Tone:|Clear headings|Accurate advice)/i.test(trimmed)) {
      continue;
    }

    // Skip evaluation checklist lines
    if (/^(\*|-|\d+\.)\s*(\*?Check:\*?|Check:|Are there|Did I|Is it|Is the|Tone:|Links:|Script\?|Warm greeting\?)[^\n]*(Yes|No|Courteous|Clean|Authoritative|Done)\.?$/i.test(trimmed)) {
      continue;
    }
    if (/^(\*|-|\d+\.)\s*[^:\n?]+\?\s*(Yes|No)\.?$/i.test(trimmed)) {
      continue;
    }

    // Transform outline markers into clean markdown
    line = line.replace(/^\s*(\*|-|\d+\.)\s*\*?Section \d+:?\s*([^*:\n]+)\*?:?\s*/i, '\n### $2\n');
    line = line.replace(/^\s*(\*|-|\d+\.)\s*\*?Header:\*?\s*/i, '### ');
    line = line.replace(/^\s*(\*|-|\d+\.)\s*\*?Greeting:\*?\s*/i, '');
    line = line.replace(/^\s*(\*|-|\d+\.)\s*\*?Direct Answer:\*?\s*/i, '');
    line = line.replace(/^\s*(\*|-|\d+\.)\s*\*?Body:\*?\s*/i, '');
    line = line.replace(/^(\s*(\*|-|\d+\.)\s*)?\*?Introduction:\*?\s*/i, '');
    line = line.replace(/^(\s*(\*|-|\d+\.)\s*)?\*?Overview:\*?\s*/i, '**Overview:** ');
    line = line.replace(/^(\s*(\*|-|\d+\.)\s*)?\*?Sectors:\*?\s*/i, '\n**Available Sectors & Courses:**\n');
    line = line.replace(/^(\s*(\*|-|\d+\.)\s*)?\*?Course Categories:\*?\s*/i, '\n**Course Categories:**\n');
    line = line.replace(/^(\s*(\*|-|\d+\.)\s*)?\*?(How to (?:find\/enroll|find|enroll|apply)):\*?\s*/i, '\n**How to Find and Enroll:**\n');
    line = line.replace(/^(\s*(\*|-|\d+\.)\s*)?\*?Official Portal:\*?\s*/i, '**Official Portal:** ');
    line = line.replace(/^(\s*(\*|-|\d+\.)\s*)?\*?Helpline:\*?\s*/i, '**Official Helpline:** ');
    line = line.replace(/^(\s*(\*|-|\d+\.)\s*)?\*?Links:\*?\s*/i, '**Official Links:** ');

    // Normalize deep indentation
    line = line.replace(/^ {4,8}(\*|-|\d+\.)/, '  $1');

    // Strip quotation marks wrapping single lines
    let lineTrim = line.trim();
    if (lineTrim.startsWith('"') && lineTrim.endsWith('"') && lineTrim.length > 2) {
      line = lineTrim.slice(1, -1);
    }

    cleanLines.push(line);
  }

  let result = cleanLines.join('\n').trim();
  result = result.replace(/\n{3,}/g, '\n\n');
  return result;
}

// Call Google Gemini API with citizen context and multi-language support
// Call Google Gemini API with citizen context and multi-language support
async function callGoogleGeminiAPI(
  query: string,
  language: SupportedLanguage = 'en',
  categoryFilter?: SupportCategory,
  kbArticles: any[] = [],
  apiKeyOverride?: string
): Promise<AIProcessingResult | null> {
  try {
    const keyRow = await db.get('SELECT value FROM settings WHERE key = ?', ['geminiApiKey']);
    const modelRow = await db.get('SELECT value FROM settings WHERE key = ?', ['geminiModel']);
    
    let apiKey = (apiKeyOverride || keyRow?.value || process.env.GEMINI_API_KEY || '').trim();
    if (apiKey.includes('...')) {
      apiKey = (apiKeyOverride || process.env.GEMINI_API_KEY || '').trim();
    }
    const model = modelRow?.value || 'gemini-2.0-flash';

    if (!apiKey || apiKey.length < 15 || apiKey.includes('...')) {
      return null;
    }

    const kbContext = kbArticles.length > 0
      ? `\nVerified Digital India Knowledge Base Records:\n` +
        kbArticles.map((a, i) => `${i + 1}. [${a.category}] ${a.title}: ${a.summary}. Portal: ${a.official_portal_url || 'N/A'}`).join('\n')
      : '';

    const systemInstructionText = `You are Bharat Support AI (BSAI), the official authoritative citizen support assistant for Digital India.
Your mission is to provide accurate, official, helpful, and empathetic guidance on Government Schemes (PM-Kisan, Ayushman Bharat, NSP, PMKVY, PDS Ration, Ujjwala, PM Awas), citizen documents (Aadhaar, PAN, DigiLocker, Driving License, Ration Card), essential civic grievances (electricity, water, public distribution), and DBT subsidies.

LANGUAGE & CONVERSATION RULES:
- The citizen may speak English, Hindi, Hinglish (Hindi written in Latin script, e.g. "ghee khtm", "rashan nahi mil raha", "kisan kist kab aayegi", "ration card kaise banaye"), or regional languages (${language}).
- ALWAYS reply in the SAME language or style the citizen uses! If they ask in Hinglish, reply in natural, respectful Hinglish. If in Hindi, reply in Hindi. If in English, reply in English.
- If a query is very brief or colloquial (like "ghee khtm" or "ration khtm"), understand the real-life citizen situation: explain that food grains/rations are distributed under NFSA & PMGKAY at Fair Price Shops (FPS), provide the National Food Helpline 1967 / 1800-180-2087, and guide them on how to check quota or lodge a dealer grievance.
- FORMAT: Start with a respectful greeting (e.g. "Namaste!"), followed by clear markdown bold points and numbered steps. Include real .gov.in official portals and toll-free helplines.
- CRITICAL: Output ONLY the final citizen-facing response. NEVER output internal thoughts, draft notes, or reasoning tags.
${kbContext}`;

    const candidateModels = Array.from(new Set([
      'gemini-2.0-flash',
      model,
      'gemini-1.5-flash-latest',
      'gemini-2.0-flash-exp',
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ])).filter((m): m is string => Boolean(m) && !m.startsWith('bsai-'));

    let replyText = '';
    let resolvedModel = model;

    for (const testModel of candidateModels) {
      for (const apiVersion of ['v1beta', 'v1']) {
        try {
          const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${testModel}:generateContent?key=${apiKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemInstructionText}\n\nCitizen Query: "${query}"` }]
                }
              ],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 1024,
              }
            })
          });

          if (res.ok) {
            const data: any = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim()) {
              replyText = cleanGeminiOutput(text);
              resolvedModel = testModel;
              break;
            }
          }
        } catch (e) {
          // try next model / version
        }
      }
      if (replyText) break;
    }

    if (!replyText) {
      return null;
    }

    // Determine category from query or filter
    let detectedCategory: SupportCategory = categoryFilter || 'Government Services';
    const lower = query.toLowerCase();
    if (lower.includes('health') || lower.includes('hospital') || lower.includes('ayushman') || lower.includes('इलाज') || lower.includes('આરોગ્ય') || lower.includes('ఆరోగ్య')) {
      detectedCategory = 'Healthcare';
    } else if (lower.includes('scholarship') || lower.includes('school') || lower.includes('college') || lower.includes('student') || lower.includes('छात्रवृत्ति') || lower.includes('શિષ્યવૃત્તિ') || lower.includes('విద్య')) {
      detectedCategory = 'Education';
    } else if (lower.includes('aadhaar') || lower.includes('pan') || lower.includes('digilocker') || lower.includes('passport') || lower.includes('आधार') || lower.includes('આધાર')) {
      detectedCategory = 'Documents & Identity';
    } else if (lower.includes('complaint') || lower.includes('grievance') || lower.includes('cpgrams') || lower.includes('delay') || lower.includes('शिकायत') || lower.includes('ફરિયાદ')) {
      detectedCategory = 'Grievance Redressal';
    } else if (lower.includes('job') || lower.includes('employment') || lower.includes('loan') || lower.includes('mudra') || lower.includes('msme') || lower.includes('લોન')) {
      detectedCategory = 'Employment';
    }

    const escalationKeywords = ['human', 'agent', 'officer', 'talk to someone', 'escalate', 'supervisor', 'अधिकारी', 'અધિકારી', 'बात करनी'];
    const wantsHuman = escalationKeywords.some(k => lower.includes(k));

    return {
      reply: replyText,
      category: detectedCategory,
      confidence: 0.98,
      sources: [`Google Gemini (${resolvedModel})`, 'Digital India National Portals'],
      suggestedActions: ['Create Official Request', 'Track Progress', 'Escalate to Nodal Officer'],
      requiresHumanReview: wantsHuman,
      detectedIntent: 'gemini_generative_reasoning'
    };
  } catch (err) {
    console.error('Gemini API execution error:', err);
    return null;
  }
}

export async function processAIQuery(
  query: string,
  language: SupportedLanguage = 'en',
  categoryFilter?: SupportCategory,
  apiKeyOverride?: string
): Promise<AIProcessingResult> {
  const lowerQuery = query.toLowerCase().trim();

  // 1. Check if user explicitly asked for human support or expresses escalation intent
  const escalationKeywords = ['human', 'agent', 'officer', 'person', 'talk to someone', 'escalate', 'supervisor', 'complaint', 'adhikari', 'इंसान', 'अधिकारी', 'बात करनी है', 'एजेंट'];
  const wantsHuman = escalationKeywords.some(k => lowerQuery.includes(k));

  // 2. Search Knowledge Base in Database for relevant context
  let kbResults: any[] = [];
  try {
    const searchTerms = lowerQuery.split(/\s+/).filter(w => w.length > 3);
    if (searchTerms.length > 0) {
      const likeQuery = searchTerms.map(() => '(title LIKE ? OR content LIKE ? OR tags LIKE ?)').join(' OR ');
      const params = searchTerms.flatMap(term => [`%${term}%`, `%${term}%`, `%${term}%`]);
      kbResults = await db.all(`SELECT * FROM knowledge_articles WHERE ${likeQuery} LIMIT 3`, params);
    }
  } catch (e) {
    console.error('KB Search error in AI Engine:', e);
  }

  // 3. Try Google Gemini API first if configured
  const geminiResult = await callGoogleGeminiAPI(query, language, categoryFilter, kbResults, apiKeyOverride);
  if (geminiResult) {
    return geminiResult;
  }

  // 4. Pattern & Intent Matcher (Local Engine Fallback)
  let bestMatch: IntentPattern | null = null;
  let maxScore = 0;

  for (const pattern of INTENT_PATTERNS) {
    let matches = 0;
    for (const kw of pattern.keywords) {
      if (lowerQuery.includes(kw.toLowerCase())) {
        matches++;
      }
    }

    if (matches > 0) {
      const score = Math.min(pattern.confidenceBase + (matches - 1) * 0.03, 0.99);
      if (score > maxScore) {
        maxScore = score;
        bestMatch = pattern;
      }
    }
  }

  if (bestMatch && maxScore >= 0.75) {
    const isHindi = language === 'hi';
    const reply = isHindi ? bestMatch.replyHi(query) : bestMatch.replyEn(query);
    
    return {
      reply,
      category: bestMatch.category,
      confidence: maxScore,
      sources: bestMatch.sources,
      suggestedActions: bestMatch.suggestedActions,
      requiresHumanReview: wantsHuman,
      detectedIntent: bestMatch.intent
    };
  }

  // 5. If we found matching knowledge base articles
  if (kbResults.length > 0) {
    const topArticle = kbResults[0];
    const isHindi = language === 'hi';
    const title = isHindi ? (topArticle.title_hi || topArticle.title) : topArticle.title;
    const summary = isHindi ? (topArticle.summary_hi || topArticle.summary) : topArticle.summary;
    const portal = topArticle.official_portal_url ? `\n\nOfficial Portal: [${topArticle.official_portal_url}](${topArticle.official_portal_url})` : '';
    const helpline = topArticle.helpline_number ? `\nHelpline: ${topArticle.helpline_number}` : '';

    const reply = isHindi
      ? `**${title}**\n\n${summary}${portal}${helpline}\n\n*क्या आप इस विषय पर विस्तृत जानकारी चाहते हैं या सहायता टिकट दर्ज करना चाहते हैं?*`
      : `**${title}**\n\n${summary}${portal}${helpline}\n\n*Would you like more details on this topic or create a formal support request?*`;

    return {
      reply,
      category: topArticle.category as SupportCategory,
      confidence: 0.86,
      sources: [topArticle.title, 'Bharat Citizen Knowledge Base'],
      suggestedActions: ['Create Support Request', 'View Full Article', 'Ask Follow-up Question'],
      requiresHumanReview: wantsHuman,
      detectedIntent: 'knowledge_base_retrieval'
    };
  }

  // 6. General intelligent conversational fallback
  const isHindi = language === 'hi';
  const generalReply = isHindi
    ? `नमस्ते! भारत सपोर्ट एआई में आपका स्वागत है।\n\nमैंने आपके प्रश्न "${query}" का विश्लेषण किया है। मैं भारत सरकार की योजनाओं (जैसे पीएम-किसान, आयुष्मान भारत, छात्रवृत्ति), नागरिक दस्तावेजों (आधार, पैन, डिजिलॉकर) और जन शिकायतों (CPGRAMS) में सहायता कर सकता हूँ।\n\nकृपया अपनी समस्या का विवरण साझा करें या नीचे दिए गए विकल्पों में से चुनें:`
    : `Namaste! Welcome to Bharat Support AI.\n\nI have analyzed your query regarding "${query}". I can provide instant guidance on Government Schemes (PM-Kisan, Ayushman Bharat, NSP Scholarships), Citizen Identity & Documents (Aadhaar, DigiLocker, PAN), and Public Grievances (CPGRAMS).\n\nPlease provide more specific details, or choose an option below:`;

  return {
    reply: generalReply,
    category: categoryFilter || 'Other Citizen Services',
    confidence: wantsHuman ? 0.60 : 0.72,
    sources: ['Bharat Support AI Central Knowledge Core'],
    suggestedActions: [
      'PM-Kisan & Agriculture',
      'Ayushman Bharat Health Card',
      'Aadhaar & DigiLocker Services',
      'Connect with Human Officer'
    ],
    requiresHumanReview: wantsHuman || lowerQuery.length < 5,
    detectedIntent: 'general_inquiry'
  };
}
