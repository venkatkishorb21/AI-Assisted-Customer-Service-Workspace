import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';
import { HOURLY_CALL_DISTRIBUTION, CATEGORY_DISTRIBUTION } from '../../data/mockData';
import { Agent } from '../../types';

interface AnalyticsChartsProps {
  agents: Agent[];
  selectedAgentId: string;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ agents, selectedAgentId }) => {
  // Agent handling time data
  const agentHandlingData = agents.map(a => ({
    name: a.name.split(' ')[0],
    fullName: a.name,
    aht: a.avgHandlingTimeMin,
    resolved: a.resolvedToday,
    calls: a.callsHandledToday,
    rate: Math.round((a.resolvedToday / Math.max(1, a.callsHandledToday)) * 100)
  }));

  const filteredHandlingData = selectedAgentId === 'All'
    ? agentHandlingData
    : agentHandlingData.filter(a => agents.find(ag => ag.id === selectedAgentId)?.name.includes(a.name));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Hourly Call Volume & Wait Times */}
      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/90 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900">Hourly Call Velocity & Wait Trends</h3>
          <p className="text-xs text-slate-500">Inbound volume vs queue wait times across shift</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={HOURLY_CALL_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl">
                        <p className="font-bold border-b border-slate-800 pb-1 mb-1 text-slate-300">{label}</p>
                        <p className="text-indigo-400">Incoming: {payload[0]?.value}</p>
                        <p className="text-emerald-400">Resolved: {payload[1]?.value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }} />
              <Bar dataKey="incoming" name="Inbound Calls" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="resolved" name="Resolved Calls" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Issue Category Breakdown */}
      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/90 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900">Incident Category Distribution</h3>
          <p className="text-xs text-slate-500">Breakdown of support drivers and problem domains</p>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CATEGORY_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {CATEGORY_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    return (
                      <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-xl">
                        <span className="font-bold">{data.name}: </span>
                        <span>{data.value}% of volume</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Average Handling Time by Agent */}
      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/90 shadow-sm lg:col-span-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Average Handling Time (AHT) Comparison</h3>
            <p className="text-xs text-slate-500">Agent efficiency benchmarking against standard 5.0 min target</p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            Target SLA: ≤ 5.0 Minutes
          </span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredHandlingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="fullName" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis unit="m" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl">
                        <p className="font-bold border-b border-slate-800 pb-1 mb-1 text-slate-300">{label}</p>
                        <p className="text-cyan-400">AHT: {payload[0]?.value} mins</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="aht" name="AHT (Minutes)" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
