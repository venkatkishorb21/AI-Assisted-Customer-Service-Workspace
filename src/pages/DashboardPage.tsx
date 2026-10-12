import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  PhoneCall, 
  Headphones, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowRight
} from 'lucide-react';
import { KpiCard } from '../components/dashboard/KpiCard';
import { PerformanceCharts } from '../components/dashboard/PerformanceCharts';
import { AgentAvailabilityList } from '../components/dashboard/AgentAvailabilityList';
import { HighPriorityTable } from '../components/dashboard/HighPriorityTable';
import { RecentInteractionsFeed } from '../components/dashboard/RecentInteractionsFeed';
import { SimulateCallModal } from '../components/common/SimulateCallModal';

export const DashboardPage: React.FC = () => {
  const { metrics, dailyMetrics, currentRole } = useApp();
  const navigate = useNavigate();
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Page Title & Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Glow backdrop decorative */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Operations Floor
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-300 font-medium">Role: <strong className="text-white">{currentRole}</strong></span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Call Centre Command & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
            Real-time monitoring of queue volume, SLA preservation, agent availability, and AI-assisted dispatch triage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsSimulateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Simulate Inbound Call</span>
          </button>

          <button
            onClick={() => navigate('/queue')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 backdrop-blur-sm transition"
          >
            <span>Open Call Queue ({metrics.openCases})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Calls Today"
          value={metrics.totalCallsHandled}
          change="+14.2%"
          isPositiveChange={true}
          icon={PhoneCall}
          iconBgColor="bg-indigo-50"
          iconTextColor="text-indigo-600"
          badge="Live"
          badgeColor="bg-indigo-100 text-indigo-700"
          onClick={() => navigate('/analytics')}
        />

        <KpiCard
          title="Open & Active Cases"
          value={metrics.openCases}
          subtitle="In triage or active handling"
          icon={Headphones}
          iconBgColor="bg-amber-50"
          iconTextColor="text-amber-600"
          badge={`${metrics.criticalCasesCount} Critical`}
          badgeColor="bg-rose-100 text-rose-700"
          onClick={() => navigate('/queue')}
        />

        <KpiCard
          title="Resolved Cases"
          value={metrics.resolvedCases}
          change="+8.6%"
          isPositiveChange={true}
          icon={CheckCircle2}
          iconBgColor="bg-emerald-50"
          iconTextColor="text-emerald-600"
          badge="94.2% Rate"
          badgeColor="bg-emerald-100 text-emerald-800"
          onClick={() => navigate('/analytics')}
        />

        <KpiCard
          title="Avg Handling Time (AHT)"
          value={`${metrics.avgHandlingTimeMin}m`}
          subtitle="Target threshold < 5.0m"
          change="-0.4m"
          isPositiveChange={true}
          icon={Clock}
          iconBgColor="bg-cyan-50"
          iconTextColor="text-cyan-600"
        />

        <KpiCard
          title="Floor Staffing"
          value={`${metrics.availableAgents}/${metrics.totalAgents}`}
          subtitle="Agents currently Available"
          icon={Users}
          iconBgColor="bg-purple-50"
          iconTextColor="text-purple-600"
          badge="Ready"
          badgeColor="bg-purple-100 text-purple-700"
        />
      </div>

      {/* Main Grid: Charts & Floor Presence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Performance Recharts */}
          <PerformanceCharts data={dailyMetrics} />

          {/* High Priority Cases Table */}
          <HighPriorityTable />
        </div>

        <div className="space-y-6">
          {/* Live Agent Availability */}
          <AgentAvailabilityList />

          {/* Recent Omni-channel Interactions Feed */}
          <RecentInteractionsFeed />
        </div>
      </div>

      {/* Simulate Inbound Call Modal */}
      <SimulateCallModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
      />

    </div>
  );
};
