import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { FollowUpSchedule, Agent } from '../../types';

interface FollowUpModalProps {
  isOpen: boolean;
  caseId: string;
  customerName: string;
  agents: Agent[];
  currentAgentName: string;
  onClose: () => void;
  onSchedule: (data: {
    scheduledDate: string;
    scheduledTime: string;
    method: FollowUpSchedule['method'];
    notes: string;
    assignedAgent: string;
  }) => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  caseId,
  customerName,
  agents,
  currentAgentName,
  onClose,
  onSchedule
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('11:00');
  const [method, setMethod] = useState<FollowUpSchedule['method']>('Phone Call');
  const [assignedAgent, setAssignedAgent] = useState(currentAgentName);
  const [notes, setNotes] = useState(`Review fleet telemetry stability with ${customerName} after 24hr soak period.`);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule({
      scheduledDate: date,
      scheduledTime: time,
      method,
      notes,
      assignedAgent
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-indigo-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Schedule Follow-up</h3>
              <p className="text-xs text-slate-500">Case {caseId} • {customerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Method</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as FollowUpSchedule['method'])}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Phone Call">📞 Phone Call</option>
                <option value="Video Call">🎥 Video Call</option>
                <option value="Email">✉️ Email Check-in</option>
                <option value="Field Technician Visit">🔧 Field Tech Visit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Follow-up To</label>
              <select
                value={assignedAgent}
                onChange={e => setAssignedAgent(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {agents.map(a => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Follow-up Objective & Instructions</label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="What needs to be addressed or verified during this follow-up?"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Follow-up</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
