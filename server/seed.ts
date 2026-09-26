import { db } from './db';
import { KnowledgeArticle, Ticket, EscalationItem } from '../src/types';

export const SEED_KNOWLEDGE_ARTICLES: Omit<KnowledgeArticle, 'helpfulCount' | 'notHelpfulCount' | 'views'>[] = [
  {
    id: 'kb-pm-kisan',
    title: 'PM-Kisan Samman Nidhi: Eligibility, KYC & Installment Status',
    titleHi: 'प्रधानमंत्री किसान सम्मान निधि: पात्रता, ई-केवाईसी और किस्त की स्थिति',
    category: 'Government Services',
    summary: 'Direct income support of ₹6,000 per year in three 4-monthly installments of ₹2,000 to all landholding farmer families.',
    summaryHi: 'सभी भूमिधारक किसान परिवारों को ₹2,000 की तीन 4-मासिक किस्तों में प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।',
    content: `## PM-Kisan Samman Nidhi Scheme Guidelines

### 1. Scheme Benefits
Under the PM-Kisan scheme, all landholding farmer families receive financial assistance of **₹6,000 per year**, disbursed directly into Aadhaar-seeded bank accounts in three equal installments of ₹2,000 every 4 months.

### 2. Mandatory Eligibility & e-KYC Requirements
- Farmer must have cultivable landholding registered in revenue records in their name.
- **Mandatory e-KYC**: Must be completed via OTP on PM-Kisan Portal (pmkisan.gov.in) using registered Aadhaar mobile, or via biometric authentication at any Common Service Center (CSC).
- **Land Seeding (Bhoo-Satyapan)**: Ensure land survey number is verified by local Revenue/Patwari officer.
- **Aadhaar-Bank Linkage**: Account must be mapped with NPCI Direct Benefit Transfer (DBT) gateway.

### 3. How to Check Beneficiary Status
1. Visit the official portal [pmkisan.gov.in](https://pmkisan.gov.in).
2. Click on **'Know Your Status'** on the homepage.
3. Enter your Registration Number or Aadhaar Number along with captcha.
4. Review your FTO (Fund Transfer Order) generated status, e-KYC status, and Bank account seeding status.

### 4. Need Assistance?
If your installment is withheld, contact the PM-Kisan Toll-Free Helpline at **155261 / 1800115526** or raise a support ticket through BSAI.`,
    contentHi: `## प्रधानमंत्री किसान सम्मान निधि योजना दिशानिर्देश

### १. योजना के लाभ
पीएम-किसान योजना के अंतर्गत सभी भूमिधारक किसान परिवारों को **₹6,000 प्रति वर्ष** की वित्तीय सहायता दी जाती है, जो प्रति 4 माह में ₹2,000 की 3 समान किस्तों में सीधे आधार-सीडेड बैंक खाते में भेजी जाती है।

### २. आवश्यक पात्रता एवं ई-केवाईसी
- किसान के नाम पर राजस्व रिकॉर्ड में कृषि योग्य भूमि दर्ज होनी चाहिए।
- **अनिवार्य ई-केवाईसी**: पीएम-किसान पोर्टल (pmkisan.gov.in) पर आधार ओटीपी के माध्यम से या सीएससी केंद्र पर बायोमेट्रिक द्वारा पूर्ण करें।
- **भूमि अंकन (भू-सत्यापन)**: स्थानीय पटवारी/राजस्व अधिकारी द्वारा सत्यापित होना आवश्यक है।
- **आधार-बैंक मैपिंग**: बैंक खाता एनपीसीआई (NPCI) डीबीटी से जुड़ा होना चाहिए।

### ३. लाभार्थी स्थिति कैसे जांचें
1. आधिकारिक पोर्टल pmkisan.gov.in पर जाएं।
2. 'Know Your Status' पर क्लिक करें।
3. रजिस्ट्रेशन नंबर या आधार नंबर दर्ज करें।
4. अपनी ई-केवाईसी, लैंड सीडिंग और एफटीओ स्थिति देखें।`,
    tags: ['PM-Kisan', 'Agriculture', 'DBT', 'Farmer Subsidy', 'e-KYC'],
    lastUpdated: '2026-08-15',
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
    content: `## Ayushman Bharat National Health Protection Mission (PM-JAY)

### 1. Key Coverage & Entitlement
- Provides **₹5,00,000 annual cashless coverage** per family across 27,000+ empanelled government and private hospitals across India.
- No cap on family size, age, or gender.
- Covers pre-existing diseases from Day 1, including medicines, diagnostics, ICU charges, and post-discharge medications for 15 days.

### 2. Eligibility Verification
- Check your eligibility online on **beneficiary.nha.gov.in** using your Mobile Number or Ration Card Number.
- Families identified in the SECC 2011 database or having State Food Security Ration Cards are eligible.
- Senior citizens aged 70+ now receive a dedicated top-up card under the expanded PM-JAY guidelines.

### 3. Steps to Download Ayushman Card (Golden Card)
1. Log in to [beneficiary.nha.gov.in](https://beneficiary.nha.gov.in) using Aadhaar OTP.
2. Select your State, Scheme (PMJAY), and District.
3. Search by Family ID (Ration Card) or Aadhaar number.
4. Click on **e-KYC** to verify biometric/OTP, capture live selfie, and immediately download your Ayushman Card PDF.`,
    contentHi: `## आयुष्मान भारत राष्ट्रीय स्वास्थ्य मिशन (PM-JAY)

### १. मुख्य लाभ
- देश के 27,000+ सूचीबद्ध सरकारी व निजी अस्पतालों में प्रति परिवार **₹5 लाख तक का सालाना कैशलेस इलाज**।
- परिवार के सदस्यों की संख्या या आयु की कोई सीमा नहीं।
- पहले दिन से ही सभी पुरानी बीमारियां, आईसीयू, सर्जरी और अस्पताल से छुट्टी के बाद 15 दिनों की दवाएं शामिल।

### २. पात्रता जांचें
- beneficiary.nha.gov.in पोर्टल पर अपने मोबाइल नंबर या राशन कार्ड नंबर से पात्रता जांचें।
- 70 वर्ष या उससे अधिक आयु के सभी वरिष्ठ नागरिकों के लिए विशेष आयुष्मान वय वंदना कार्ड उपलब्ध है।

### ३. आयुष्मान कार्ड डाउनलोड करने की प्रक्रिया
1. beneficiary.nha.gov.in पर आधार ओटीपी से लॉगिन करें।
2. अपना राज्य, योजना (PMJAY) और राशन कार्ड/आधार नंबर दर्ज करें।
3. ई-केवाईसी पूर्ण करके लाइव फोटो कैप्चर करें और तुरंत कार्ड डाउनलोड करें।`,
    tags: ['Ayushman Bharat', 'PM-JAY', 'Health Card', 'Hospitalization', 'Cashless Health'],
    lastUpdated: '2026-08-20',
    officialPortalUrl: 'https://beneficiary.nha.gov.in',
    helplineNumber: '14555'
  },
  {
    id: 'kb-aadhaar-services',
    title: 'Aadhaar Card: Online Address Update, Biometrics & PVC Card',
    titleHi: 'आधार कार्ड: ऑनलाइन पता अपडेट, बायोमेट्रिक एवं पीवीसी कार्ड ऑर्डर',
    category: 'Documents & Identity',
    summary: 'Official procedures for updating your Aadhaar address, mobile number link, locking biometrics for fraud prevention, and ordering waterproof PVC cards.',
    summaryHi: 'आधार में ऑनलाइन पता बदलने, मोबाइल नंबर लिंक करने, बायोमेट्रिक लॉक करने और वाटरप्रूफ पीवीसी कार्ड मंगवाने की आधिकारिक प्रक्रिया।',
    content: `## UIDAI Aadhaar Citizen Services

### 1. Online Address Update
- Visit **myaadhaar.uidai.gov.in** and log in with your Aadhaar number and OTP.
- Select **'Address Update'** -> 'Update Aadhaar Online'.
- Upload supporting proof of address (Electricity Bill, Passport, Bank Passbook, Voter ID, or Head of Family consent).
- Pay the nominal fee of ₹50 online. Tracking Service Request Number (SRN) will be generated. Turnaround time: 3-7 working days.

### 2. Mobile Number & Biometric Updates
- Due to security guidelines, mobile number change, iris scan, and fingerprint updates require a one-time physical visit to any Aadhaar Seva Kendra or Post Office.
- Book prior appointment on [appointments.uidai.gov.in](https://appointments.uidai.gov.in) to avoid queues.

### 3. Ordering Official PVC Aadhaar Card
- Order high-security durable PVC card on myAadhaar portal for ₹50 with speed post delivery to your registered address.`,
    contentHi: `## यूआईडीएआई आधार नागरिक सेवाएं

### १. ऑनलाइन पता अपडेट
- myaadhaar.uidai.gov.in पर आधार नंबर व ओटीपी से लॉगिन करें।
- 'Address Update' विकल्प चुनें।
- मान्य निवास प्रमाण पत्र (बिजली बिल, बैंक पासबुक, वोटर आईडी) अपलोड करें।
- ₹50 का ऑनलाइन शुल्क भुगतान करें। ३-७ कार्यदिवसों में पता अपडेट हो जाएगा।

### २. मोबाइल नंबर व बायोमेट्रिक अपडेट
- मोबाइल नंबर या फिंगरप्रिंट अपडेट कराने के लिए नजदीकी आधार सेवा केंद्र या डाकघर में उपस्थित होना अनिवार्य है।
- myaadhaar पोर्टल से पूर्व अपॉइंटमेंट बुक कर सकते हैं।

### ३. पीवीसी आधार कार्ड
- ₹50 में स्पीड पोस्ट द्वारा सुरक्षित पीवीसी कार्ड घर मंगवाएं।`,
    tags: ['Aadhaar', 'UIDAI', 'Identity', 'Address Update', 'PVC Card'],
    lastUpdated: '2026-09-01',
    officialPortalUrl: 'https://myaadhaar.uidai.gov.in',
    helplineNumber: '1947'
  },
  {
    id: 'kb-scholarships-nsp',
    title: 'National Scholarship Portal (NSP): Application Guide & OTR',
    titleHi: 'राष्ट्रीय छात्रवृत्ति पोर्टल (NSP): आवेदन प्रक्रिया और ओटीआर गाइड',
    category: 'Education',
    summary: 'Central and State government pre-matric, post-matric, and higher education scholarships for SC/ST/OBC/Minority and Merit students.',
    summaryHi: 'अनुसूचित जाति/जनजाति/ओबीसी/अल्पसंख्यक और मेधावी छात्रों के लिए केंद्र और राज्य सरकार की प्री-मैट्रिक, पोस्ट-मैट्रिक छात्रवृत्तियां।',
    content: `## National Scholarship Portal (NSP 2.0)

### 1. One Time Registration (OTR)
- Starting academic year 2024-2026, all students must first generate an **OTR (One Time Registration) Number** using the **Aadhaar FaceRD / OTP** biometric app.
- OTR number is lifelong and eliminates repeated documentation each academic year.

### 2. Popular Central Schemes
- **Pre-Matric and Post-Matric Scholarships** for SC/ST/OBC/EBC/DNT students.
- **National Means-cum-Merit Scholarship Scheme (NMMSS)** for Class 9-12 students (₹12,000/year).
- **Central Sector Scheme of Scholarships for College and University Students**.
- **PM-YASASVI Scholarship** for vibrant school & college students.

### 3. Application Checklist
- Valid Aadhaar Number & Student Bank Account (Aadhaar Seeded).
- Previous year academic marksheet.
- Income Certificate issued by Tehsildar / Competent Authority.
- Caste / Community Certificate (where applicable).
- Bonafide Student Certificate from College/School Principal.`,
    contentHi: `## राष्ट्रीय छात्रवृत्ति पोर्टल (NSP)

### १. वन टाइम रजिस्ट्रेशन (OTR)
- सभी छात्रों को सबसे पहले आधार FaceRD / OTP द्वारा अपना लाइफटाइम **OTR नंबर** बनाना आवश्यक है।

### २. प्रमुख छात्रवृत्ति योजनाएं
- एससी/एसटी/ओबीसी/ईबीसी छात्रों के लिए प्री-मैट्रिक एवं पोस्ट-मैट्रिक छात्रवृत्तियां।
- कक्षा ९ से १२ के लिए नेशनल मीन्स-कम-मेरिट स्कॉलरशिप (₹12,000 प्रति वर्ष)।
- कॉलेज एवं विश्वविद्यालय के लिए सेंट्रल सेक्टर स्कॉलरशिप स्कीम।
- पीएम-यशस्वी (PM-YASASVI) योजना।

### ३. आवश्यक दस्तावेज
- आधार कार्ड, आधार से जुड़ा बैंक खाता, गत वर्ष की अंकसूची, आय प्रमाण पत्र और संस्थान का बोनाफाइड प्रमाण पत्र।`,
    tags: ['Scholarship', 'NSP', 'Education', 'College Fees', 'PM-YASASVI'],
    lastUpdated: '2026-08-28',
    officialPortalUrl: 'https://scholarships.gov.in',
    helplineNumber: '0120-6619540'
  },
  {
    id: 'kb-cpgrams-grievance',
    title: 'CPGRAMS: Public Grievance Redressal System for Citizen Complaints',
    titleHi: 'सीपीजीआरएएमएस: नागरिक शिकायतों के निवारण हेतु राष्ट्रीय पोर्टल',
    category: 'Grievance Redressal',
    summary: 'Centralized Public Grievance Redress and Monitoring System for lodging and escalating complaints against any Central/State Government Ministry or Public Undertaking.',
    summaryHi: 'किसी भी केंद्रीय/राज्य मंत्रालय या सार्वजनिक उपक्रम के खिलाफ शिकायतों को दर्ज और ट्रैक करने का केंद्रीकृत राष्ट्रीय पोर्टल।',
    content: `## Centralized Public Grievance Redress and Monitoring System (CPGRAMS)

### 1. What is CPGRAMS?
CPGRAMS is an online 24/7 platform managed by the Department of Administrative Reforms and Public Grievances (DARPG) enabling citizens to lodge complaints against public utilities, ministries, banking services, railways, telecom, and municipal authorities.

### 2. Timebound Resolution Mandate
- As per Government mandate, every grievance must be resolved or addressed within **21 working days**.
- If unsatisfied with the resolution, citizens have the right to file an **Appeal to Appellate Authority** within 30 days.

### 3. How to Lodge a Grievance
1. Register/Login on [pgportal.gov.in](https://pgportal.gov.in).
2. Click on **'Lodge Public Grievance'**.
3. Select the concerned Ministry / Department (e.g. Ministry of Railways, Department of Financial Services, Road Transport, Power).
4. Enter grievance description (up to 2000 characters) and attach PDF supporting documents.
5. Receive unique Grievance Registration Number for live SMS and WhatsApp tracking.`,
    contentHi: `## केंद्रीकृत लोक शिकायत निवारण और निगरानी प्रणाली (CPGRAMS)

### १. सीपीजीआरएएमएस क्या है?
यह २४/७ राष्ट्रीय मंच है जहां नागरिक किसी भी केंद्रीय/राज्य मंत्रालय, बैंकिंग, रेलवे, बिजली, सड़क या डाक सेवा में हो रही देरी व भ्रष्टाचार की शिकायत दर्ज कर सकते हैं।

### २. समयबद्ध समाधान सीमा
- सरकारी नियम के अनुसार प्रत्येक शिकायत का निवारण **२१ कार्यदिवसों** के भीतर अनिवार्य है।
- यदि समाधान से असंतुष्ट हैं, तो ३० दिनों के भीतर अपीलीय अधिकारी के समक्ष अपील दर्ज की जा सकती है।

### ३. शिकायत कैसे दर्ज करें
1. pgportal.gov.in पर लॉगिन करें।
2. संबंधित मंत्रालय/विभाग का चयन करें।
3. शिकायत का विवरण लिखें और आवश्यक दस्तावेज संलग्न करें।
4. एसएमएस द्वारा प्राप्त ट्रैकिंग नंबर से स्थिति ट्रैक करें।`,
    tags: ['CPGRAMS', 'Grievance', 'Complaint', 'Government Accountability', 'PGPortal'],
    lastUpdated: '2026-09-05',
    officialPortalUrl: 'https://pgportal.gov.in',
    helplineNumber: '1800-11-0031'
  },
  {
    id: 'kb-digilocker-services',
    title: 'DigiLocker: Paperless Document Verification & Issuance',
    titleHi: 'डिजिलॉकर: सरकारी दस्तावेजों का सुरक्षित डिजिटल भंडारण एवं सत्यापन',
    category: 'Documents & Identity',
    summary: 'Cloud-based platform under Digital India for storing, sharing, and digitally verifying driving licenses, vehicle RC, marksheet, PAN, and Aadhaar.',
    summaryHi: 'ड्राइविंग लाइसेंस, आरसी, अंकसूची, पैन और आधार कार्ड को डिजिटल रूप से स्टोर और मान्य रूप से साझा करने का डिजिटल इंडिया मंच।',
    content: `## DigiLocker Citizen Document Ecosystem

### 1. Legal Validity
Under **Rule 9A of Information Technology (Preservation and Retention of Information by Intermediaries Providing Digital Locker Facilities) Rules, 2016**, issued documents in DigiLocker are treated at par with original physical documents by Police, Traffic Authorities, Universities, and Passports.

### 2. Documents Accessible
- Driving License (DL) and Vehicle Registration Certificate (RC) via MoRTH.
- Class 10 & 12 Marksheets / Certificates from CBSE, CISCE, and State Boards.
- Instant e-PAN Card via Income Tax Department.
- Ration Cards, COVID/Universal Immunization Certificates, Property Records.

### 3. Creating DigiLocker Account
1. Visit [digilocker.gov.in](https://digilocker.gov.in) or download the DigiLocker App.
2. Sign up with Aadhaar number and mobile OTP. Set a 6-digit security PIN.`,
    contentHi: `## डिजिलॉकर डिजिटल इंडिया मंच

### १. कानूनी मान्यता
सूचना प्रौद्योगिकी अधिनियम के नियम 9A के तहत डिजिलॉकर में उपलब्ध डिजिटल दस्तावेज मूल भौतिक दस्तावेजों के समान मान्य हैं। ट्रैफिक पुलिस, हवाई अड्डा, पासपोर्ट कार्यालय में पूर्णतः मान्य।

### २. उपलब्ध दस्तावेज
- ड्राइविंग लाइसेंस (DL) और वाहन आरसी (RC)
- सीबीएसई व राज्य बोर्ड की १०वीं व १२वीं की मार्कशीट
- ई-पैन कार्ड, राशन कार्ड, जाति/निवास प्रमाण पत्र।`,
    tags: ['DigiLocker', 'Digital India', 'Driving License', 'Marksheet', 'Paperless'],
    lastUpdated: '2026-08-10',
    officialPortalUrl: 'https://digilocker.gov.in',
    helplineNumber: '011-24303714'
  },
  {
    id: 'kb-msme-udyam',
    title: 'Udyam Registration & PM Mudra Loan for Micro Enterprises',
    titleHi: 'उद्यम पंजीकरण एवं प्रधानमंत्री मुद्रा लोन योजना',
    category: 'Employment',
    summary: 'Free official registration for MSMEs with collateral-free business loans up to ₹20 Lakhs under PM Mudra Yojana.',
    summaryHi: 'सूक्ष्म, लघु व मध्यम उद्यमों के लिए निःशुल्क पंजीकरण तथा ₹२० लाख तक का बिना गारंटी मुद्रा ऋण।',
    content: `## MSME Udyam Registration & PM Mudra Scheme

### 1. Free Udyam Portal Registration
- Zero fee, paperless registration at [udyamregistration.gov.in](https://udyamregistration.gov.in).
- Generates a permanent Udyam Registration Number (URN) with dynamic QR code.
- Required documents: Aadhaar Number, PAN Number, and GSTIN (if applicable).

### 2. PM Mudra Yojana (PMMY) Loan Categories
- **Shishu**: Loans up to ₹50,000 for startup small kiosks, artisans, street vendors.
- **Kishore**: Loans from ₹50,001 up to ₹5,00,000 for expanding equipment or working capital.
- **Tarun**: Loans from ₹5,00,001 up to ₹10,00,000 for established small manufacturing.
- **Tarun Plus (New 2024-2026)**: Extended limit up to **₹20 Lakhs** for entrepreneurs who previously availed and successfully repaid Tarun loans.`,
    contentHi: `## एमएसएमई उद्यम और पीएम मुद्रा योजना

### १. मुफ्त उद्यम रजिस्ट्रेशन
- udyamregistration.gov.in पर पूर्णतः निःशुल्क और पेपरलेस पंजीकरण।
- केवल आधार नंबर, पैन और बैंक खाते के विवरण से त्वरित उद्यम प्रमाण पत्र प्राप्त करें।

### २. पीएम मुद्रा ऋण श्रेणियां
- **शिशु**: ₹50,000 तक का ऋण (छोटे व्यवसाय, कारीगर, दुकानें)
- **किशोर**: ₹50,000 से ₹5 लाख तक
- **तरुण**: ₹5 लाख से ₹10 लाख तक
- **तरुण प्लस**: ₹10 लाख से ₹20 लाख तक (सफल उद्यमियों के लिए बिना किसी संपत्ति गारंटी के)।`,
    tags: ['MSME', 'Udyam', 'Mudra Loan', 'Business Subsidy', 'Self Employment'],
    lastUpdated: '2026-09-10',
    officialPortalUrl: 'https://udyamregistration.gov.in',
    helplineNumber: '1800-180-1111 / 1800-11-0001'
  }
];

export const SEED_TICKETS: Ticket[] = [
  {
    id: 'tkt-1042',
    ticketNumber: 'BSAI-2026-1042',
    citizenName: 'Rameshwar Kumar Verma',
    citizenContact: '+91 98765 43210',
    title: 'PM-Kisan 19th Installment Not Credited due to Land Seeding Mismatch',
    description: 'My PM-Kisan portal shows e-KYC as YES, but Land Seeding status is marked as NO despite submitting revenue documents to Tehsil 3 weeks ago.',
    category: 'Government Services',
    status: 'In Progress',
    priority: 'High',
    language: 'hi',
    createdAt: '2026-09-22T09:30:00Z',
    updatedAt: '2026-09-24T14:20:00Z',
    assignedAgent: 'Priya Sharma (District Nodal Officer)',
    resolutionNotes: 'Verified Khatauni records with Tehsil revenue portal. Forwarded land mutation ID #UP-2026-891 to state agricultural nodal desk for re-validation.',
    timeline: [
      {
        id: 'ev-1',
        timestamp: '2026-09-22T09:30:00Z',
        title: 'Ticket Raised via BSAI AI Assistant',
        description: 'Citizen requested escalation after AI verified e-KYC records and identified Land Seeding anomaly.',
        actor: 'BSAI Assistant',
        type: 'creation'
      },
      {
        id: 'ev-2',
        timestamp: '2026-09-23T11:15:00Z',
        title: 'Assigned to District Nodal Desk',
        description: 'Case routed to District Agriculture & Revenue cell for land record reconciliation.',
        actor: 'System',
        type: 'agent_assignment'
      },
      {
        id: 'ev-3',
        timestamp: '2026-09-24T14:20:00Z',
        title: 'Tehsil Record Cross-Verification In Progress',
        description: 'Patwari verification certificate uploaded. Awaiting FTO generation clearance.',
        actor: 'Human Support Officer',
        type: 'status_change'
      }
    ],
    escalationReason: 'Automated AI confidence check: Land Seeding requires revenue officer manual signoff.',
    tags: ['PM-Kisan', 'Land Seeding', 'Revenue Department']
  },
  {
    id: 'tkt-1043',
    ticketNumber: 'BSAI-2026-1043',
    citizenName: 'Ananya Deshmukh',
    citizenContact: '+91 98234 56789',
    title: 'Ayushman Card e-KYC Photo Rejection for Senior Citizen Parent',
    description: 'Trying to generate Ayushman Vaya Vandana card for my 74-year-old mother. Face auth failed repeatedly on beneficiary portal due to cataract/eyeglass glare.',
    category: 'Healthcare',
    status: 'Open',
    priority: 'High',
    language: 'mr',
    createdAt: '2026-09-24T18:15:00Z',
    updatedAt: '2026-09-24T18:15:00Z',
    timeline: [
      {
        id: 'ev-4',
        timestamp: '2026-09-24T18:15:00Z',
        title: 'Ticket Created',
        description: 'Inquiry registered regarding biometric exemption for senior citizen health card issuance.',
        actor: 'Citizen',
        type: 'creation'
      }
    ],
    escalationReason: 'Biometric verification failure for senior citizen needing offline CSC assisted KYC.',
    tags: ['Ayushman Bharat', 'Senior Citizen', 'e-KYC']
  },
  {
    id: 'tkt-1044',
    ticketNumber: 'BSAI-2026-1044',
    citizenName: 'Mohammad Farooq',
    citizenContact: '+91 94190 12345',
    title: 'National Scholarship Portal Bonafide Institute Code Missing',
    description: 'My newly affiliated Government Polytechnic institute code is not appearing in the drop-down menu of NSP Post-Matric scheme application.',
    category: 'Education',
    status: 'Resolved',
    priority: 'Medium',
    language: 'en',
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-23T16:45:00Z',
    assignedAgent: 'Vikram Mehta (Higher Education Officer)',
    resolutionNotes: 'Contacted State Nodal Officer (SNO). Institute AISHE code was updated in NSP database on 23rd Sept. Candidate successfully completed form submission.',
    timeline: [
      {
        id: 'ev-5',
        timestamp: '2026-09-20T10:00:00Z',
        title: 'Ticket Submitted',
        description: 'Institute AISHE mapping missing on NSP portal.',
        actor: 'Citizen',
        type: 'creation'
      },
      {
        id: 'ev-6',
        timestamp: '2026-09-21T12:00:00Z',
        title: 'AISHE Master Data Synchronized',
        description: 'Updated institute registry through central AISHE sync pipeline.',
        actor: 'Human Support Officer',
        type: 'status_change'
      },
      {
        id: 'ev-7',
        timestamp: '2026-09-23T16:45:00Z',
        title: 'Resolution Confirmed',
        description: 'Student submitted application reference #NSP2026-JK-90812.',
        actor: 'Human Support Officer',
        type: 'resolution'
      }
    ],
    tags: ['NSP', 'AISHE', 'Scholarship']
  },
  {
    id: 'tkt-1045',
    ticketNumber: 'BSAI-2026-1045',
    citizenName: 'Sunita Sundaram',
    citizenContact: '+91 94441 23456',
    title: 'CPGRAMS Complaint regarding Disputed Commercial Power Tariff',
    description: 'State Electricity Board issued industrial tariff on domestic pump connection despite submitting agricultural subsidy certificate.',
    category: 'Grievance Redressal',
    status: 'Escalated',
    priority: 'Urgent',
    language: 'ta',
    createdAt: '2026-09-24T08:00:00Z',
    updatedAt: '2026-09-24T19:30:00Z',
    assignedAgent: 'K. Balasubramanian (DARPG Ombudsman)',
    timeline: [
      {
        id: 'ev-8',
        timestamp: '2026-09-24T08:00:00Z',
        title: 'Grievance Auto-Escalated',
        description: 'Electricity tariff dispute flagged for immediate ombudsman review.',
        actor: 'BSAI Assistant',
        type: 'escalation'
      }
    ],
    escalationReason: 'Direct citizen request for DARPG Ombudsman intervention.',
    tags: ['CPGRAMS', 'Electricity Tariff', 'Ombudsman']
  },
  {
    id: 'tkt-1046',
    ticketNumber: 'BSAI-2026-1046',
    citizenName: 'Harpreet Singh',
    citizenContact: '+91 98140 98765',
    title: 'Udyam Registration Certificate Download Error on Portal',
    description: 'Generated Udyam Registration 2 days ago but receiving 500 error when clicking Print Certificate on MSME portal.',
    category: 'Employment',
    status: 'Resolved',
    priority: 'Low',
    language: 'en',
    createdAt: '2026-09-19T14:20:00Z',
    updatedAt: '2026-09-21T11:10:00Z',
    assignedAgent: 'BSAI AI Automated Agent',
    resolutionNotes: 'AI provided alternate DigiLocker direct fetch link. Citizen retrieved signed PDF certificate directly with URN UDYAM-PB-12-004921.',
    timeline: [
      {
        id: 'ev-9',
        timestamp: '2026-09-19T14:20:00Z',
        title: 'Inquiry Raised',
        description: 'Citizen unable to download PDF certificate.',
        actor: 'Citizen',
        type: 'creation'
      },
      {
        id: 'ev-10',
        timestamp: '2026-09-21T11:10:00Z',
        title: 'Resolved via DigiLocker Integration Guide',
        description: 'Citizen confirmed document downloaded.',
        actor: 'BSAI Assistant',
        type: 'resolution'
      }
    ],
    tags: ['MSME', 'Udyam', 'DigiLocker']
  }
];

export const SEED_ESCALATIONS: EscalationItem[] = [
  {
    id: 'esc-101',
    ticketId: 'tkt-1045',
    ticketNumber: 'BSAI-2026-1045',
    citizenName: 'Sunita Sundaram',
    category: 'Grievance Redressal',
    priority: 'Urgent',
    status: 'Pending Review',
    reason: 'Electricity Tariff Dispute against TANGEDCO demanding immediate audit before penalty deadline.',
    escalatedAt: '2026-09-24T08:00:00Z',
    assignedAgent: 'K. Balasubramanian (DARPG Ombudsman)',
    conversationSnippet: 'Citizen: "My domestic tubewell meter was billed under commercial slab ₹14,500. Sub-station officer refused application." -> BSAI: "Transferred to Ombudsman Cell."'
  },
  {
    id: 'esc-102',
    ticketId: 'tkt-1042',
    ticketNumber: 'BSAI-2026-1042',
    citizenName: 'Rameshwar Kumar Verma',
    category: 'Government Services',
    priority: 'High',
    status: 'Agent Assigned',
    reason: 'PM-Kisan Land Seeding discrepancy between UP Bhulekh records and Central PM-Kisan Portal.',
    escalatedAt: '2026-09-22T09:35:00Z',
    assignedAgent: 'Priya Sharma (District Nodal Officer)',
    conversationSnippet: 'Citizen: "Why is 19th installment stopped when my e-KYC is active?" -> BSAI: "Identified Land Seeding status NO. Escalating to Tehsil desk."'
  },
  {
    id: 'esc-103',
    ticketId: 'tkt-1043',
    ticketNumber: 'BSAI-2026-1043',
    citizenName: 'Ananya Deshmukh',
    category: 'Healthcare',
    priority: 'High',
    status: 'Pending Review',
    reason: 'Ayushman Card biometric iris/face failure for 74yo senior citizen requiring CSC physical verification order.',
    escalatedAt: '2026-09-24T18:20:00Z',
    conversationSnippet: 'Citizen: "Mother cannot complete face match on Ayushman App." -> BSAI: "Flagging for offline doorstep verification."'
  }
];

export async function seedDatabase(): Promise<void> {
  // Check if articles already exist
  const existingArticles = await db.get('SELECT COUNT(*) as count FROM knowledge_articles');
  if (!existingArticles || existingArticles.count === 0) {
    console.log('Seeding Knowledge Articles...');
    for (const a of SEED_KNOWLEDGE_ARTICLES) {
      await db.run(
        `INSERT INTO knowledge_articles (id, title, title_hi, category, summary, summary_hi, content, content_hi, tags, views, helpful_count, not_helpful_count, last_updated, official_portal_url, helpline_number)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          a.id,
          a.title,
          a.titleHi,
          a.category,
          a.summary,
          a.summaryHi,
          a.content,
          a.contentHi,
          JSON.stringify(a.tags),
          Math.floor(Math.random() * 450) + 120,
          Math.floor(Math.random() * 80) + 25,
          Math.floor(Math.random() * 5),
          a.lastUpdated,
          a.officialPortalUrl || null,
          a.helplineNumber || null
        ]
      );
    }
  }

  // Check if tickets already exist
  const existingTickets = await db.get('SELECT COUNT(*) as count FROM tickets');
  if (!existingTickets || existingTickets.count === 0) {
    console.log('Seeding Demo Tickets & Timelines...');
    for (const t of SEED_TICKETS) {
      await db.run(
        `INSERT INTO tickets (id, ticket_number, citizen_name, citizen_contact, title, description, category, status, priority, language, created_at, updated_at, assigned_agent, resolution_notes, timeline, escalation_reason, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.id,
          t.ticketNumber,
          t.citizenName,
          t.citizenContact || null,
          t.title,
          t.description,
          t.category,
          t.status,
          t.priority,
          t.language,
          t.createdAt,
          t.updatedAt,
          t.assignedAgent || null,
          t.resolutionNotes || null,
          JSON.stringify(t.timeline),
          t.escalationReason || null,
          JSON.stringify(t.tags || [])
        ]
      );
    }
  }

  // Check if escalations already exist
  const existingEscalations = await db.get('SELECT COUNT(*) as count FROM escalations');
  if (!existingEscalations || existingEscalations.count === 0) {
    console.log('Seeding Escalation Queue...');
    for (const e of SEED_ESCALATIONS) {
      await db.run(
        `INSERT INTO escalations (id, ticket_id, ticket_number, citizen_name, category, priority, status, reason, escalated_at, assigned_agent, conversation_snippet)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          e.id,
          e.ticketId,
          e.ticketNumber,
          e.citizenName,
          e.category,
          e.priority,
          e.status,
          e.reason,
          e.escalatedAt,
          e.assignedAgent || null,
          e.conversationSnippet || null
        ]
      );
    }
  }

  // Default system settings
  const existingSettings = await db.get('SELECT COUNT(*) as count FROM settings');
  if (!existingSettings || existingSettings.count === 0) {
    await db.run(`INSERT INTO settings (key, value) VALUES ('aiModel', 'bsai-neural-local')`);
    await db.run(`INSERT INTO settings (key, value) VALUES ('aiTemperature', '0.4')`);
    await db.run(`INSERT INTO settings (key, value) VALUES ('autoEscalationThreshold', '0.70')`);
    await db.run(`INSERT INTO settings (key, value) VALUES ('defaultLanguage', 'en')`);
    await db.run(`INSERT INTO settings (key, value) VALUES ('enableVoiceSynthesis', 'true')`);
    await db.run(`INSERT INTO settings (key, value) VALUES ('enableSoundEffects', 'true')`);
    await db.run(`INSERT INTO settings (key, value) VALUES ('reducedMotion3D', 'false')`);
    await db.run(`INSERT INTO settings (key, value) VALUES ('notificationsEnabled', 'true')`);
  }

  console.log('BSAI Database initialized and verified with realistic demo data.');
}
