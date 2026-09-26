# Bharat Support AI (BSAI) - Deployment & Showcase Guide

## 1. Deploy Frontend on Vercel
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your **BSAi Dashboard** repository.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.

---

## 2. Deploy Backend API on Render
1. Go to [render.com](https://render.com) and click **"New Web Service"**.
2. Connect your GitHub repository.
3. Settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
   - **Environment Variables**:
     - `PORT`: `5000`
     - `GEMINI_API_KEY`: *(Your Google AI Studio API Key)*
4. Click **Create Web Service**.

---

## 3. Key Showcase Highlights for Evaluation / Presentation
1. **Dual-Sided Public Governance Architecture**:
   - **Citizen Mode** (*Umair Khan / Rahul Sharma / Priya Verma*): Multilingual AI Assistant across 8 Indian languages, intelligent ticket submission with AI-assigned priority assessment, and live timeline tracking.
   - **Nodal Officer & Support Admin Mode** (*Amit Patel - Nodal Officer / Dr. Rajesh Mehra - Admin*): Command Center analytics, SLA tracking, Escalations Desk for direct citizen grievance triage, and Knowledge Base management.
2. **AI Triage & Priority Integrity**:
   - Citizens cannot arbitrarily assign "High Priority" or "Urgent" tickets; priority is determined by BSAI's triage rules (with verified emergency justification required).
   - Nodal Officers hold full override and SLA resolution capability.
3. **Pristine Multi-Model AI Engine**:
   - Full support for Google Gemini with automatic response sanitization, structured Markdown guidance, and zero prompt/scratchpad leakage.
