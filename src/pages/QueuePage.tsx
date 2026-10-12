import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { QueueTable } from '../components/queue/QueueTable';
import { SimulateCallModal } from '../components/common/SimulateCallModal';
import { 
  Search, 
  ArrowUpDown, 
  PhoneCall, 
  Download, 
  RotateCcw
} from 'lucide-react';
import { PriorityLevel } from '../types';

export const QueuePage: React.FC = () => {
  const { cases, currentUserAgent, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAgent, setSelectedAgent] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'waitTime' | 'priority' | 'createdAt'>('waitTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'critical' | 'mine' | 'resolved'>('open');
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // Tab Filtering & Dropdown Filtering
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      // Tab check
      if (activeTab === 'open' && (c.status === 'Resolved' || c.status === 'Closed')) return false;
      if (activeTab === 'critical' && c.priority !== 'Critical') return false;
      if (activeTab === 'mine' && c.assignedAgentId !== currentUserAgent.id) return false;
      if (activeTab === 'resolved' && c.status !== 'Resolved' && c.status !== 'Closed') return false;

      // Status filter
      if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;

      // Priority filter
      if (selectedPriority !== 'All' && c.priority !== selectedPriority) return false;

      // Category filter
      if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;

      // Agent filter
      if (selectedAgent !== 'All' && c.assignedAgentId !== selectedAgent) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches = 
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.customer.name.toLowerCase().includes(q) ||
          c.customer.company.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.assignedAgentName.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'waitTime') {
        comparison = a.waitingTimeMinutes - b.waitingTimeMinutes;
      } else if (sortBy === 'priority') {
        const priorityScore: Record<PriorityLevel, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        comparison = priorityScore[a.priority] - priorityScore[b.priority];
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [cases, activeTab, selectedStatus, selectedPriority, selectedCategory, selectedAgent, search, sortBy, sortDirection, currentUserAgent.id]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedStatus('All');
    setSelectedPriority('All');
    setSelectedCategory('All');
    setSelectedAgent('All');
    setActiveTab('all');
    setSortBy('waitTime');
    setSortDirection('desc');
  };

  const handleExportCsv = () => {
    const headers = ['Case ID', 'Customer', 'Company', 'Category', 'Priority', 'Status', 'Agent', 'Wait Time (Min)', 'SLA Target'];
    const rows = filteredCases.map(c => [
      c.id,
      `"${c.customer.name}"`,
      `"${c.customer.company}"`,
      `"${c.category}"`,
      c.priority,
      c.status,
      `"${c.assignedAgentName}"`,
      c.waitingTimeMinutes,
      `"${c.slaDue}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `callops_queue_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Queue Exported', `Exported ${filteredCases.length} cases to CSV.`, 'success');
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Call Queue Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              {filteredCases.length} Active Tickets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-channel queue: triage customer requests, monitor SLAs, and dispatch agent routing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsSimulateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>Simulate Inbound Call</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { key: 'open', label: 'Open & Unresolved', count: cases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length },
          { key: 'all', label: 'All Cases', count: cases.length },
          { key: 'critical', label: 'Critical (P1)', count: cases.filter(c => c.priority === 'Critical' && c.status !== 'Resolved').length },
          { key: 'mine', label: 'Assigned to Me', count: cases.filter(c => c.assignedAgentId === currentUserAgent.id).length },
          { key: 'resolved', label: 'Resolved Archive', count: cases.filter(c => c.status === 'Resolved' || c.status === 'Closed').length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-2 py-0.2 rounded-full ${
              activeTab === tab.key ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search case ID, customer, fleet..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Technical & API Outage">Technical & API Outage</option>
              <option value="Hardware & Telematics">Hardware & Telematics</option>
              <option value="Billing & Invoicing">Billing & Invoicing</option>
              <option value="On-Ground Logistics">On-Ground Logistics</option>
              <option value="Account & Access">Account & Access</option>
              <option value="Service Cancellation">Service Cancellation</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">🔴 Critical (P1)</option>
              <option value="High">🟠 High (P2)</option>
              <option value="Medium">🟡 Medium (P3)</option>
              <option value="Low">🟢 Low (P4)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Escalated">Escalated</option>
              <option value="Pending Follow-up">Pending Follow-up</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2 flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="waitTime">Sort: Wait Time</option>
              <option value="priority">Sort: Priority</option>
              <option value="createdAt">Sort: Created Date</option>
            </select>
            <button
              onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition"
              title={`Sort direction: ${sortDirection === 'desc' ? 'High to Low' : 'Low to High'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Active Filter chips & Reset */}
        {(search || selectedStatus !== 'All' || selectedPriority !== 'All' || selectedCategory !== 'All' || selectedAgent !== 'All') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-semibold">Active filters:</span>
              {search && <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-slate-700">Search: "{search}"</span>}
              {selectedCategory !== 'All' && <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-slate-700">{selectedCategory}</span>}
              {selectedPriority !== 'All' && <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-slate-700">{selectedPriority}</span>}
              {selectedStatus !== 'All' && <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-slate-700">{selectedStatus}</span>}
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold transition ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <QueueTable cases={filteredCases} />

      {/* Simulate Modal */}
      <SimulateCallModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
      />

    </div>
  );
};
