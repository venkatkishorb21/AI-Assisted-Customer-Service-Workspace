import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SupportCase, CaseStatus, PriorityLevel } from '../../types';
import { 
  Clock, 
  ExternalLink, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ChevronDown
} from 'lucide-react';

interface QueueTableProps {
  cases: SupportCase[];
}

export const QueueTable: React.FC<QueueTableProps> = ({ cases }) => {
  const navigate = useNavigate();
  const { agents, reassignCase, updateCaseStatus } = useApp();
  const [activeDropdownCaseId, setActiveDropdownCaseId] = useState<string | null>(null);

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Escalated':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Pending Follow-up':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (cases.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="text-base font-bold text-slate-800">No cases found matching filters</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Try resetting your search query, priority, category or status filters to view the full queue.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Case & Customer</th>
              <th className="py-3 px-4">Category & Subject</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned Agent</th>
              <th className="py-3 px-4">Wait Time</th>
              <th className="py-3 px-4">SLA Target</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {cases.map(c => {
              const isMenuOpen = activeDropdownCaseId === c.id;

              return (
                <tr 
                  key={c.id} 
                  className="hover:bg-indigo-50/30 transition group cursor-pointer"
                  onClick={() => navigate(`/workspace/${c.id}`)}
                >
                  {/* Case & Customer */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-sm">
                        {c.customer.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-indigo-600 hover:underline">
                            {c.id}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                            {c.channel}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 truncate mt-0.5">{c.customer.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{c.customer.company}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category & Subject */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium mb-1">
                      {c.category}
                    </span>
                    <p className="font-medium text-slate-800 truncate leading-snug">{c.title}</p>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(c.priority)}`}>
                      {c.priority === 'Critical' && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />}
                      {c.priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>

                  {/* Assigned Agent */}
                  <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                    <div className="relative">
                      <select
                        value={c.assignedAgentId}
                        onChange={e => reassignCase(c.id, e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-lg px-2 py-1 outline-none font-medium text-slate-700 cursor-pointer"
                      >
                        {agents.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.name} ({a.status})
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* Wait Time */}
                  <td className="py-3.5 px-4">
                    <span className="text-slate-600 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {c.waitingTimeMinutes} mins
                    </span>
                  </td>

                  {/* SLA Target */}
                  <td className="py-3.5 px-4">
                    <span className={`font-mono text-[11px] font-semibold ${
                      c.status === 'Resolved' ? 'text-emerald-600' :
                      c.priority === 'Critical' ? 'text-rose-600' : 'text-slate-600'
                    }`}>
                      {c.slaDue}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/workspace/${c.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm shadow-indigo-200"
                    >
                      <span>Open Workspace</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer bar */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>Showing <strong>{cases.length}</strong> active cases in queue</span>
        <span>Click any row or "Open Workspace" to launch agent console & AI Copilot</span>
      </div>
    </div>
  );
};
