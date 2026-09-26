import React from 'react';
import { X, Bot, ArrowRight, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import { SupportCategory } from '../../types';
import { ServiceNodeData } from '../3d/Bharat3DHero';
import { BSAIButton } from './BSAIButton';

interface ServiceNodeModalProps {
  node: ServiceNodeData | null;
  onClose: () => void;
  onAskAI: (question: string, category: SupportCategory) => void;
  onCreateTicket: (category: SupportCategory) => void;
}

export const ServiceNodeModal: React.FC<ServiceNodeModalProps> = ({
  node,
  onClose,
  onAskAI,
  onCreateTicket,
}) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bsai-indigoDark/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-bsai-border shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-bsai-pearl text-bsai-indigoMuted hover:text-bsai-indigo hover:bg-bsai-border transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Node Header */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs border"
            style={{ backgroundColor: `${node.color}15`, borderColor: `${node.color}40` }}
          >
            {node.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-bsai-indigoMuted">
                3D Service Hub
              </span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: node.color }}
              />
            </div>
            <h3 className="text-xl font-bold font-display text-bsai-indigo">
              {node.name}
            </h3>
            <p className="text-xs font-semibold text-bsai-teal font-display">
              {node.nameHi}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-bsai-pearl/80 p-4 rounded-2xl border border-bsai-border/80 mb-5 text-xs sm:text-sm text-bsai-indigoLight leading-relaxed space-y-2">
          <p>{node.description}</p>
          <p className="text-bsai-indigo font-medium text-xs border-t border-bsai-border pt-2">
            {node.descriptionHi}
          </p>
        </div>

        {/* Sample Citizen Queries */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-bsai-indigo mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-bsai-saffron" />
            <span>Frequent Citizen Inquiries (Click to Ask AI):</span>
          </div>

          <div className="space-y-1.5">
            {node.sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onAskAI(q, node.category);
                  onClose();
                }}
                className="w-full text-left bg-white hover:bg-bsai-pearl border border-bsai-border hover:border-bsai-teal p-2.5 rounded-xl text-xs font-semibold text-bsai-indigo flex items-center justify-between group transition-all"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-bsai-teal" />
                  <span>{q}</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-bsai-indigoMuted group-hover:text-bsai-teal group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-bsai-border">
          <BSAIButton
            variant="primary"
            size="md"
            onClick={() => {
              onAskAI(`Tell me everything BSAI can do for ${node.name}`, node.category);
              onClose();
            }}
            icon={<Bot className="w-4 h-4" />}
            iconPosition="left"
          >
            Ask BSAI Chat
          </BSAIButton>

          <BSAIButton
            variant="secondary"
            size="md"
            onClick={() => {
              onCreateTicket(node.category);
              onClose();
            }}
            icon={<CheckCircle2 className="w-4 h-4 text-bsai-teal" />}
            iconPosition="left"
          >
            Create Request
          </BSAIButton>
        </div>
      </div>
    </div>
  );
};
