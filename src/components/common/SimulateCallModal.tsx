import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, X, Sparkles, Building, User, AlertTriangle, ShieldAlert } from 'lucide-react';
import { IssueCategory, PriorityLevel } from '../../types';

interface SimulateCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulateCallModal: React.FC<SimulateCallModalProps> = ({ isOpen, onClose }) => {
  const { addNewSimulatedCase } = useApp();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('Alexandra Vance');
  const [company, setCompany] = useState('Titan Freightways Corp');
  const [category, setCategory] = useState<IssueCategory>('Technical & API Outage');
  const [priority, setPriority] = useState<PriorityLevel>('Critical');
  const [customMessage, setCustomMessage] = useState('Our dispatch API is rejecting vehicle route requests with error 503.');

  if (!isOpen) return null;

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase = addNewSimulatedCase({
      title: customMessage || `Inbound call from ${customerName} (${company})`,
      category,
      priority,
      customer: {
        id: `CUST-${Math.floor(1020 + Math.random() * 50)}`,
        name: customerName,
        company,
        email: `${customerName.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+1 (555) 789-1234',
        location: 'Denver, CO',
        tier: priority === 'Critical' ? 'Enterprise VIP' : 'Growth Corporate',
        accountSince: '2024',
        lifetimeValue: '$110,000 / yr',
        satisfactionScore: 82,
        totalTicketsCount: 5,
        openTicketsCount: 1,
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
      }
    });

    onClose();
    // Navigate straight to the new case workspace!
    navigate(`/workspace/${newCase.id}`);
  };

  const handleQuickRandom = () => {
    const newCase = addNewSimulatedCase();
    onClose();
    navigate(`/workspace/${newCase.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Simulate Inbound Call / Case</h3>
              <p className="text-xs text-slate-500">Live test agent queue, AI suggestions & workspace updates</p>
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
        <form onSubmit={handleSimulate} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Demo Test Harness:</strong> Creating a simulated call injects a realistic ticket into your active browser state, updates real-time queue counts and KPIs, and triggers deterministic AI Copilot analysis.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Contact</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="e.g. Sarah Connor"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Fleet</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="e.g. Metro Express Logistics"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as IssueCategory)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                <option value="Technical & API Outage">Technical & API Outage</option>
                <option value="Hardware & Telematics">Hardware & Telematics</option>
                <option value="Billing & Invoicing">Billing & Invoicing</option>
                <option value="On-Ground Logistics">On-Ground Logistics</option>
                <option value="Account & Access">Account & Access</option>
                <option value="Service Cancellation">Service Cancellation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Severity / Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                <option value="Critical">🔴 Critical (P1)</option>
                <option value="High">🟠 High (P2)</option>
                <option value="Medium">🟡 Medium (P3)</option>
                <option value="Low">🟢 Low (P4)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Customer Statement</label>
            <textarea
              rows={2}
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              className="w-full p-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              placeholder="What is the customer reporting on the call?"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleQuickRandom}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Random Scenario
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Queue & Open Case
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
