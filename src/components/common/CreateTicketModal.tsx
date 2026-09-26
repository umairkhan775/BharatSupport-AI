import React, { useState } from 'react';
import { SupportCategory, SupportedLanguage, TicketPriority } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { X, FilePlus, Sparkles, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { BSAIButton } from './BSAIButton';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: (ticket: any) => void;
  initialCategory?: SupportCategory;
  initialTitle?: string;
  initialDescription?: string;
  initialIsEscalated?: boolean;
  currentLanguage: SupportedLanguage;
}

const CATEGORIES: SupportCategory[] = [
  'Government Services',
  'Healthcare',
  'Education',
  'Employment',
  'Documents & Identity',
  'Grievance Redressal',
  'Other Citizen Services',
];

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onTicketCreated,
  initialCategory = 'Government Services',
  initialTitle = '',
  initialDescription = '',
  initialIsEscalated = false,
  currentLanguage,
}) => {
  const { currentUser, addNotificationForUser } = useAuth();

  const [citizenName, setCitizenName] = useState(currentUser?.name || 'Citizen User');
  const [citizenContact, setCitizenContact] = useState(currentUser?.phone || '+91 98765 43210');
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState<SupportCategory>(initialCategory);
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [isEscalated, setIsEscalated] = useState(initialIsEscalated);
  const [escalationReason, setEscalationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initial props when opened
  React.useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setCitizenName(currentUser.name);
        if (currentUser.phone) setCitizenContact(currentUser.phone);
      }
      if (initialTitle) setTitle(initialTitle);
      if (initialDescription) setDescription(initialDescription);
      if (initialCategory) setCategory(initialCategory);
      if (initialIsEscalated) setIsEscalated(initialIsEscalated);
    }
  }, [isOpen, initialTitle, initialDescription, initialCategory, initialIsEscalated, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      setIsSubmitting(true);
      const createdTicket = await api.createTicket({
        citizenName,
        citizenContact,
        title,
        description,
        category,
        priority,
        language: currentLanguage,
        isEscalated,
        escalationReason: isEscalated ? (escalationReason || 'Citizen requested immediate human support officer intervention') : undefined,
      });

      if (currentUser) {
        addNotificationForUser(currentUser.id, {
          title: `Request Submitted: ${title.slice(0, 30)}...`,
          message: `Your support ticket #${createdTicket.ticketNumber || 'BSAI-NEW'} was logged successfully. AI is processing the details.`,
          type: 'ticket_update',
          ticketId: createdTicket.id,
        });
      }

      onTicketCreated(createdTicket);
      onClose();
    } catch (err) {
      console.error('Failed to create ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bsai-indigoDark/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-bsai-border shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-bsai-pearl text-bsai-indigoMuted hover:text-bsai-indigo hover:bg-bsai-border transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-bsai-saffronBg border border-bsai-saffron/30 text-bsai-saffronDark flex items-center justify-center">
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-bsai-indigo">
              {isEscalated ? 'Raise Escalated Human Request' : 'Create Citizen Support Request'}
            </h2>
            <p className="text-xs text-bsai-indigoMuted">
              Generate an official tracking token for departmental follow-up
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-bsai-indigo block mb-1">Citizen Name:</label>
              <input
                type="text"
                required
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full bg-bsai-pearl border border-bsai-border rounded-xl px-3 py-2 text-xs text-bsai-indigo focus:outline-none focus:border-bsai-teal"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-bsai-indigo block mb-1">Mobile Contact:</label>
              <input
                type="text"
                value={citizenContact}
                onChange={(e) => setCitizenContact(e.target.value)}
                className="w-full bg-bsai-pearl border border-bsai-border rounded-xl px-3 py-2 text-xs text-bsai-indigo focus:outline-none focus:border-bsai-teal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-bsai-indigo block mb-1">Service Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SupportCategory)}
                className="w-full bg-white border border-bsai-border rounded-xl px-3 py-2 text-xs font-semibold text-bsai-indigo focus:outline-none focus:border-bsai-teal"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-bsai-indigo block mb-1">
                Priority Assessment:
                {currentUser?.role === 'Citizen' && (
                  <span className="ml-1 text-[10px] font-normal text-[#536157]">(AI-Assigned Triage)</span>
                )}
              </label>
              {currentUser?.role === 'Citizen' ? (
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full bg-[#f7f8f5] border border-bsai-border rounded-xl px-3 py-2 text-xs font-semibold text-bsai-indigo focus:outline-none focus:border-bsai-teal"
                  >
                    <option value="Medium">Standard / AI Assessed (Normal Queue)</option>
                    <option value="High">High Urgency (Document/Scheme Deadline &lt; 48h)</option>
                    <option value="Urgent">Emergency / Life Critical (Requires Human Desk Verification)</option>
                  </select>
                </div>
              ) : (
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full bg-white border border-[#126a50] rounded-xl px-3 py-2 text-xs font-semibold text-[#126a50] focus:outline-none focus:border-bsai-teal"
                >
                  <option value="Low">Low Priority (Officer Override)</option>
                  <option value="Medium">Medium Priority (Standard SLA)</option>
                  <option value="High">High Priority (Expedited Nodal Triage)</option>
                  <option value="Urgent">Urgent / Immediate Action (SLA &lt; 2hr)</option>
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-bsai-indigo block mb-1">Subject / Issue Summary:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. PM-Kisan Land Seeding status mismatch in Tehsil records"
              className="w-full bg-bsai-pearl border border-bsai-border rounded-xl px-3.5 py-2.5 text-xs text-bsai-indigo focus:outline-none focus:border-bsai-teal"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-bsai-indigo block mb-1">Detailed Description:</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific registration numbers, error messages or grievance background..."
              className="w-full bg-white border border-bsai-border rounded-xl p-3 text-xs text-bsai-indigo focus:outline-none focus:border-bsai-teal"
            />
          </div>

          {/* Direct Escalation Toggle */}
          <div className="bg-bsai-pearl p-3.5 rounded-2xl border border-bsai-border space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isEscalated}
                onChange={(e) => setIsEscalated(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4 accent-red-600"
              />
              <span className="text-xs font-bold text-bsai-indigo flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                <span>Escalate directly to Human Nodal Desk</span>
              </span>
            </label>

            {isEscalated && (
              <input
                type="text"
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                placeholder="Reason for immediate escalation (e.g. urgent hospital admission / tariff penalty)"
                className="w-full bg-white border border-red-200 rounded-xl px-3 py-1.5 text-xs text-bsai-indigo focus:outline-none focus:border-red-400"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <BSAIButton
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
            >
              Cancel
            </BSAIButton>

            <BSAIButton
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              icon={<Sparkles className="w-4 h-4 text-cyan-200" />}
              iconPosition="right"
            >
              Submit Support Request
            </BSAIButton>
          </div>
        </form>
      </div>
    </div>
  );
};
