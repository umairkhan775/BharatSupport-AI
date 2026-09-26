import React, { useEffect, useRef } from 'react';
import { Sun } from 'lucide-react';

export const CinematicDashboardBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dual Canvas Simulation: Continuous Subtle Rain + Floating Light Dust Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Continuous Subtle Rain Drops (Falling at gentle ~10° angle matching reference)
    const rainCount = 65;
    const raindrops = Array.from({ length: rainCount }, () => ({
      x: Math.random() * (width + 200) - 100,
      y: Math.random() * height,
      len: Math.random() * 26 + 16,
      speed: Math.random() * 5 + 6,
      wind: 1.2,
      alpha: Math.random() * 0.28 + 0.15,
    }));

    // 2. Light Ambient Dust / Bloom Particles
    const particleCount = 24;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.0 + 0.8,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(Math.random() * 0.25 + 0.08),
      color: ['rgba(56,189,248,0.4)', 'rgba(45,212,191,0.35)', 'rgba(251,191,36,0.35)', 'rgba(168,85,247,0.3)'][
        Math.floor(Math.random() * 4)
      ],
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      animId = requestAnimationFrame(render);
      if (document.hidden) return;

      ctx.clearRect(0, 0, width, height);

      // Render Continuous Rain Streaks
      ctx.lineWidth = 1.1;
      for (let i = 0; i < raindrops.length; i++) {
        const r = raindrops[i];
        r.x += r.wind;
        r.y += r.speed;

        if (r.y > height + 20 || r.x > width + 100) {
          r.y = -30;
          r.x = Math.random() * (width + 200) - 100;
        }

        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x + r.wind * (r.len / r.speed), r.y + r.len);
        ctx.strokeStyle = `rgba(215, 240, 255, ${r.alpha})`;
        ctx.stroke();
      }

      // Render Ambient Bloom Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.015;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentRadius = p.r + Math.sin(p.pulse) * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#B2E2F8]">
      {/* ========================================================================= */}
      {/* LAYER 1: Base Sky Canvas with Vibrant Sky Blue to Soft Cyan Gradient      */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#64B5F6] via-[#90CAF9] to-[#E3F2FD]" />

      {/* ========================================================================= */}
      {/* LAYER 2: Radiant Golden Sunlight Rays from Top-Right through Clouds       */}
      {/* ========================================================================= */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[950px] h-[950px] rounded-full blur-[110px] opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 236, 179, 0.85) 0%, rgba(255, 213, 79, 0.45) 35%, rgba(129, 212, 250, 0) 70%)',
        }}
      />

      {/* ========================================================================= */}
      {/* LAYER 3: Cyan & Turquoise Atmospheric Glow - Left Side                    */}
      {/* ========================================================================= */}
      <div
        className="absolute top-[10%] left-[-5%] w-[850px] h-[850px] rounded-full blur-[120px] opacity-40"
        style={{
          background:
            'radial-gradient(circle, rgba(77, 208, 225, 0.65) 0%, rgba(38, 198, 218, 0.3) 50%, rgba(0, 172, 193, 0) 75%)',
          animation: 'cinematicFloatCyan 24s ease-in-out infinite alternate',
        }}
      />

      {/* ========================================================================= */}
      {/* LAYER 4: Realistic Volumetric Clouds Drifting (Multiple Layers)           */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 opacity-80 pointer-events-none">
        {/* Soft Cumulus Cloud Formations matching reference image */}
        <div
          className="absolute top-[0%] left-[5%] w-[750px] h-[320px] rounded-full blur-[65px] bg-white/90"
          style={{ animation: 'cinematicCloudDrift 45s ease-in-out infinite alternate' }}
        />
        <div
          className="absolute top-[5%] right-[5%] w-[700px] h-[280px] rounded-full blur-[60px] bg-white/85"
          style={{ animation: 'cinematicCloudDrift 52s ease-in-out infinite alternate-reverse' }}
        />
        <div
          className="absolute top-[25%] left-[35%] w-[600px] h-[240px] rounded-full blur-[55px] bg-white/75"
          style={{ animation: 'cinematicCloudDrift 38s ease-in-out infinite alternate' }}
        />
        <div
          className="absolute bottom-[10%] left-[10%] w-[800px] h-[300px] rounded-full blur-[70px] bg-white/80"
          style={{ animation: 'cinematicCloudDrift 48s ease-in-out infinite alternate-reverse' }}
        />
      </div>

      {/* ========================================================================= */}
      {/* LAYER 5: Distant Indian Architecture & Monument Silhouettes               */}
      {/* ========================================================================= */}
      <div className="absolute bottom-0 inset-x-0 h-56 opacity-[0.14] pointer-events-none flex items-end justify-between px-8">
        {/* Left Monument Outline (Rashtrapati Bhavan / Domes) */}
        <svg className="w-80 h-44 fill-sky-950" viewBox="0 0 200 100">
          <path d="M10 100 L10 80 Q 20 60, 40 70 Q 60 50, 80 80 Q 90 40, 100 20 Q 110 40, 120 80 Q 140 50, 160 70 Q 180 60, 190 80 L190 100 Z" />
        </svg>

        {/* Center Digital Skyline */}
        <svg className="w-[500px] h-36 fill-sky-950" viewBox="0 0 300 100">
          <rect x="20" y="40" width="20" height="60" rx="3" />
          <rect x="50" y="20" width="28" height="80" rx="4" />
          <rect x="90" y="50" width="24" height="50" rx="3" />
          <rect x="130" y="15" width="40" height="85" rx="5" />
          <rect x="185" y="35" width="30" height="65" rx="4" />
          <rect x="230" y="25" width="25" height="75" rx="3" />
        </svg>

        {/* Right Monument Outline (India Gate & Minarets) */}
        <svg className="w-80 h-48 fill-sky-950" viewBox="0 0 200 100">
          <path d="M20 100 L20 40 L40 40 L40 100 L60 100 L60 30 L90 30 L90 20 L110 20 L110 30 L140 30 L140 100 L160 100 L160 40 L180 40 L180 100 Z" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 6: Bottom-Left Weather Pill matching reference image                */}
      {/* ========================================================================= */}
      <div className="fixed bottom-4 left-6 z-30 pointer-events-auto hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-lg shadow-sky-900/10 text-slate-800">
        <Sun className="w-4 h-4 text-amber-500 animate-[spin_20s_linear_infinite]" />
        <div className="text-left leading-none">
          <div className="text-[11px] font-black text-bsai-indigo">32°C</div>
          <div className="text-[9px] font-semibold text-bsai-indigoMuted">Mostly sunny</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 7: Canvas Continuous Rain & Light Dust Animation Layer              */}
      {/* ========================================================================= */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Dynamic Keyframe Animations */}
      <style>{`
        @keyframes cinematicCloudDrift {
          0% { transform: translateX(0px) scale(1); }
          50% { transform: translateX(40px) scale(1.04); }
          100% { transform: translateX(-30px) scale(0.97); }
        }
        @keyframes cinematicFloatCyan {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(35px, 25px) scale(1.06); }
          100% { transform: translate(-25px, 35px) scale(0.96); }
        }
      `}</style>
    </div>
  );
};

