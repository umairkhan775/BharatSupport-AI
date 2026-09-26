import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Ticket, SupportedLanguage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Plus,
  Star,
  User,
  Inbox
} from 'lucide-react';
import { BSAIButton } from '../common/BSAIButton';

interface MyRequestsViewProps {
  currentLanguage: SupportedLanguage;
  onCreateNewRequest: () => void;
  selectedTicketId?: string;
}

export const MyRequestsView: React.FC<MyRequestsViewProps> = ({
  currentLanguage,
  onCreateNewRequest,
  selectedTicketId,
}) => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.getTickets();
        // Filter tickets belonging to the authenticated citizen
        let userFiltered = data;
        if (currentUser && currentUser.role === 'Citizen') {
          userFiltered = data.filter(
            (t) =>
              (t.userId && t.userId === currentUser.id) ||
              (t.citizenName &&
                t.citizenName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])) ||
              (t.citizenEmail && t.citizenEmail.toLowerCase() === currentUser.email.toLowerCase())
          );
        }

        setTickets(userFiltered);
        if (selectedTicketId) {
          const match = userFiltered.find(
            (t) => t.id === selectedTicketId || t.ticketNumber === selectedTicketId
          );
          if (match) setSelectedTicket(match);
          else if (userFiltered.length > 0) setSelectedTicket(userFiltered[0]);
        } else if (userFiltered.length > 0) {
          setSelectedTicket(userFiltered[0]);
        } else {
          setSelectedTicket(null);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, [selectedTicketId, currentUser]);

  const handleRate = async () => {
    if (!selectedTicket) return;
    try {
      await api.submitFeedback({
        ticketId: selectedTicket.id,
        rating: feedbackRating,
        helpful: feedbackRating >= 4,
        category: selectedTicket.category,
      });
      setFeedbackGiven(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black font-display text-bsai-indigo">
              My Requests
            </h1>
            {currentUser && (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-black border border-cyan-300">
                {currentUser.name}
              </span>
            )}
          </div>
          <p className="text-xs text-bsai-indigoLight mt-0.5">
            {currentUser
              ? `Personalized support inquiries for ${currentUser.name} (${currentUser.email})`
              : 'Track status and progress of your submitted support inquiries'}
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

      {tickets.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-xl p-12 rounded-3xl border border-cyan-200/80 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto text-2xl shadow-inner">
            <Inbox className="w-8 h-8 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-base font-black text-bsai-indigo">
              No Requests Logged for {currentUser?.name || 'You'}
            </h3>
            <p className="text-xs text-bsai-indigoMuted mt-1 max-w-md mx-auto">
              You haven't submitted any support requests yet. Start by asking BSAI AI Assistant or submitting a new request form.
            </p>
          </div>
          <BSAIButton
            variant="primary"
            size="md"
            onClick={onCreateNewRequest}
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
          >
            Create First Request
          </BSAIButton>
        </div>
      ) : (

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {tickets.map((t) => {
            const isSelected = selectedTicket?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTicket(t);
                  setFeedbackGiven(false);
                }}
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

        {/* Stepper Details (7 cols) */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-white rounded-2xl p-6 border border-bsai-border shadow-xs space-y-6">
              <div>
                <div className="font-mono text-[11px] text-bsai-teal font-bold">
                  {selectedTicket.ticketNumber}
                </div>
                <h2 className="text-lg font-bold font-display text-bsai-indigo">
                  {selectedTicket.title}
                </h2>
                <div className="mt-1 flex items-center gap-2 text-xs text-bsai-indigoMuted">
                  <span>Category: <strong>{selectedTicket.category}</strong></span>
                  <span>•</span>
                  <span>Status: <strong>{selectedTicket.status}</strong></span>
                </div>
              </div>

              {/* 3-Step Stepper */}
              <div className="bg-bsai-pearl/60 p-4 rounded-xl border border-bsai-border">
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-6 right-6 top-3.5 h-0.5 bg-bsai-border -z-0" />

                  <div className="flex flex-col items-center gap-1 z-10">
                    <div className="w-7 h-7 rounded-full bg-bsai-teal text-white flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <span className="text-[11px] font-bold text-bsai-indigo">Created</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        selectedTicket.status !== 'Open' ? 'bg-bsai-teal text-white' : 'bg-white border border-bsai-border text-bsai-indigoMuted'
                      }`}
                    >
                      2
                    </div>
                    <span className="text-[11px] font-bold text-bsai-indigo">
                      {selectedTicket.status === 'Escalated' ? 'Escalated' : 'Processing'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1 z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        selectedTicket.status === 'Resolved' ? 'bg-emerald-600 text-white' : 'bg-white border border-bsai-border text-bsai-indigoMuted'
                      }`}
                    >
                      3
                    </div>
                    <span className="text-[11px] font-bold text-bsai-indigo">Resolved</span>
                  </div>
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-bsai-indigo">Your Message:</div>
                <div className="bg-bsai-pearl/40 p-3.5 rounded-xl border border-bsai-border text-xs text-bsai-indigo leading-relaxed">
                  {selectedTicket.description}
                </div>
              </div>

              {/* Resolution / Rating */}
              {selectedTicket.status === 'Resolved' && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Resolution Confirmed</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    {selectedTicket.resolutionNotes || 'Case was reviewed and resolved by our public support desk.'}
                  </p>

                  {!feedbackGiven ? (
                    <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => setFeedbackRating(star)}>
                            <Star className={`w-5 h-5 ${star <= feedbackRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                      <BSAIButton
                        variant="success"
                        size="sm"
                        onClick={handleRate}
                        icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        iconPosition="left"
                      >
                        Submit Rating
                      </BSAIButton>
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-emerald-700">
                      Thank you for your rating!
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-12 text-center border border-bsai-border text-xs text-bsai-indigoMuted shadow-sm">
              Select a request from the list to view tracking timeline
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
