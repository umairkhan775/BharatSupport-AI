# 🇮🇳 BHARAT SUPPORT AI (BSAI)
### *AI-Powered Customer & Citizen Support Platform for a Digital India*
> **Tagline:** *"Your Voice. Our AI. A Stronger Bharat."*

---

## 🌟 Overview & Mission
**Bharat Support AI (BSAI)** is an AI-powered citizen intelligence platform built specifically for Indian public digital infrastructure. BSAI bridges the digital literacy divide by offering:
- **Interactive 3D Bharat Universe**: A pure interactive Three.js 3D world with procedural landscapes, central BSAI AI avatar, and 7 floating interactive service nodes.
- **Multilingual NLP Engine**: Conversational AI understanding English, Hindi, and regional Indic languages with voice recognition and text-to-speech output.
- **5-Stage Architecture Flow**: Data Collection → AI Understanding → Knowledge Retrieval & Reasoning → Action & Escalation → Dashboard & Insights.
- **Persistent Ticket & Escalation Lifecycle**: Automatic and manual transfer of complex citizen inquiries to District Nodal Support Desks with live status tracking.
- **Light Premium Visuals**: Ivory (`#F7F4ED`), Deep Indigo (`#202A5A`), Warm Saffron (`#F2A900`), and Indian Teal (`#159A9C`).

---

## 🚀 Key Features & Capabilities

### 1. Pure Interactive 3D Landing Page
- **Procedural Bharat Landscape**: Concentric Ashoka/Mandapa circular motifs, stylized architectural stupa pillars, and digital circuit roads.
- **Central BSAI AI Avatar**: Animated 3D robot with glowing expressive visor eyes, oscillating floating halo, floating hands, and audio pulse response.
- **7 Floating Service Nodes**:
  1. 🏛️ **Government Services** (PM-Kisan, DBT, Welfare Schemes)
  2. 🎓 **Education & Skills** (NSP Scholarships, PMKVY, Skill India)
  3. 🏥 **Healthcare** (Ayushman Bharat PM-JAY, Jan Aushadhi)
  4. 💼 **Employment & MSME** (Udyam, PM Mudra Loans, Rozgar Mela)
  5. ⚖️ **Grievance Redressal** (CPGRAMS, PGPortal, Public Utilities)
  6. 📄 **Documents & Identity** (Aadhaar Update, DigiLocker, e-PAN)
  7. 🌐 **Multilingual Voice AI** (22 Official Indian Languages)
- **Controls**: Drag to rotate, wheel/pinch to zoom, tap/click nodes to open service modals with instant AI query actions.

### 2. Conversational AI Assistant
- Dual-mode NLP query processor (self-contained local Bharat NLP + cloud LLM bridge).
- Intent recognition, confidence scoring, official portal citations, and document checklist generator.
- Web Speech API integration for Indian accent voice recognition and multilingual TTS vocal synthesis.
- 1-Click "Request Human Officer" escalation button.
- Instant support request creator directly from chat conversation.

### 3. Citizen Request Tracking (My Requests)
- Live 3-step progress stepper: `Created` → `Processing / Escalated` → `Resolved`.
- Audit trail and timeline event logs.
- Interactive satisfaction star rating dialog with confetti celebration.

### 4. Admin & Staff Ticket Management (Support Requests)
- Full table with search, category filter, status filter, and priority tagging.
- Slide-over inspection drawer for assigning nodal officers, adding verification logs, and signing off resolutions.

### 5. Human Escalation Queue
- Dedicated triage desk for cases flagged by AI confidence thresholds or citizen ombudsman requests.
- Case claim action ("Assign to Me") and departmental signoff notes.

### 6. Knowledge Base
- Searchable repository with dual-language toggle (English / हिन्दी).
- Official portal links, helpline numbers, and helpfulness voting.

### 7. Live Telemetry & Analytics
- Dynamic KPIs: Total Queries, Avg Response Time (1.8s), Resolution Rate (94%), Customer Satisfaction (4.8/5), Escalation Rate.
- 7-day request vs resolution volume chart.
- Vernacular language distribution and category demand breakdowns.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology |
|---|---|
| **Frontend UI** | React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **3D Rendering** | Three.js (Procedural Geometries, ACESFilmic Tone Mapping, Raycasting) |
| **Backend API** | Node.js, Express.js, TypeScript |
| **Database** | SQLite3 (Persistent disk storage at `data/bsai_database.sqlite`) |
| **Voice / Audio** | Web Speech Recognition API & Web Speech Synthesis API |
| **Styling System** | Custom BSAI Palette (Ivory, Deep Indigo, Saffron, Indian Teal) |

---

## 🏃 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Full Stack Development Server (Backend + Frontend)
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

### 3. Run Production Build
```bash
npm run build
```

---

## 🎯 Demonstration / Judge Walkthrough Flow

1. **Open Landing Page**: Interact with the full-screen 3D Bharat landscape. Drag to rotate the scene, zoom in to inspect the central AI robot, and click on **"Government Services"** node to open the service modal.
2. **Launch AI Assistant**: Type or speak a query in English or Hindi (e.g., *"How to check PM-Kisan 19th installment status?"* or *"आयुष्मान कार्ड कैसे बनाएं?"*). Notice the confidence meter, verified portal citations, and recommended follow-up actions.
3. **Create Support Request**: Click **"Create Request"** inside the chat response or from the top navigation to generate an official tracking token (e.g. `BSAI-2026-8492`).
4. **Track Live Stepper**: Go to **"My Requests"** to view the interactive 3-step progress stepper and timeline audit logs.
5. **Human Escalation**: Flag an urgent complaint or click **"Request Human Support"** -> switch to **"Escalations Queue"** to claim and resolve the ticket as a District Nodal Officer.
6. **Browse Knowledge Base**: Search schemes, toggle between English and Hindi, and vote on article helpfulness.
7. **Inspect Analytics**: View real-time query volumes, satisfaction metrics, category distributions, and vernacular language splits.
