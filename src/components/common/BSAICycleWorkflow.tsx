import React, { useState } from 'react';
import {
  Database,
  Brain,
  BookOpen,
  AlertTriangle,
  LineChart,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot,
  GraduationCap,
  Volume2,
  CheckCircle2,
  FileText,
  Zap,
  Radio,
  ArrowDown,
  RefreshCw,
  Clock
} from 'lucide-react';
import { BSAIButton } from './BSAIButton';

export interface WorkflowStage {
  id: string;
  step: number;
  title: string;
  titleHi: string;
  shortDesc: string;
  icon: React.ElementType;
  color: string;
  colorHex: string;
  accentHex: string;
  targetView: string;
  details: string[];
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 'stage-1',
    step: 1,
    title: 'DATA COLLECTION',
    titleHi: 'डेटा एकत्रीकरण',
    shortDesc: 'Citizen inputs & requests',
    icon: Database,
    color: 'emerald',
    colorHex: '#087F6A',
    accentHex: '#F2A900',
    targetView: 'ai-assistant',
    details: ['22+ Official Indian Languages', 'Voice Speech-to-Text Input', 'Portal & Document Ingestion']
  },
  {
    id: 'stage-2',
    step: 2,
    title: 'AI UNDERSTANDING',
    titleHi: 'एआई समझ व विश्लेषण',
    shortDesc: 'Semantic NLP & intent analysis',
    icon: Brain,
    color: 'teal',
    colorHex: '#159A9C',
    accentHex: '#16C7C9',
    targetView: 'knowledge-base',
    details: ['Citizen Intent Detection', 'Scheme Entity Extraction', 'Urgency Confidence Scoring']
  },
  {
    id: 'stage-3',
    step: 3,
    title: 'KNOWLEDGE & REASONING',
    titleHi: 'ज्ञान व अध्ययन आधार',
    shortDesc: 'Verified welfare & study base',
    icon: BookOpen,
    color: 'emerald',
    colorHex: '#087F6A',
    accentHex: '#8DE0C3',
    targetView: 'knowledge-base',
    details: ['National Scholarships (NSP)', 'PMKVY 4.0 & Ayushman Guides', 'Zero Hallucination Retrieval']
  },
  {
    id: 'stage-4',
    step: 4,
    title: 'ACTION & ESCALATION',
    titleHi: 'कार्रवाई व मानव हस्तांतरण',
    shortDesc: 'Auto-resolution & nodal handoff',
    icon: AlertTriangle,
    color: 'coral',
    colorHex: '#E9785A', // Warm Coral
    accentHex: '#F4A340',
    targetView: 'escalations',
    details: ['Instant Verified Solutions', 'CPGRAMS Auto Handoff', 'District Officer Routing']
  },
  {
    id: 'stage-5',
    step: 5,
    title: 'DASHBOARD & INSIGHTS',
    titleHi: 'डैशबोर्ड व लाइव इनसाइट्स',
    shortDesc: 'Continuous telemetry & feedback',
    icon: LineChart,
    color: 'blue',
    colorHex: '#6C8FE8',
    accentHex: '#159A9C',
    targetView: 'analytics',
    details: ['98.4% Resolution Telemetry', '1.2s Average Latency', 'Continuous Model Feedback']
  }
];

interface BSAICycleWorkflowProps {
  onNavigateView: (view: string) => void;
  onSelectStage?: (stage: WorkflowStage) => void;
  onAskAIQuery?: (query: string) => void;
}

export const BSAICycleWorkflow: React.FC<BSAICycleWorkflowProps> = ({
  onNavigateView,
  onSelectStage,
  onAskAIQuery,
}) => {
  const [activeStageId, setActiveStageId] = useState<string>('stage-1');
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null);

  const activeStage = WORKFLOW_STAGES.find((s) => s.id === (hoveredStageId || activeStageId)) || WORKFLOW_STAGES[0];

  // Node Cartesian Coordinates (Circle R=225px, Center at x=340, y=340)
  const nodePositions = [
    { x: 340, y: 105 }, // 01. Data Collection (Top)
    { x: 545, y: 255 }, // 02. AI Understanding (Top Right)
    { x: 465, y: 510 }, // 03. Knowledge & Reasoning (Bottom Right)
    { x: 215, y: 510 }, // 04. Action & Escalation (Bottom Left)
    { x: 135, y: 255 }, // 05. Dashboard & Insights (Top Left)
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none py-2">
      {/* 2D / 2.5D Workflow Stage Diagram Canvas */}
      <div className="relative w-[340px] xs:w-[420px] sm:w-[600px] md:w-[680px] h-[520px] sm:h-[620px] md:h-[660px] flex items-center justify-center">
        {/* Ambient Radial Lighting Behind Cycle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[320px] sm:w-[440px] h-[320px] sm:h-[440px] rounded-full bg-gradient-to-tr from-emerald-200/40 via-teal-100/30 to-rose-100/25 blur-3xl" />
        </div>

        {/* SVG Orbital Track & Animated Data Streams */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 680 680"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#087F6A" stopOpacity="0.8" />
              <stop offset="25%" stopColor="#159A9C" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#087F6A" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#E9785A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6C8FE8" stopOpacity="0.8" />
            </linearGradient>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Ambient Dashed Ring */}
          <circle
            cx="340"
            cy="340"
            r="238"
            stroke="#087F6A"
            strokeWidth="1.5"
            strokeOpacity="0.15"
            strokeDasharray="6 8"
          />

          {/* Main Continuous Orbit Track Ring */}
          <circle
            cx="340"
            cy="340"
            r="215"
            stroke="url(#orbitGrad)"
            strokeWidth="2.5"
            strokeOpacity="0.45"
          />

          {/* Glowing Animated Pulse Track */}
          <circle
            cx="340"
            cy="340"
            r="215"
            stroke="url(#orbitGrad)"
            strokeWidth="3.5"
            strokeDasharray="90 280"
            filter="url(#glowEffect)"
            className="animate-spin"
            style={{ animationDuration: '14s', transformOrigin: '340px 340px' }}
          />

          {/* Secondary Counter-Flow Data Stream */}
          <circle
            cx="340"
            cy="340"
            r="215"
            stroke="#8DE0C3"
            strokeWidth="2"
            strokeDasharray="40 320"
            className="animate-spin"
            style={{ animationDuration: '9s', transformOrigin: '340px 340px' }}
          />

          {/* Radial Rays connecting Center Core to Nodes */}
          {nodePositions.map((pos, idx) => (
            <line
              key={idx}
              x1="340"
              y1="340"
              x2={pos.x}
              y2={pos.y}
              stroke="#087F6A"
              strokeWidth="1.2"
              strokeOpacity="0.2"
              strokeDasharray="3 4"
            />
          ))}

          {/* Traveling Data Flow Particles (Simulating Citizen Ingestion Loop) */}
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <circle
              key={i}
              r="4.5"
              fill={i === 3 ? '#E9785A' : '#087F6A'}
              filter="url(#glowEffect)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`${deg} 340 340`}
                to={`${deg + 360} 340 340`}
                dur="12s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cx"
                values="340"
                dur="12s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="125"
                dur="12s"
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>

        {/* ===================================================================== */}
        {/* CENTER: Simple, Premium BSAI AI CORE Emblem                           */}
        {/* ===================================================================== */}
        <div
          onClick={() => onNavigateView('ai-assistant')}
          className="absolute z-20 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white/95 backdrop-blur-md border border-emerald-200 shadow-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:scale-105 hover:border-bsai-emerald transition-all duration-200 group"
        >
          {/* Subtle Ambient Ring Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400/20 via-teal-400/10 to-amber-400/15 animate-pulse" />

          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr from-bsai-emerald to-bsai-teal text-white flex items-center justify-center shadow-md shadow-emerald-700/20 mb-1.5 group-hover:scale-110 transition-transform">
            <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <span className="text-xs sm:text-sm font-black font-display tracking-tight text-bsai-indigo">
            BSAI
          </span>
          <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
            AI Core
          </span>
          <span className="text-[8px] sm:text-[9px] text-bsai-indigoMuted font-medium mt-0.5">
            Bharat Support AI
          </span>
        </div>

        {/* ===================================================================== */}
        {/* 5 COMPACT 2D/2.5D WORKFLOW NODES                                      */}
        {/* ===================================================================== */}
        {WORKFLOW_STAGES.map((stage, idx) => {
          const pos = nodePositions[idx];
          const isHovered = hoveredStageId === stage.id;
          const isActive = activeStageId === stage.id;
          const Icon = stage.icon;

          // Responsive scaled positions
          const leftPercent = (pos.x / 680) * 100;
          const topPercent = (pos.y / 680) * 100;

          return (
            <div
              key={stage.id}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredStageId(stage.id)}
              onMouseLeave={() => setHoveredStageId(null)}
              onClick={() => {
                setActiveStageId(stage.id);
                if (onSelectStage) onSelectStage(stage);
                onNavigateView(stage.targetView);
              }}
              className={`absolute z-30 w-44 sm:w-52 p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isActive || isHovered
                  ? 'bg-white border-bsai-emerald shadow-lg -translate-y-1 scale-105 ring-2 ring-emerald-400/30'
                  : 'bg-white/90 backdrop-blur-sm border-emerald-200/80 shadow-xs hover:bg-white hover:border-bsai-teal'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-white shadow-2xs shrink-0"
                    style={{ backgroundColor: stage.colorHex }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded-md text-white shadow-2xs font-mono"
                    style={{ backgroundColor: stage.colorHex }}
                  >
                    0{stage.step}
                  </span>
                </div>

                <span className="text-[10px] text-bsai-indigoMuted font-mono">
                  {stage.titleHi}
                </span>
              </div>

              <div className="text-xs font-black text-bsai-indigo leading-tight truncate">
                {stage.title}
              </div>
              <div className="text-[10px] text-bsai-indigoLight truncate mt-0.5">
                {stage.shortDesc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Stage Quick Information Banner */}
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 mt-1 animate-in fade-in duration-150">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
            style={{ backgroundColor: activeStage.colorHex }}
          >
            <activeStage.icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-bsai-indigo truncate">
              0{activeStage.step}. {activeStage.title} <span className="text-bsai-teal font-normal">({activeStage.shortDesc})</span>
            </div>
            <div className="text-[11px] text-bsai-indigoMuted flex items-center gap-2 flex-wrap">
              {activeStage.details.map((d, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="text-emerald-600">✓</span>
                  <span>{d}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <BSAIButton
          variant={activeStage.step === 4 ? 'escalate' : 'primary'}
          size="sm"
          onClick={() => onNavigateView(activeStage.targetView)}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
          iconPosition="right"
          className="shrink-0 text-xs"
        >
          Open {activeStage.title}
        </BSAIButton>
      </div>
    </div>
  );
};
