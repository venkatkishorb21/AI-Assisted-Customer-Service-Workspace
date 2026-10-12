import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ResolutionModalProps {
  isOpen: boolean;
  caseId: string;
  customerName: string;
  onClose: () => void;
  onConfirmResolve: (notes: string) => void;
}

export const ResolutionModal: React.FC<ResolutionModalProps> = ({
  isOpen,
  caseId,
  customerName,
  onClose,
  onConfirmResolve
}) => {
  const [resolutionNotes, setResolutionNotes] = useState(
    'Root cause identified and successfully remediated. Customer verified fix operational.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) return;
    onConfirmResolve(resolutionNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Resolve Case {caseId}</h3>
              <p className="text-xs text-slate-500">Customer: {customerName}</p>
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
          <p className="text-xs text-slate-600 leading-relaxed">
            Please document the resolution outcome and technical root cause. This will update the case status to <strong>Resolved</strong>, stop SLA timers, and record credit to your daily resolved quota.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Resolution Summary & Corrective Action
            </label>
            <textarea
              rows={4}
              required
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              placeholder="Describe the steps taken to resolve the inquiry..."
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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-200 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Mark Resolved</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
