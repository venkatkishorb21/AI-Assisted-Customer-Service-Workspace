import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, ArrowRight, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';
import { SupportCase } from '../../types';

export const HighPriorityTable: React.FC = () => {
  const { cases } = useApp();
  const navigate = useNavigate();

  const highPriorityCases = cases.filter(
    c => (c.priority === 'Critical' || c.priority === 'High') &&
         c.status !== 'Resolved' &&
         c.status !== 'Closed'
  );

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/90 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Urgent & High-Priority Cases</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-pulse">
                {highPriorityCases.length} Need Attention
              </span>
            </div>
            <p className="text-xs text-slate-500">Tickets requiring immediate response or SLA preservation</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/queue')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>View All in Call Queue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {highPriorityCases.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800">All High-Priority Cases Cleared!</p>
          <p className="text-xs text-slate-500 mt-0.5">No critical SLA bottlenecks currently in queue.</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-2.5 pr-4">Case & Customer</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Priority & SLA</th>
                <th className="py-2.5 px-4">Assigned Agent</th>
                <th className="py-2.5 px-4">Wait Time</th>
                <th className="py-2.5 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {highPriorityCases.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition group">
                  {/* Case & Customer */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                        {item.customer.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-indigo-600 group-hover:underline cursor-pointer" onClick={() => navigate(`/workspace/${item.id}`)}>
                            {item.id}
                          </span>
                          <span className="text-slate-900 font-semibold truncate max-w-[140px]">{item.customer.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{item.customer.company}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium inline-block">
                      {item.category}
                    </span>
                  </td>

                  {/* Priority & SLA */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        item.priority === 'Critical'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-[11px] font-mono text-rose-600 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-rose-500" />
                        {item.slaDue}
                      </span>
                    </div>
                  </td>

                  {/* Assigned Agent */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>{item.assignedAgentName}</span>
                    </div>
                  </td>

                  {/* Wait Time */}
                  <td className="py-3 px-4">
                    <span className="text-slate-600 font-medium">{item.waitingTimeMinutes} mins wait</span>
                  </td>

                  {/* Action */}
                  <td className="py-3 pl-4 text-right">
                    <button
                      onClick={() => navigate(`/workspace/${item.id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition shadow-sm"
                    >
                      <span>Take Action</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
