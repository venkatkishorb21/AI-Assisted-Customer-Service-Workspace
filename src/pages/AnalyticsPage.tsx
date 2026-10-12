import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';
import { AgentLeaderboard } from '../components/analytics/AgentLeaderboard';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Download, 
  CheckCircle2, 
  Clock, 
  Star,
  RotateCcw
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { agents, metrics, addToast } = useApp();

  const [selectedAgentId, setSelectedAgentId] = useState<string>('All');
  const [dateRange, setDateRange] = useState<string>('Last 7 Days');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const selectedAgentObj = agents.find(a => a.id === selectedAgentId);

  const handleExport = () => {
    addToast('Report Generated', `Performance summary report for "${dateRange}" exported successfully.`, 'success');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Team Operations & Analytics</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              Live BI Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time workforce intelligence, resolution efficiency, handling time benchmarks, and agent scorecards.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-sm self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-indigo-600" />
          <span>Export Analytics PDF / CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Agent Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Agent:</span>
            <select
              value={selectedAgentId}
              onChange={e => setSelectedAgentId(e.target.value)}
              className="text-xs font-bold bg-transparent outline-none cursor-pointer text-slate-800"
            >
              <option value="All">All Floor Agents ({agents.length})</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.department})
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Date Range:</span>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="text-xs font-bold bg-transparent outline-none cursor-pointer text-slate-800"
            >
              <option value="Today">Today (Live Shift)</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Quarter">This Quarter (Q4 2026)</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-slate-400">Department:</span>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="text-xs font-bold bg-transparent outline-none cursor-pointer text-slate-800"
            >
              <option value="All">All Departments</option>
              <option value="Technical & Telematics">Technical & Telematics</option>
              <option value="Enterprise Logistics">Enterprise Logistics</option>
              <option value="Billing & Invoicing">Billing & Invoicing</option>
              <option value="Escalations & VIP">Escalations & VIP</option>
            </select>
          </div>
        </div>

        {selectedAgentId !== 'All' && (
          <button
            onClick={() => setSelectedAgentId('All')}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Agent Filter ({selectedAgentObj?.name})</span>
          </button>
        )}
      </div>

      {/* Analytics KPI Mini-grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase font-bold tracking-wider">
            <span>Total Calls ({dateRange})</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
            {selectedAgentId === 'All' ? '845 Calls' : `${selectedAgentObj?.callsHandledToday} Calls`}
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 11.4% vs previous period</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase font-bold tracking-wider">
            <span>Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-2">
            {selectedAgentId === 'All' 
              ? '91.8%' 
              : `${Math.round(((selectedAgentObj?.resolvedToday || 0) / Math.max(1, selectedAgentObj?.callsHandledToday || 1)) * 100)}%`}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Target benchmark: ≥ 88.0%</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase font-bold tracking-wider">
            <span>Average Handling Time</span>
            <Clock className="w-4 h-4 text-cyan-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
            {selectedAgentId === 'All' ? `${metrics.avgHandlingTimeMin}m` : `${selectedAgentObj?.avgHandlingTimeMin}m`}
          </h3>
          <p className="text-xs text-indigo-600 font-semibold mt-1">✓ Within optimal SLA band</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase font-bold tracking-wider">
            <span>Customer CSAT Score</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-2">
            {selectedAgentId === 'All' ? '4.82 / 5.0' : `${selectedAgentObj?.csatRating} / 5.0`}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Based on 682 customer surveys</p>
        </div>
      </div>

      {/* Interactive Charts */}
      <AnalyticsCharts agents={agents} selectedAgentId={selectedAgentId} />

      {/* Team Leaderboard Table */}
      <AgentLeaderboard
        agents={agents}
        selectedAgentId={selectedAgentId}
        onSelectAgent={id => setSelectedAgentId(id)}
      />

    </div>
  );
};
