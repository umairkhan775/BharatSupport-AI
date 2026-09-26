import React from 'react';
import {
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Send,
  BookOpen,
  FileCheck,
  Activity,
  Search,
  MessageSquare
} from 'lucide-react';

interface LiveCitizenSupportFlowProps {
  onNavigateView: (view: string) => void;
  onAskAIQuery?: (query: string) => void;
}

export const LiveCitizenSupportFlow: React.FC<LiveCitizenSupportFlowProps> = ({
  onNavigateView,
  onAskAIQuery,
}) => {
  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden border border-cyan-400/50 shadow-[0_15px_40px_-5px_rgba(14,165,233,0.22)] min-h-[340px] flex flex-col justify-between p-4 sm:p-5 backdrop-blur-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(238, 250, 255, 0.78) 0%, rgba(210, 240, 255, 0.68) 45%, rgba(195, 230, 252, 0.6) 100%)',
        boxShadow: '0 20px 45px -10px rgba(14, 165, 233, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
      }}
    >
      {/* Top Header inside card */}
      <div className="flex items-center justify-between z-20 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 text-white flex items-center justify-center text-xs shadow-md shadow-cyan-500/30 ring-2 ring-white/80">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black tracking-tight font-display text-bsai-indigo">
              Live Citizen Support &amp; Knowledge Flow
            </h3>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 text-[10px] font-black border border-emerald-400/40 flex items-center gap-1 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Center Layout: Left Card + Subtle Minimal AI Centerpiece + Right Stage Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-auto py-2 z-20">
        {/* ========================================================================= */}
        {/* 1. LEFT FLOATING 3D GLASS CARD: "New Request"                             */}
        {/* ========================================================================= */}
        <div className="md:col-span-3 bg-white/90 backdrop-blur-xl rounded-2xl p-3 sm:p-3.5 border border-white/90 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.12)] space-y-2.5 animate-in fade-in slide-in-from-left-4 duration-300 hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/25 shrink-0 ring-2 ring-white">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[11px] font-black text-bsai-indigo">New Request</div>
                <div className="text-[10px] font-bold text-bsai-teal">Government Services</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black flex items-center gap-1 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-bsai-indigoMuted">
            <span className="font-semibold text-bsai-indigo truncate">Citizen: Raju Sharma</span>
            <span className="flex items-center gap-1 font-mono shrink-0 text-bsai-indigoMuted">
              2 min ago
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CENTER: Subtle Futuristic AI Processing Core matching reference image  */}
        {/* ========================================================================= */}
        <div className="md:col-span-6 flex flex-col items-center justify-center py-2 relative min-h-[170px]">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full bg-cyan-400/20 blur-2xl animate-pulse" />
          </div>

          {/* Minimal Concentric Soft-Glow Rings matching reference */}
          <div className="relative flex items-center justify-center w-40 h-40">
            {/* Outer Glowing Cyan Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-[spin_50s_linear_infinite]" />
            
            {/* Middle Subtle Ring */}
            <div className="absolute inset-2.5 rounded-full border border-dashed border-cyan-300/60" />

            {/* Inner Glowing Ring */}
            <div className="absolute inset-5 rounded-full border border-cyan-200/80 shadow-[inset_0_0_12px_rgba(56,189,248,0.3)]" />

            {/* Minimal Floating Micro-Dots */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,1)] animate-pulse" />
            <div className="absolute bottom-1 right-6 w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_6px_rgba(110,231,183,1)] animate-ping" />
            <div className="absolute top-10 -left-1 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,1)] opacity-80" />

            {/* Central Dark Blue / Cyan Core Disc matching reference */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#0284c7] border-2 border-cyan-300 flex flex-col items-center justify-center text-center shadow-[0_0_25px_rgba(14,165,233,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)] p-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-400/30 border border-cyan-200/60 flex items-center justify-center text-cyan-200 mb-1 shadow-inner">
                <BookOpen className="w-3.5 h-3.5 text-cyan-100 animate-pulse" />
              </div>
              <div className="text-[10px] font-black tracking-wider text-white font-display leading-tight drop-shadow-sm">
                BSAI AI CORE
              </div>
              <div className="text-[8px] font-medium text-cyan-100/90 flex items-center gap-1 mt-0.5">
                <span className="w-1 h-1 rounded-full bg-emerald-300 animate-pulse" />
                Live Processing
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. RIGHT FLOATING 3D GLASS CARD: "Current Stage"                          */}
        {/* ========================================================================= */}
        <div className="md:col-span-3 bg-white/90 backdrop-blur-xl rounded-2xl p-3 sm:p-3.5 border border-white/90 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.12)] space-y-2 animate-in fade-in slide-in-from-right-4 duration-300 hover:-translate-y-1 transition-transform">
          <div className="text-[11px] font-black text-bsai-indigo">Current Stage</div>

          <div className="space-y-1.5 relative pl-1">
            {/* Vertical connecting line */}
            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-200" />

            {/* Stage 1: Understanding (Active 🟢) */}
            <div className="flex items-center gap-2 relative z-10">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-black shadow-xs">
                ✓
              </span>
              <span className="text-[11px] font-bold text-emerald-950">Understanding</span>
            </div>

            {/* Stage 2: Knowledge Search (In Progress 🔵) */}
            <div className="flex items-center gap-2 relative z-10">
              <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-black animate-pulse shadow-xs shadow-blue-500/50">
                ✓
              </span>
              <span className="text-[11px] font-bold text-blue-950">Knowledge Search</span>
            </div>

            {/* Stage 3: Generating Response (Pending ⚪) */}
            <div className="flex items-center gap-2 relative z-10">
              <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-[7px] font-black">
                ○
              </span>
              <span className="text-[11px] font-medium text-gray-400">Generating Response</span>
            </div>

            {/* Stage 4: Finalizing (Pending ⚪) */}
            <div className="flex items-center gap-2 relative z-10">
              <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-[7px] font-black">
                ○
              </span>
              <span className="text-[11px] font-medium text-gray-400">Finalizing</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM HORIZONTAL PROCESSING TRACK WITH 5 NODES (Matching Reference)    */}
      {/* ========================================================================= */}
      <div className="w-full pt-3 border-t border-cyan-400/30 flex items-center justify-between text-[10px] sm:text-[11px] font-black z-20">
        {/* Node 1: Request (Green Node) */}
        <div className="flex items-center gap-1.5 text-emerald-900 cursor-pointer hover:scale-105 transition-transform">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 border border-emerald-300 text-white flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.5)] ring-2 ring-white">
            <Send className="w-3.5 h-3.5 text-white" />
          </div>
          <span>Request</span>
        </div>

        {/* Laser Line 1 */}
        <div className="flex-1 mx-2 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-85 shadow-[0_0_6px_rgba(56,189,248,0.6)]" />

        {/* Node 2: AI Understanding (Blue Node) */}
        <div className="flex items-center gap-1.5 text-blue-900 cursor-pointer hover:scale-105 transition-transform">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 border border-cyan-300 text-white flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.5)] ring-2 ring-white">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="hidden sm:inline">AI Understanding</span>
          <span className="sm:hidden">AI</span>
        </div>

        {/* Laser Line 2 */}
        <div className="flex-1 mx-2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 opacity-85 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />

        {/* Node 3: Knowledge Search (Purple Node - Highlighted in Reference) */}
        <div className="flex items-center gap-1.5 text-purple-900 cursor-pointer hover:scale-105 transition-transform">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-400 border-2 border-purple-300 text-white flex items-center justify-center shadow-[0_0_14px_rgba(168,85,247,0.7)] ring-2 ring-white animate-pulse">
            <Search className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="hidden sm:inline">Knowledge Search</span>
          <span className="sm:hidden">Search</span>
        </div>

        {/* Laser Line 3 */}
        <div className="flex-1 mx-2 h-0.5 bg-gradient-to-r from-purple-400 to-amber-400 opacity-85 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />

        {/* Node 4: Response (Orange Node) */}
        <div className="flex items-center gap-1.5 text-amber-900 cursor-pointer hover:scale-105 transition-transform">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 border border-amber-300 text-white flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.5)] ring-2 ring-white">
            <MessageSquare className="w-3.5 h-3.5 text-white" />
          </div>
          <span>Response</span>
        </div>

        {/* Laser Line 4 */}
        <div className="flex-1 mx-2 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 opacity-85 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />

        {/* Node 5: Resolved (Emerald Node) */}
        <div className="flex items-center gap-1.5 text-emerald-900 cursor-pointer hover:scale-105 transition-transform">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-300 border border-emerald-200 text-white flex items-center justify-center shadow-[0_0_14px_rgba(16,185,129,0.7)] ring-2 ring-white">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <span>Resolved</span>
        </div>
      </div>
    </div>
  );
};



