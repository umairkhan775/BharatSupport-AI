import {
  Ticket,
  KnowledgeArticle,
  EscalationItem,
  AnalyticsSummary,
  SystemSettings
} from '../types';

export const MOCK_ANALYTICS: AnalyticsSummary = {
  totalQueries: 1428,
  resolvedQueries: 1345,
  pendingQueries: 48,
  escalatedQueries: 83,
  resolutionRate: 94.2,
  averageResponseTimeSec: 0.42,
  customerSatisfaction: 4.9,
  escalationRate: 5.8,
  categoryDistribution: [
    { category: 'Government Services', count: 412, percentage: 29 },
    { category: 'Healthcare', count: 286, percentage: 20 },
    { category: 'Education', count: 245, percentage: 17 },
    { category: 'Documents & Identity', count: 210, percentage: 15 },
    { category: 'Grievance Redressal', count: 148, percentage: 10 },
    { category: 'Employment', count: 85, percentage: 6 },
    { category: 'Agriculture & Rural', count: 42, percentage: 3 }
  ],
  languageDistribution: [
    { language: 'English', code: 'en', count: 580, percentage: 41 },
    { language: 'Hindi (हिन्दी)', code: 'hi', count: 490, percentage: 34 },
    { language: 'Gujarati (ગુજરાતી)', code: 'gu', count: 112, percentage: 8 },
    { language: 'Telugu (తెలుగు)', code: 'te', count: 86, percentage: 6 },
    { language: 'Tamil (தமிழ்)', code: 'ta', count: 64, percentage: 4 },
    { language: 'Marathi (मराठी)', code: 'mr', count: 48, percentage: 3 },
    { language: 'Bengali (বাংলা)', code: 'bn', count: 32, percentage: 2 },
    { language: 'Kannada (ಕನ್ನಡ)', code: 'kn', count: 16, percentage: 1 }
  ],
  statusBreakdown: [
    { status: 'Resolved', count: 1345 },
    { status: 'In Progress', count: 32 },
    { status: 'Open', count: 16 },
    { status: 'Escalated', count: 83 }
  ],
  dailyTrends: [
    { date: '20 Sep', queries: 180, resolved: 172, escalated: 8 },
    { date: '21 Sep', queries: 195, resolved: 186, escalated: 9 },
    { date: '22 Sep', queries: 210, resolved: 198, escalated: 12 },
    { date: '23 Sep', queries: 225, resolved: 214, escalated: 11 },
    { date: '24 Sep', queries: 205, resolved: 194, escalated: 11 },
    { date: '25 Sep', queries: 218, resolved: 206, escalated: 12 },
    { date: '26 Sep', queries: 195, resolved: 175, escalated: 20 }
  ],
  recentActivity: [
    {
      id: 'act-1',
      type: 'resolution',
      title: 'PM-Kisan Aadhaar Seeding Verified',
      description: 'AI verified NPCI DBT gateway mapping for citizen Umair Khan.',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      category: 'Government Services',
      priority: 'Medium'
    },
    {
      id: 'act-2',
      type: 'escalation',
      title: 'CPGRAMS SLA Breach Review',
      description: 'Escalated transformer replacement grievance to District Nodal Officer.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      category: 'Grievance Redressal',
      priority: 'High'
    },
    {
      id: 'act-3',
      type: 'ticket',
      title: 'Skill India PMKVY Course Inquiry',
      description: 'Citizen inquiry registered for IT & Electronics batch allotment.',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      category: 'Employment',
      priority: 'Medium'
    },
    {
      id: 'act-4',
      type: 'resolution',
      title: 'Ayushman Bharat e-KYC Linked',
      description: 'Digital Health ID generated and linked successfully.',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      category: 'Healthcare',
      priority: 'Medium'
    }
  ]
};

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 't-1001',
    userId: 'usr_umair_01',
    ticketNumber: 'BSAI-2026-1001',
    citizenName: 'Umair Khan',
    citizenContact: '+91 98101 23456',
    citizenEmail: 'umair.khan@bsai.gov.in',
    title: 'PM-Kisan 18th Installment Land Seeding Status Verification',
    description: 'Land record verification status not reflecting on PM-Kisan portal despite Tehsil clearance.',
    category: 'Government Services',
    status: 'Resolved',
    priority: 'Medium',
    language: 'en',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    assignedAgent: 'AI Citizen Core',
    resolutionNotes: 'Aadhaar bank seeding verified via NPCI gateway. Beneficiary status confirmed active.',
    timeline: [
      { id: 'ev-1', timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), title: 'Ticket Created', description: 'Citizen logged query via BSAI Assistant', actor: 'Citizen', type: 'creation' },
      { id: 'ev-2', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), title: 'Query Resolved', description: 'Automated verification completed with PM-Kisan portal API', actor: 'BSAI Assistant', type: 'resolution' }
    ],
    tags: ['PM-Kisan', 'DBT', 'Land Seeding']
  },
  {
    id: 't-1002',
    userId: 'usr_rahul_02',
    ticketNumber: 'BSAI-2026-1002',
    citizenName: 'Rahul Sharma',
    citizenContact: '+91 94520 87654',
    citizenEmail: 'rahul.sharma@bsai.gov.in',
    title: 'NSP Pre-Matric Scholarship Institute Verification Pending',
    description: 'Application locked at Nodal Institute desk since 14 days for National Scholarship Portal 2026-27.',
    category: 'Education',
    status: 'In Progress',
    priority: 'High',
    language: 'hi',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    assignedAgent: 'Amit Patel (Nodal Officer)',
    timeline: [
      { id: 'ev-3', timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), title: 'Ticket Created', description: 'Application entered verification queue', actor: 'Citizen', type: 'creation' },
      { id: 'ev-4', timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), title: 'Assigned to Nodal Officer', description: 'Expedited verification notice sent to District Education Officer', actor: 'Human Support Officer', type: 'agent_assignment' }
    ],
    tags: ['NSP', 'Scholarship', 'Education']
  },
  {
    id: 't-1003',
    userId: 'usr_priya_03',
    ticketNumber: 'BSAI-2026-1003',
    citizenName: 'Priya Verma',
    citizenContact: '+91 98200 45678',
    citizenEmail: 'priya.verma@bsai.gov.in',
    title: 'Ayushman Golden Card Family Member Addition e-KYC',
    description: 'Unable to add newborn child name in Ayushman Bharat PM-JAY ration database.',
    category: 'Healthcare',
    status: 'Resolved',
    priority: 'Medium',
    language: 'mr',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    assignedAgent: 'AI Citizen Core',
    resolutionNotes: 'Birth registration certificate matched with State Civil Registration System. Card generated.',
    timeline: [
      { id: 'ev-5', timestamp: new Date(Date.now() - 3600000 * 72).toISOString(), title: 'Ticket Created', description: 'Family card update initiated', actor: 'Citizen', type: 'creation' },
      { id: 'ev-6', timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), title: 'Resolved', description: 'Digital health ID created and linked to mother account', actor: 'BSAI Assistant', type: 'resolution' }
    ],
    tags: ['Ayushman Bharat', 'Health Card', 'PM-JAY']
  },
  {
    id: 't-1004',
    userId: 'usr_umair_01',
    ticketNumber: 'BSAI-2026-1004',
    citizenName: 'Umair Khan',
    citizenContact: '+91 98101 23456',
    title: 'Skill India PMKVY 4.0 Free Course Allotment South Delhi',
    description: 'Inquiry regarding free certified training in IT-ITeS and Electronic Hardware batch timings.',
    category: 'Employment',
    status: 'Open',
    priority: 'Medium',
    language: 'en',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    assignedAgent: 'Unassigned',
    timeline: [
      { id: 'ev-7', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), title: 'Ticket Created', description: 'Inquiry generated from AI Chat session', actor: 'Citizen', type: 'creation' }
    ],
    tags: ['Skill India', 'PMKVY', 'Courses']
  },
  {
    id: 't-1005',
    ticketNumber: 'BSAI-2026-1005',
    citizenName: 'Kavita Reddy',
    citizenContact: '+91 98480 11223',
    title: 'DigiLocker Driving License Verification Sync Error',
    description: 'Parivahan Sarathi driving license QR code returning cryptographic signature error in DigiLocker app.',
    category: 'Documents & Identity',
    status: 'In Progress',
    priority: 'Medium',
    language: 'te',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    assignedAgent: 'Amit Patel (Nodal Officer)',
    timeline: [
      { id: 'ev-8', timestamp: new Date(Date.now() - 3600000 * 18).toISOString(), title: 'Ticket Created', description: 'Citizen reported sync failure', actor: 'Citizen', type: 'creation' }
    ],
    tags: ['DigiLocker', 'Parivahan', 'Identity']
  },
  {
    id: 't-1006',
    ticketNumber: 'BSAI-2026-1006',
    citizenName: 'Hasmukh Patel',
    citizenContact: '+91 98250 99887',
    title: 'CPGRAMS Grievance on District Electricity Substation Delay',
    description: 'Formal grievance filed regarding transformer replacement delay exceeding citizen charter timeline.',
    category: 'Grievance Redressal',
    status: 'Escalated',
    priority: 'High',
    language: 'gu',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    assignedAgent: 'Amit Patel (Nodal Officer)',
    escalationReason: 'Citizen charter SLA breached by 7 business days',
    timeline: [
      { id: 'ev-9', timestamp: new Date(Date.now() - 3600000 * 30).toISOString(), title: 'Ticket Created', description: 'Grievance logged under DARPG CPGRAMS', actor: 'Citizen', type: 'creation' },
      { id: 'ev-10', timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), title: 'Escalated', description: 'Escalated to Chief Nodal Engineer for immediate redressal', actor: 'BSAI Assistant', type: 'escalation' }
    ],
    tags: ['CPGRAMS', 'Grievance', 'Urgent SLA']
  }
];

export const MOCK_ESCALATIONS: EscalationItem[] = [
  {
    id: 'esc-101',
    ticketId: 't-1006',
    ticketNumber: 'BSAI-2026-1006',
    citizenName: 'Hasmukh Patel',
    category: 'Grievance Redressal',
    reason: 'Citizen charter SLA breached by 7 business days for transformer replacement',
    priority: 'High',
    status: 'Agent Assigned',
    assignedAgent: 'Amit Patel (Nodal Officer)',
    escalatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    conversationSnippet: 'Citizen: "Electricity supply cut since 9 days. Complaint #GJ-2026-441 pending without update."'
  },
  {
    id: 'esc-102',
    ticketId: 't-1002',
    ticketNumber: 'BSAI-2026-1002',
    citizenName: 'Rahul Sharma',
    category: 'Education',
    reason: 'Institute level verification locked exceeding scholarship deadline',
    priority: 'High',
    status: 'Pending Review',
    assignedAgent: 'Amit Patel (Nodal Officer)',
    escalatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    conversationSnippet: 'Citizen: "Scholarship verification portal closes tomorrow. College clerk has not approved form."'
  }
];

export const MOCK_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-pm-kisan',
    title: 'PM-Kisan Samman Nidhi: Eligibility, KYC & Installment Status',
    titleHi: 'प्रधानमंत्री किसान सम्मान निधि: पात्रता, ई-केवाईसी और किस्त की स्थिति',
    category: 'Government Services',
    summary: 'Direct income support of ₹6,000 per year in three 4-monthly installments of ₹2,000 to all landholding farmer families.',
    summaryHi: 'सभी भूमिधारक किसान परिवारों को ₹2,000 की तीन 4-मासिक किस्तों में प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।',
    content: `## PM-Kisan Samman Nidhi Guidelines\n\n### 1. Scheme Benefits\nUnder PM-Kisan, eligible farmers receive **₹6,000 per year** in 3 equal installments of ₹2,000 directly into Aadhaar-seeded accounts.\n\n### 2. Mandatory Requirements\n- **e-KYC**: Complete via OTP on [pmkisan.gov.in](https://pmkisan.gov.in) or biometric at CSC.\n- **Land Seeding**: Verify land records with Tehsil / Revenue Patwari.\n- **Aadhaar-Bank Linkage**: Account mapped with NPCI DBT gateway.`,
    contentHi: `## प्रधानमंत्री किसान सम्मान निधि दिशा-निर्देश\n\n- ₹6,000 प्रति वर्ष 3 समान किस्तों में प्रत्यक्ष लाभ अंतरण।\n- [pmkisan.gov.in](https://pmkisan.gov.in) पर ई-केवाईसी पूर्ण करें।`,
    tags: ['PM-Kisan', 'Agriculture', 'DBT', 'e-KYC'],
    lastUpdated: '2026-08-15',
    helpfulCount: 384,
    notHelpfulCount: 12,
    views: 4210,
    officialPortalUrl: 'https://pmkisan.gov.in',
    helplineNumber: '155261 / 1800-115-526'
  },
  {
    id: 'kb-ayushman-bharat',
    title: 'Ayushman Bharat PM-JAY: Free ₹5 Lakh Health Card Process',
    titleHi: 'आयुष्मान भारत पीएम-जय: ₹5 लाख तक का मुफ्त स्वास्थ्य कार्ड बनाने की प्रक्रिया',
    category: 'Healthcare',
    summary: 'Comprehensive health coverage of up to ₹5,00,000 per eligible family per year for secondary and tertiary hospitalization across India.',
    summaryHi: 'भारत भर में द्वितीयक और तृतीयक अस्पताल में भर्ती के लिए प्रति पात्र परिवार प्रति वर्ष ₹5,00,000 तक का व्यापक स्वास्थ्य बीमा।',
    content: `## Ayushman Bharat National Health Protection Mission\n\n- Provides **₹5,00,000 annual cashless coverage** across 27,000+ empanelled hospitals.\n- Check eligibility at [beneficiary.nha.gov.in](https://beneficiary.nha.gov.in).\n- Senior citizens aged 70+ receive universal top-up cards regardless of income.`,
    contentHi: `## आयुष्मान भारत राष्ट्रीय स्वास्थ्य सुरक्षा योजना\n\n- ₹5,00,000 प्रति वर्ष कैशलेस अस्पताल उपचार।\n- [beneficiary.nha.gov.in](https://beneficiary.nha.gov.in) पर पात्रता जांचें।`,
    tags: ['Ayushman Bharat', 'Health Card', 'PM-JAY', 'Hospital'],
    lastUpdated: '2026-09-01',
    helpfulCount: 512,
    notHelpfulCount: 14,
    views: 6320,
    officialPortalUrl: 'https://beneficiary.nha.gov.in',
    helplineNumber: '14555'
  },
  {
    id: 'kb-nsp-scholarships',
    title: 'National Scholarship Portal (NSP): Application, Verification & DBT',
    titleHi: 'राष्ट्रीय छात्रवृत्ति पोर्टल (NSP): आवेदन, सत्यापन और डीबीटी प्रक्रिया',
    category: 'Education',
    summary: 'Single portal for Central, UGC/AICTE, and State government scholarships for Pre-Matric, Post-Matric, and Higher Education students.',
    summaryHi: 'प्री-मैट्रिक, पोस्ट-मैट्रिक और उच्च शिक्षा के छात्रों के लिए केंद्र, यूजीसी और राज्य सरकार की छात्रवृत्ति का एकीकृत पोर्टल।',
    content: `## National Scholarship Portal (NSP)\n\n1. Register with OTR (One Time Registration) using Aadhaar and Face Auth.\n2. Submit income and caste certificates issued by State Revenue authorities.\n3. Track institute and district nodal officer verification at [scholarships.gov.in](https://scholarships.gov.in).`,
    contentHi: `## राष्ट्रीय छात्रवृत्ति पोर्टल (NSP)\n\n- [scholarships.gov.in](https://scholarships.gov.in) पर वन टाइम रजिस्ट्रेशन (OTR) करें।`,
    tags: ['NSP', 'Scholarship', 'Education', 'Student'],
    lastUpdated: '2026-08-20',
    helpfulCount: 290,
    notHelpfulCount: 8,
    views: 3890,
    officialPortalUrl: 'https://scholarships.gov.in',
    helplineNumber: '0120-6619540'
  },
  {
    id: 'kb-pmkvy-skill',
    title: 'Skill India PMKVY 4.0: Free Job-Oriented Industry Training Courses',
    titleHi: 'स्किल इंडिया पीएमकेवीवाई 4.0: उद्योग-उन्मुख मुफ्त प्रशिक्षण और प्रमाणन',
    category: 'Employment',
    summary: 'Free short-term skill training, RPL certification, and special project courses in IT, Healthcare, Electronics, Construction, and Automotive.',
    summaryHi: 'आईटी, स्वास्थ्य सेवा, इलेक्ट्रॉनिक्स, निर्माण और ऑटोमोटिव में मुफ्त अल्पकालिक कौशल प्रशिक्षण और प्रमाणन।',
    content: `## Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)\n\n- **100% Free Training**: Short Term Training (STT) and Recognition of Prior Learning (RPL).\n- **Key Sectors**: IT-ITeS, Electronics & Hardware, Healthcare, Automotive, Green Energy, Construction.\n- **Enrollment Portal**: [skillindia.gov.in](https://www.skillindia.gov.in) or [skillindiadigital.gov.in](https://www.skillindiadigital.gov.in).`,
    contentHi: `## प्रधानमंत्री कौशल विकास योजना (PMKVY 4.0)\n\n- 100% मुफ्त कौशल प्रशिक्षण व सरकारी प्रमाण पत्र।\n- [skillindia.gov.in](https://www.skillindia.gov.in) पर पंजीकरण करें।`,
    tags: ['PMKVY', 'Skill India', 'Employment', 'Training', 'Courses'],
    lastUpdated: '2026-09-10',
    helpfulCount: 440,
    notHelpfulCount: 6,
    views: 4980,
    officialPortalUrl: 'https://www.skillindia.gov.in',
    helplineNumber: '088000-55555 / 011-24300606'
  },
  {
    id: 'kb-digilocker-aadhaar',
    title: 'DigiLocker & Aadhaar: Verified Paperless Document Vault',
    titleHi: 'डिजिलॉकर और आधार: डिजिटल इंडिया का आधिकारिक सुरक्षित दस्तावेज वॉल्ट',
    category: 'Documents & Identity',
    summary: 'Legally valid digital copies of Aadhaar, PAN, Driving License, Vehicle RC, and Marksheets under Rule 9A of IT Act 2000.',
    summaryHi: 'आईटी अधिनियम २००० के नियम ९ए के तहत आधार, पैन, ड्राइविंग लाइसेंस और अंकतालिका की कानूनी रूप से मान्य डिजिटल प्रतियां।',
    content: `## DigiLocker National Paperless Platform\n\n- Documents stored in DigiLocker are treated at par with original physical documents across traffic police, airports, and universities.\n- Access and link documents at [digilocker.gov.in](https://digilocker.gov.in).`,
    contentHi: `## डिजिलॉकर राष्ट्रीय डिजिटल वॉल्ट\n\n- डिजिटल दस्तावेज मूल भौतिक दस्तावेजों के समान कानूनी रूप से मान्य हैं।\n- [digilocker.gov.in](https://digilocker.gov.in) पर लॉगिन करें।`,
    tags: ['DigiLocker', 'Aadhaar', 'PAN', 'Driving License', 'Documents'],
    lastUpdated: '2026-08-25',
    helpfulCount: 670,
    notHelpfulCount: 10,
    views: 8420,
    officialPortalUrl: 'https://digilocker.gov.in',
    helplineNumber: '011-24301851'
  },
  {
    id: 'kb-cpgrams-grievance',
    title: 'CPGRAMS Public Grievance: How to File & Track Complaints with Ministries',
    titleHi: 'सीपीजीआरएएमएस जन शिकायत: केंद्रीय मंत्रालयों में शिकायत कैसे दर्ज और ट्रैक करें',
    category: 'Grievance Redressal',
    summary: 'Centralized public grievance redressal portal connecting citizens directly with 90+ Central Ministries, Departments, and State Governments.',
    summaryHi: 'नागरिकों को ९०+ केंद्रीय मंत्रालयों और राज्य सरकारों से सीधे जोड़ने वाला राष्ट्रीय जन शिकायत निवारण पोर्टल।',
    content: `## Centralized Public Grievance Redress and Monitoring System (CPGRAMS)\n\n- File grievances at [pgportal.gov.in](https://pgportal.gov.in) with mandatory 30-day resolution timeline.\n- Automatic escalation to Appellate Authority if resolution is unsatisfied.\n- Toll-Free National Consumer / Grievance Helpline: **1915 / 1800-11-4000**.`,
    contentHi: `## केंद्रीय लोक शिकायत निवारण प्रणाली (CPGRAMS)\n\n- 30 दिनों के भीतर अनिवार्य समाधान हेतु [pgportal.gov.in](https://pgportal.gov.in) पर शिकायत दर्ज करें।\n- राष्ट्रीय हेल्पलाइन: 1915।`,
    tags: ['CPGRAMS', 'Grievance', 'Complaint', 'DARPG', 'Helpline'],
    lastUpdated: '2026-09-05',
    helpfulCount: 395,
    notHelpfulCount: 9,
    views: 5120,
    officialPortalUrl: 'https://pgportal.gov.in',
    helplineNumber: '1915 / 1800-11-4000'
  }
];

export const MOCK_SETTINGS: SystemSettings = {
  aiModel: 'sarvamai/sarvam-2b',
  aiTemperature: 0.3,
  autoEscalationThreshold: 0.75,
  defaultLanguage: 'en',
  enableVoiceSynthesis: true,
  enableSoundEffects: true,
  reducedMotion3D: false,
  themeMode: 'light',
  notificationsEnabled: true,
  apiKeySet: false,
  aiProvider: 'nvidia',
  nvidiaModel: 'sarvamai/sarvam-2b',
  nvidiaApiKeySet: false
};
