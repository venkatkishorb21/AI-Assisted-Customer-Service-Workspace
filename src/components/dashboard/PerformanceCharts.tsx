import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { DailyMetricPoint } from '../../types';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

interface PerformanceChartsProps {
  data: DailyMetricPoint[];
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ data }) => {
  const [metricView, setMetricView] = useState<'volume' | 'efficiency'>('volume');

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/90 shadow-sm">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Daily Call Centre Performance</h3>
              <p className="text-xs text-slate-500">Call handling velocity, resolution rates & SLA trends</p>
            </div>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setMetricView('volume')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              metricView === 'volume'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Volume & Resolution
          </button>
          <button
            onClick={() => setMetricView('efficiency')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              metricView === 'efficiency'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Handling Time & SLA
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {metricView === 'volume' ? (
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-800">
                        <p className="font-bold border-b border-slate-800 pb-1 mb-2 text-slate-300">{label}</p>
                        <div className="space-y-1">
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-indigo-400">Total Calls Handled:</span>
                            <span className="font-bold text-white">{payload[0]?.value}</span>
                          </p>
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-emerald-400">Cases Resolved:</span>
                            <span className="font-bold text-white">{payload[1]?.value}</span>
                          </p>
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-amber-400">Escalated:</span>
                            <span className="font-bold text-white">{payload[2]?.value}</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }} 
              />
              <Bar dataKey="totalCalls" name="Total Inbound Calls" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Bar dataKey="resolvedCases" name="Resolved Cases" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Line type="monotone" dataKey="escalatedCases" name="Escalations" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          ) : (
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} unit="m" axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" domain={[85, 100]} unit="%" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-800">
                        <p className="font-bold border-b border-slate-800 pb-1 mb-2 text-slate-300">{label}</p>
                        <div className="space-y-1">
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-cyan-400">Avg Handling Time:</span>
                            <span className="font-bold text-white">{payload[0]?.value} mins</span>
                          </p>
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-emerald-400">SLA Compliance:</span>
                            <span className="font-bold text-white">{payload[1]?.value}%</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }} />
              <Bar yAxisId="left" dataKey="avgHandlingMinutes" name="AHT (Minutes)" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={34} />
              <Line yAxisId="right" type="monotone" dataKey="slaCompliancePct" name="SLA Adherence %" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary highlights */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-slate-50">
          <span className="text-[11px] text-slate-500 block">Weekly Total Calls</span>
          <span className="font-bold text-slate-800 text-sm">845 Calls</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50">
          <span className="text-[11px] text-slate-500 block">Weekly Avg Resolution</span>
          <span className="font-bold text-emerald-600 text-sm">91.8%</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50">
          <span className="text-[11px] text-slate-500 block">Mean AHT</span>
          <span className="font-bold text-indigo-600 text-sm">4.5 Minutes</span>
        </div>
      </div>
    </div>
  );
};
