import React from 'react';
import { Sparkles, Bot, ShieldCheck, Globe } from 'lucide-react';

export const FallbackCanvas: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gradient-to-b from-bsai-pearl via-white to-bsai-pearl p-6">
      <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-bsai-border shadow-bsai-lg">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-bsai-saffronBg border border-bsai-saffron flex items-center justify-center mb-4 text-bsai-saffron">
          <Bot className="w-10 h-10 animate-bounce" />
        </div>
        <h3 className="text-2xl font-bold font-display text-bsai-indigo mb-2">
          Bharat Support AI Core
        </h3>
        <p className="text-sm text-bsai-indigoMuted mb-6">
          High-performance AI engine active. Intelligent Multilingual Citizen Support ready across Bharat.
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-bsai-indigo">
          <div className="bg-bsai-pearl p-3 rounded-2xl flex items-center gap-2 border border-bsai-border">
            <ShieldCheck className="w-4 h-4 text-bsai-teal" />
            <span>24/7 Redressal</span>
          </div>
          <div className="bg-bsai-pearl p-3 rounded-2xl flex items-center gap-2 border border-bsai-border">
            <Globe className="w-4 h-4 text-bsai-saffron" />
            <span>22 Languages</span>
          </div>
        </div>
      </div>
    </div>
  );
};
