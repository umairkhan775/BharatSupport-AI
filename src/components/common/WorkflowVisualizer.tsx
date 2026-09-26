import React, { useState } from 'react';
import { Database, Brain, BookOpen, AlertOctagon, LineChart, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';
import { BSAIButton } from './BSAIButton';

export const WORKFLOW_STAGES = [
  {
    step: 1,
    title: 'Data Collection',
    titleHi: 'डेटा एकत्रीकरण',
    subtitle: 'Multilingual Ingestion',
    icon: Database,
    color: 'saffron',
    colorHex: '#F2A900',
    description: 'Captures inquiries across voice, text, regional Indian dialects, and portal integrations 24/7.',
    features: ['Speech-to-Text in 22 Languages', 'Regional Dialect Tolerance', 'Multi-channel Ingestion']
  },
  {
    step: 2,
    title: 'AI Understanding',
    titleHi: 'एआई समझ एवं विश्लेषण',
    subtitle: 'Semantic NLP Core',
    icon: Brain,
    color: 'teal',
    colorHex: '#159A9C',
    description: 'Analyzes user intent, extracts scheme entities, detects urgency, and calculates confidence score.',
    features: ['Intent Classification', 'Confidence Scoring', 'Entity Extraction']
  },
  {
    step: 3,
    title: 'Knowledge Retrieval',
    titleHi: 'ज्ञान पुनर्प्राप्ति',
    subtitle: 'Verified Bharat Graph',
    icon: BookOpen,
    color: 'indigo',
    colorHex: '#202A5A',
    description: 'Searches verified government schemes, DigiLocker docs, and eligibility checklists in real-time.',
    features: ['Bilingual Scheme Index', 'Direct Portal Citations', 'Document Checklist Generation']
  },
  {
    step: 4,
    title: 'Action & Escalation',
    titleHi: 'कार्यवाही एवं एस्केलेशन',
    subtitle: 'Automated + Human Desk',
    icon: AlertOctagon,
    color: 'rose',
    colorHex: '#D9534F',
    description: 'Instant resolution for standard inquiries, or automated ticket generation to Human Nodal Desks.',
    features: ['One-Click Human Transfer', 'Service Request Generation', 'Live Status Tracking']
  },
  {
    step: 5,
    title: 'Dashboard & Insights',
    titleHi: 'डैशबोर्ड एवं अंतर्दृष्टि',
    subtitle: 'Continuous Intelligence',
    icon: LineChart,
    color: 'teal',
    colorHex: '#159A9C',
    description: 'Aggregates resolution rates, citizen satisfaction metrics, and regional scheme demand analytics.',
    features: ['Real-time KPI Tracking', 'Citizen Feedback Loop', 'Regional Language Heatmaps']
  }
];

export const WorkflowVisualizer: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(2);

  const activeStage = WORKFLOW_STAGES.find(s => s.step === selectedStep) || WORKFLOW_STAGES[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bsai-border shadow-bsai">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-bsai-tealBg px-3 py-1 rounded-full text-xs font-bold text-bsai-teal border border-bsai-teal/20 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-bsai-teal" />
            <span>End-to-End Solution Architecture</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-bsai-indigo">
            The Bharat Support AI Workflow
          </h2>
          <p className="text-xs sm:text-sm text-bsai-indigoMuted">
            From citizen voice query to verified resolution and administrative intelligence
          </p>
        </div>

        <div className="text-xs font-semibold text-bsai-indigoMuted bg-bsai-pearl px-3.5 py-1.5 rounded-xl border border-bsai-border">
          Interactive Architecture Flow
        </div>
      </div>

      {/* 5-Stage Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-6">
        {WORKFLOW_STAGES.map((stage) => {
          const Icon = stage.icon;
          const isSelected = selectedStep === stage.step;

          return (
            <button
              key={stage.step}
              onClick={() => setSelectedStep(stage.step)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-bsai-pearl border-bsai-teal shadow-md scale-105 z-10'
                  : 'bg-white border-bsai-border hover:bg-bsai-pearl/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: stage.colorHex }}
                >
                  {stage.step}
                </span>
                <Icon className="w-4 h-4 text-bsai-indigoMuted" />
              </div>
              <div className="font-bold text-xs text-bsai-indigo leading-tight truncate">
                {stage.title}
              </div>
              <div className="text-[10px] text-bsai-indigoMuted truncate">
                {stage.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detail Panel */}
      <div className="bg-gradient-to-br from-bsai-pearl via-white to-bsai-pearl p-6 rounded-2xl border border-bsai-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-2xl text-white shadow-sm"
              style={{ backgroundColor: activeStage.colorHex }}
            >
              <activeStage.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-bsai-indigoMuted">
                Stage 0{activeStage.step} of 05
              </div>
              <h3 className="text-lg font-bold text-bsai-indigo font-display">
                {activeStage.title} <span className="text-sm font-normal text-bsai-teal">({activeStage.titleHi})</span>
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-bsai-indigoLight leading-relaxed">
            {activeStage.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {activeStage.features.map((feat, i) => (
              <span
                key={i}
                className="bg-white px-2.5 py-1 rounded-xl text-xs font-semibold text-bsai-indigo border border-bsai-border shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5 text-bsai-teal" />
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-end">
          <BSAIButton
            variant="primary"
            size="md"
            onClick={() => setSelectedStep((prev) => (prev % 5) + 1)}
            icon={<ChevronRight className="w-4 h-4 text-bsai-saffron" />}
            iconPosition="right"
          >
            Next Stage
          </BSAIButton>
        </div>
      </div>
    </div>
  );
};
