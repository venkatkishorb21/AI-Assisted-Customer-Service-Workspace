import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Users, Phone, Clock, Star, ChevronDown, CheckCircle2 } from 'lucide-react';
import { AgentStatus } from '../../types';

export const AgentAvailabilityList: React.FC = () => {
  const { agents, updateAgentStatus, currentRole } = useApp();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);

  const statuses: { label: string; value: AgentStatus; color: string; badgeClass: string }[] = [
    { label: 'Available', value: 'Available', color: 'bg-emerald-500', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'In Call', value: 'In Call', color: 'bg-amber-500', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Wrap-up', value: 'Wrap-up', color: 'bg-indigo-500', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { label: 'Break', value: 'Break', color: 'bg-orange-500', badgeClass: 'bg-orange-50 text-orange-700 border-orange-200' },
    { label: 'Offline', value: 'Offline', color: 'bg-slate-400', badgeClass: 'bg-slate-50 text-slate-600 border-slate-200' }
  ];

  const filteredAgents = filterStatus === 'All'
    ? agents
    : agents.filter(a => a.status === filterStatus);

  const isSupervisor = currentRole === 'Support Team Lead / Supervisor';

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/90 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Live Agent Availability</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {agents.filter(a => a.status === 'Available').length}/{agents.length} Online
              </span>
            </div>
            <p className="text-xs text-slate-500">Real-time floor staffing & routing presence</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Available', 'In Call', 'Break'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition shrink-0 ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Agents List */}
      <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[380px] -mx-2 px-2">
        {filteredAgents.map(agent => {
          const statusObj = statuses.find(s => s.value === agent.status) || statuses[0];
          const isDropdownOpen = editingAgentId === agent.id;

          return (
            <div key={agent.id} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 rounded-xl px-2 transition">
              {/* Agent info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  {agent.id === 'agt-1' ? (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-800 text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-indigo-500/30 shadow-sm tracking-tight select-none">
                      VK
                    </div>
                  ) : (
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                    />
                  )}
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusObj.color}`} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-900 truncate">{agent.name}</p>
                    {agent.id === 'agt-1' && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 border border-indigo-200">
                        VK • YOU
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{agent.department}</p>
                  
                  {agent.activeCaseId && (
                    <button
                      onClick={() => navigate(`/workspace/${agent.activeCaseId}`)}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 mt-0.5"
                    >
                      <span>Handling {agent.activeCaseId}</span>
                      <span>→</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status and quick controls */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:block text-right text-[11px]">
                  <span className="text-slate-400 block">Today</span>
                  <span className="font-bold text-slate-700">{agent.callsHandledToday} calls</span>
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setEditingAgentId(isDropdownOpen ? null : agent.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${statusObj.badgeClass} hover:opacity-90 transition`}
                  >
                    <span className={`w-2 h-2 rounded-full ${statusObj.color}`} />
                    <span>{agent.status}</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                        Set {agent.name.split(' ')[0]}'s Status
                      </div>
                      {statuses.map(s => (
                        <button
                          key={s.value}
                          onClick={() => {
                            updateAgentStatus(agent.id, s.value);
                            setEditingAgentId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-50 transition"
                        >
                          <span className={`w-2 h-2 rounded-full ${s.color}`} />
                          <span className={s.value === agent.status ? 'font-bold text-slate-900' : 'text-slate-600'}>
                            {s.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Average Team CSAT: <strong className="text-slate-800">4.82 / 5.0</strong></span>
        <button 
          onClick={() => navigate('/analytics')}
          className="text-indigo-600 font-bold hover:underline"
        >
          View Full Roster →
        </button>
      </div>
    </div>
  );
};
