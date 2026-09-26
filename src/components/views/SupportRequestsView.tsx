import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Ticket, TicketStatus, SupportedLanguage } from '../../types';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Plus,
  Paperclip,
  Mic,
  User,
  Bot
} from 'lucide-react';
import { BSAIButton } from '../common/BSAIButton';

interface SupportRequestsViewProps {
  currentLanguage: SupportedLanguage;
  onCreateNewRequest: () => void;
}

const STATUS_FILTERS = ['All', 'Open', 'In Progress', 'Resolved', 'Escalated'];

export const SupportRequestsView: React.FC<SupportRequestsViewProps> = ({
  currentLanguage,
  onCreateNewRequest,
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [replyText, setReplyText] = useState('');

  const fetchTickets = async () => {
    try {
      const data = await api.getTickets({
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });
      setTickets(data);
      if (data.length > 0 && !selectedTicket) {
        setSelectedTicket(data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    try {
      const updated = await api.updateTicket(selectedTicket.id, {
        note: replyText,
        actor: 'Human Support Officer',
      });
      setSelectedTicket(updated);
      setReplyText('');
      await fetchTickets();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-emerald-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-display text-bsai-indigo">
            Support Requests
          </h1>
          <p className="text-xs text-bsai-indigoLight mt-0.5">
            Review and resolve citizen grievances with step-by-step assistance
          </p>
        </div>

        <BSAIButton
          variant="primary"
          size="md"
          onClick={onCreateNewRequest}
          icon={<Plus className="w-4 h-4" />}
          iconPosition="left"
        >
          New Request
        </BSAIButton>
      </div>

      {/* Status Filter Pill Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === s
                ? 'bg-gradient-to-r from-bsai-emerald to-bsai-teal text-white shadow-xs'
                : 'bg-white text-bsai-indigoLight border border-bsai-border hover:bg-[#E8F6EE]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Main Grid: Ticket List (5 cols) & Request Details (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Request List */}
        <div className="lg:col-span-5 space-y-3">
          {tickets.map((t) => {
            const isSelected = selectedTicket?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-bsai-teal shadow-sm ring-1 ring-bsai-teal/20'
                    : 'border-bsai-border hover:bg-bsai-pearl/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-xs text-bsai-indigo">
                    {t.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : t.status === 'Escalated'
                        ? 'bg-red-50 text-red-700'
                        : t.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="text-[11px] text-bsai-indigoMuted flex items-center justify-between">
                  <span className="font-mono">{t.ticketNumber}</span>
                  <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Request Details Panel (Matching Reference Image) */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-white rounded-2xl border border-bsai-border shadow-xs flex flex-col h-[520px] overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-bsai-border bg-bsai-pearl/50">
                <div className="text-[11px] font-mono text-bsai-indigoMuted">
                  {selectedTicket.ticketNumber}
                </div>
                <h2 className="text-base font-bold text-bsai-indigo">
                  {selectedTicket.title}
                </h2>
                <div className="mt-1 flex items-center gap-3 text-xs text-bsai-indigoMuted">
                  <span>Status: <strong className="text-bsai-indigo">{selectedTicket.status}</strong></span>
                  <span>•</span>
                  <span>Category: <strong className="text-bsai-indigo">{selectedTicket.category}</strong></span>
                </div>
              </div>

              {/* Chat / Timeline Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF8F5]/40">
                {/* Citizen Message */}
                <div className="flex items-start gap-2.5 max-w-md">
                  <div className="w-7 h-7 rounded-full bg-bsai-indigo text-white flex items-center justify-center text-xs font-bold shrink-0">
                    U
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-bsai-border text-xs leading-relaxed text-bsai-indigo shadow-2xs">
                    <div className="font-bold text-[11px] text-bsai-indigoMuted mb-0.5">
                      {selectedTicket.citizenName}
                    </div>
                    {selectedTicket.description}
                  </div>
                </div>

                {/* AI Assistant Reply */}
                <div className="flex items-start gap-2.5 max-w-md ml-auto flex-row-reverse">
                  <div className="w-7 h-7 rounded-full bg-bsai-teal text-white flex items-center justify-center text-xs font-bold shrink-0">
                    AI
                  </div>
                  <div className="bg-bsai-teal text-white p-3 rounded-2xl text-xs leading-relaxed shadow-2xs">
                    <div className="font-bold text-[11px] text-white/80 mb-0.5">
                      BSAI Assistant
                    </div>
                    {selectedTicket.resolutionNotes ||
                      "Here's the step-by-step process for your inquiry. Our district nodal team is tracking this request for you."}
                  </div>
                </div>
              </div>

              {/* Reply Input Bar */}
              <div className="p-3 bg-white border-t border-bsai-border">
                <form onSubmit={handleSendReply} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type a message or resolution note..."
                    className="flex-1 bg-bsai-pearl border border-bsai-border rounded-xl px-3.5 py-2 text-xs text-bsai-indigo placeholder-bsai-indigoMuted focus:outline-none focus:border-bsai-teal"
                  />
                  <BSAIButton
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!replyText.trim()}
                    icon={<Send className="w-3.5 h-3.5" />}
                    iconPosition="right"
                  >
                    Reply
                  </BSAIButton>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-bsai-border text-xs text-bsai-indigoMuted">
              Select a request from the list to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
