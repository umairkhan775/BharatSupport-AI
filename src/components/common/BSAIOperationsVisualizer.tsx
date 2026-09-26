import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Sparkles,
  Zap,
  TrendingUp,
  Inbox,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  Globe2,
  ArrowRight
} from 'lucide-react';
import { AnalyticsSummary } from '../../types';

interface BSAIOperationsVisualizerProps {
  analytics: AnalyticsSummary | null;
  onNavigateView: (view: string) => void;
  onSelectPrompt?: (prompt: string, category: string) => void;
}

export const BSAIOperationsVisualizer: React.FC<BSAIOperationsVisualizerProps> = ({
  analytics,
  onNavigateView,
  onSelectPrompt,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Synaptic Network Nodes
  const nodes = [
    { id: 'gov', label: 'Government DBT', labelHi: 'डीबीटी व योजनाएं', x: 0.18, y: 0.28, color: '#087F6A', query: 'Tell me about PM-Kisan and DBT schemes' },
    { id: 'edu', label: 'NSP Scholarships', labelHi: 'छात्रवृत्ति व शिक्षा', x: 0.82, y: 0.26, color: '#087F6A', query: 'How to apply for National Scholarship Portal (NSP)?' },
    { id: 'health', label: 'Ayushman Health', labelHi: 'आयुष्मान भारत', x: 0.86, y: 0.72, color: '#159A9C', query: 'How to download Ayushman Golden Card for 5 Lakh cashless health?' },
    { id: 'docs', label: 'DigiLocker & Aadhaar', labelHi: 'दस्तावेज व आधार', x: 0.14, y: 0.74, color: '#6C8FE8', query: 'How to update Aadhaar address online?' },
    { id: 'lang', label: '22+ Multilingual Core', labelHi: 'बहुभाषी एआई', x: 0.5, y: 0.15, color: '#F2A900', query: 'Speak in Hindi or regional Indian language' },
    { id: 'escalate', label: 'District Nodal Desk', labelHi: 'मानव सहायता', x: 0.5, y: 0.85, color: '#E9785A', query: 'Escalate to human officer' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener('resize', handleResize);

    // Mouse Tracking for Gravitational Synaptic Interaction
    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Floating Data Particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: ['rgba(8, 127, 106, 0.45)', 'rgba(21, 154, 156, 0.45)', 'rgba(108, 143, 232, 0.4)', 'rgba(233, 120, 90, 0.4)'][Math.floor(Math.random() * 4)],
    }));

    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (document.hidden) return;

      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw Subtle Digital Waves at the Base
      ctx.beginPath();
      ctx.moveTo(0, height - 20);
      for (let x = 0; x < width; x += 10) {
        const y = height - 35 + Math.sin(x * 0.015 + time) * 8 + Math.cos(x * 0.008 - time * 0.8) * 6;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fillStyle = 'rgba(8, 127, 106, 0.035)';
      ctx.fill();

      // 2. Draw Synaptic Connecting Rays between Central Core and Outer Nodes
      nodes.forEach((node) => {
        const nodeX = node.x * width;
        const nodeY = node.y * height;

        // Wave curvature
        const midX = (centerX + nodeX) / 2 + Math.sin(time + node.x * 10) * 8;
        const midY = (centerY + nodeY) / 2 + Math.cos(time + node.y * 10) * 8;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.quadraticCurveTo(midX, midY, nodeX, nodeY);
        ctx.strokeStyle = node.color === '#E9785A' ? 'rgba(233, 120, 90, 0.25)' : 'rgba(8, 127, 106, 0.22)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Data Pulse traveling along the ray
        const pulseProgress = (time * 0.6 + node.x * 3) % 1;
        const px = (1 - pulseProgress) * (1 - pulseProgress) * centerX + 2 * (1 - pulseProgress) * pulseProgress * midX + pulseProgress * pulseProgress * nodeX;
        const py = (1 - pulseProgress) * (1 - pulseProgress) * centerY + 2 * (1 - pulseProgress) * pulseProgress * midY + pulseProgress * pulseProgress * nodeY;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Outer Synaptic Node
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 6, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 12 + Math.sin(time * 2 + node.x * 5) * 2, 0, Math.PI * 2);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 3. Update & Draw Ambient Floating Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Mouse Gravitation
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x += (dx / dist) * 0.8;
          p.y += (dy / dist) * 0.8;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-200/80 shadow-md overflow-hidden transition-all">
      {/* Background Animated Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" />

      {/* ========================================================================= */}
      {/* CENTER: Glowing BSAI Intelligence Core Emblem                             */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          onClick={() => onNavigateView('ai-assistant')}
          className="pointer-events-auto w-40 h-40 rounded-full bg-white/95 backdrop-blur-md border border-emerald-200 shadow-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:scale-105 hover:border-bsai-emerald transition-all duration-200 group z-10"
        >
          {/* Subtle Ambient Pulse Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400/25 via-teal-400/15 to-amber-400/20 animate-pulse" />

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-bsai-emerald to-bsai-teal text-white flex items-center justify-center shadow-md shadow-emerald-700/20 mb-1.5 group-hover:scale-110 transition-transform">
            <Bot className="w-6 h-6" />
          </div>

          <span className="text-sm font-black font-display tracking-tight text-bsai-indigo">
            BSAI Core
          </span>
          <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
            Live Intelligence
          </span>
          <span className="text-[9px] text-bsai-indigoMuted font-mono mt-0.5">
            {analytics?.totalQueries?.toLocaleString() || '1,248'} Active Sessions
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 FLOATING COMPACT OPERATIONAL METRICS (Corners of Operations Space)      */}
      {/* ========================================================================= */}
      {/* Top-Left: Active Inquiries */}
      <div
        onClick={() => onNavigateView('support-requests')}
        className="absolute top-5 left-5 hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-200/80 shadow-sm hover:shadow-md hover:border-bsai-emerald transition-all cursor-pointer group z-10"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-bsai-emerald to-bsai-teal text-white flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
          <Inbox className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-bsai-indigoMuted">Active Requests</div>
          <div className="text-sm font-black font-display text-bsai-indigo">
            {analytics?.totalQueries?.toLocaleString() || '8,532'}
          </div>
          <div className="text-[9px] font-bold text-emerald-700 flex items-center gap-0.5">
            <TrendingUp className="w-2.5 h-2.5" />
            <span>+14.2% live traffic</span>
          </div>
        </div>
      </div>

      {/* Top-Right: AI Auto Resolution */}
      <div
        onClick={() => onNavigateView('analytics')}
        className="absolute top-5 right-5 hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-teal-200/80 shadow-sm hover:shadow-md hover:border-bsai-teal transition-all cursor-pointer group z-10"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-bsai-teal to-teal-700 text-white flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-bsai-indigoMuted">AI Resolution</div>
          <div className="text-sm font-black font-display text-emerald-800">
            98.4%
          </div>
          <div className="text-[9px] font-bold text-teal-700">
            Verified Zero Hallucination
          </div>
        </div>
      </div>

      {/* Bottom-Left: Human Escalations */}
      <div
        onClick={() => onNavigateView('escalations')}
        className="absolute bottom-5 left-5 hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-200/80 shadow-sm hover:shadow-md hover:border-bsai-coral transition-all cursor-pointer group z-10"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-bsai-coral to-rose-600 text-white flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-bsai-indigoMuted">Human Escalations</div>
          <div className="text-sm font-black font-display text-rose-700">
            {analytics?.escalatedQueries || '688'}
          </div>
          <div className="text-[9px] font-bold text-rose-700">
            District Nodal Desk
          </div>
        </div>
      </div>

      {/* Bottom-Right: Response Latency & Multilingual */}
      <div
        onClick={() => onNavigateView('analytics')}
        className="absolute bottom-5 right-5 hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-blue-200/80 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group z-10"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-bsai-indigoMuted">Avg Response</div>
          <div className="text-sm font-black font-display text-blue-700">
            1.2s
          </div>
          <div className="text-[9px] font-bold text-blue-700">
            22+ Indian Languages
          </div>
        </div>
      </div>

      {/* Synaptic Interactive Nodes Overlay (Clickable) */}
      <div className="relative w-full h-[420px] pointer-events-none">
        {nodes.map((n) => (
          <div
            key={n.id}
            style={{
              left: `${n.x * 100}%`,
              top: `${n.y * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => {
              if (onSelectPrompt) onSelectPrompt(n.query, n.label);
              else onNavigateView('ai-assistant');
            }}
            className="absolute pointer-events-auto p-1.5 px-2.5 rounded-xl bg-white/90 hover:bg-white border border-emerald-200/90 shadow-xs hover:shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 group z-10"
          >
            <span
              className="w-2 h-2 rounded-full shadow-2xs"
              style={{ backgroundColor: n.color }}
            />
            <span className="text-[11px] font-bold text-bsai-indigo group-hover:text-bsai-teal transition-colors">
              {n.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
