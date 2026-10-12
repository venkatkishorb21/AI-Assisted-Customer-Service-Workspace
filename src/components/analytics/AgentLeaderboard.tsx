import React from 'react';
import { Agent } from '../../types';
import { Award, Star, Clock, CheckCircle2, Phone, TrendingUp } from 'lucide-react';

interface AgentLeaderboardProps {
  agents: Agent[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
}

export const AgentLeaderboard: React.FC<AgentLeaderboardProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Agent Performance Leaderboard</h3>
            <p className="text-xs text-slate-500">Individual handling velocity, resolution ratios & CSAT audit</p>
          </div>
        </div>

        {selectedAgentId !== 'All' && (
          <button
            onClick={() => onSelectAgent('All')}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Clear Agent Filter
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Agent Name</th>
              <th className="py-3 px-4">Department & Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Calls Handled</th>
              <th className="py-3 px-4 text-center">Resolved</th>
              <th className="py-3 px-4 text-center">Resolution Rate</th>
              <th className="py-3 px-4 text-center">AHT</th>
              <th className="py-3 px-4 text-center">CSAT</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {agents.map((agent, index) => {
              const resolutionRate = Math.round((agent.resolvedToday / Math.max(1, agent.callsHandledToday)) * 100);
              const isSelected = selectedAgentId === agent.id;

              return (
                <tr
                  key={agent.id}
                  onClick={() => onSelectAgent(isSelected ? 'All' : agent.id)}
                  className={`hover:bg-slate-50 cursor-pointer transition ${
                    isSelected ? 'bg-indigo-50/60 font-semibold' : ''
                  }`}
                >
                  {/* Agent Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        {agent.id === 'agt-1' ? (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-800 text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-indigo-500/30 shadow-sm tracking-tight select-none">
                            VK
                          </div>
                        ) : (
                          <img
                            src={agent.avatar}
                            alt={agent.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                          />
                        )}
                        {index === 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[9px] flex items-center justify-center shadow-sm">
                            1
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{agent.name}</span>
                          {agent.id === 'agt-1' && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 border border-indigo-200">
                              VK • YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal">{agent.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Department & Role */}
                  <td className="py-3.5 px-4">
                    <span className="text-slate-800 font-medium block">{agent.department}</span>
                    <span className="text-[11px] text-slate-400 font-normal">{agent.role}</span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      agent.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                      agent.status === 'In Call' ? 'bg-amber-100 text-amber-800' :
                      agent.status === 'Break' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        agent.status === 'Available' ? 'bg-emerald-500' :
                        agent.status === 'In Call' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                      {agent.status}
                    </span>
                  </td>

                  {/* Calls Handled */}
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {agent.callsHandledToday}
                  </td>

                  {/* Resolved */}
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                    {agent.resolvedToday}
                  </td>

                  {/* Resolution Rate */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1">
                      <span className="font-extrabold text-slate-900">{resolutionRate}%</span>
                      <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${resolutionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* AHT */}
                  <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-700">
                    {agent.avgHandlingTimeMin}m
                  </td>

                  {/* CSAT */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {agent.csatRating}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAgent(isSelected ? 'All' : agent.id);
                      }}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Filtered' : 'Filter Stats'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
