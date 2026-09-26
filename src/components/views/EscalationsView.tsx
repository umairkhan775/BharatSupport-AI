import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { EscalationItem, SupportedLanguage } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  ShieldAlert,
  Send
} from 'lucide-react';
import { BSAIButton } from '../common/BSAIButton';

interface EscalationsViewProps {
  currentLanguage: SupportedLanguage;
  onSelectTicket?: (ticketId: string) => void;
}

export const EscalationsView: React.FC<EscalationsViewProps> = ({
  currentLanguage,
  onSelectTicket,
}) => {
  const [escalations, setEscalations] = useState<EscalationItem[]>([]);
  const [selectedEscalation, setSelectedEscalation] = useState<EscalationItem | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [agentName, setAgentName] = useState('Priya Sharma (Nodal)');

  const fetchEscalations = async () => {
    try {
      const data = await api.getEscalations();
      setEscalations(data);
      if (data.length > 0 && !selectedEscalation) {
        setSelectedEscalation(data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEscalations();
  }, []);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEscalation) return;

    try {
      await api.updateEscalation(selectedEscalation.id, {
        status: 'Resolved',
        assignedAgent: agentName,
        resolutionNote: resolutionText || 'Resolved by District Nodal Desk.',
      });
      setResolutionText('');
      await fetchEscalations();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-rose-200/80 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black font-display text-bsai-indigo">
              Escalations Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
              District Nodal Desk
            </span>
          </div>
          <p className="text-xs text-bsai-indigoLight mt-0.5">
            Review and resolve high-priority citizen cases transferred for human assistance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Queue List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {escalations.map((esc) => {
            const isSelected = selectedEscalation?.id === esc.id;
            return (
              <div
                key={esc.id}
                onClick={() => setSelectedEscalation(esc)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-red-400 shadow-sm ring-1 ring-red-400/20'
                    : 'border-bsai-border hover:bg-bsai-pearl/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-xs text-bsai-indigo">
                    {esc.citizenName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      esc.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {esc.status}
                  </span>
                </div>

                <div className="text-[11px] text-bsai-indigoMuted line-clamp-1 mb-2">
                  {esc.reason}
                </div>

                <div className="flex items-center justify-between text-[10px] text-bsai-indigoMuted">
                  <span className="font-mono">{esc.ticketNumber}</span>
                  <span className="font-bold text-red-600">{esc.priority} Priority</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Case Desk (7 cols) */}
        <div className="lg:col-span-7">
          {selectedEscalation ? (
            <div className="bg-white rounded-2xl p-6 border border-bsai-border shadow-xs space-y-4">
              <div>
                <span className="font-mono text-[11px] text-red-600 font-bold">
                  {selectedEscalation.ticketNumber}
                </span>
                <h2 className="text-base font-bold font-display text-bsai-indigo">
                  {selectedEscalation.citizenName} • {selectedEscalation.category}
                </h2>
              </div>

              <div className="bg-red-50/60 p-3.5 rounded-xl border border-red-200 text-xs text-red-900 leading-relaxed">
                <div className="font-bold text-red-700 mb-0.5">Escalation Trigger:</div>
                {selectedEscalation.reason}
              </div>

              {selectedEscalation.conversationSnippet && (
                <div className="bg-bsai-pearl/60 p-3 rounded-xl border border-bsai-border text-xs font-mono text-bsai-indigo leading-relaxed">
                  {selectedEscalation.conversationSnippet}
                </div>
              )}

              <form onSubmit={handleResolve} className="pt-2 border-t border-bsai-border space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-bsai-indigo block mb-1">
                    Assigned Officer:
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full bg-bsai-pearl border border-bsai-border rounded-xl px-3 py-2 text-xs text-bsai-indigo focus:outline-none focus:border-bsai-teal"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-bsai-indigo block mb-1">
                    Departmental Resolution Note:
                  </label>
                  <textarea
                    rows={3}
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                    placeholder="Enter resolution details or order reference..."
                    className="w-full bg-white border border-bsai-border rounded-xl p-3 text-xs text-bsai-indigo focus:outline-none focus:border-bsai-teal"
                  />
                </div>

                <BSAIButton
                  type="submit"
                  variant="success"
                  size="md"
                  disabled={selectedEscalation.status === 'Resolved'}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  iconPosition="left"
                >
                  {selectedEscalation.status === 'Resolved' ? 'Resolved' : 'Mark Case Resolved'}
                </BSAIButton>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-bsai-border text-xs text-bsai-indigoMuted">
              Select an escalated case from the list
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
