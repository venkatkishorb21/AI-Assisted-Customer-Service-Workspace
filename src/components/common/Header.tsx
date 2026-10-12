import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  PhoneCall, 
  RotateCcw, 
  Shield, 
  ChevronDown, 
  Check, 
  Menu,
  Clock,
  Sparkles
} from 'lucide-react';
import { AgentStatus, UserRole } from '../../types';
import { SimulateCallModal } from './SimulateCallModal';

interface HeaderProps {
  onToggleSidebarMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebarMobile }) => {
  const { 
    currentUserAgent, 
    updateCurrentUserStatus, 
    currentRole, 
    setCurrentRole, 
    cases, 
    resetToDefaults,
    metrics
  } = useApp();
  
  const navigate = useNavigate();
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchMatches = searchQuery.trim()
    ? cases.filter(c => 
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const roles: UserRole[] = [
    'Tier 1 Support Agent',
    'Senior Operations Specialist',
    'Support Team Lead / Supervisor'
  ];

  const statuses: { label: string; value: AgentStatus; color: string }[] = [
    { label: 'Available', value: 'Available', color: 'bg-emerald-500' },
    { label: 'In Call', value: 'In Call', color: 'bg-amber-500' },
    { label: 'Wrap-up', value: 'Wrap-up', color: 'bg-indigo-500' },
    { label: 'Break', value: 'Break', color: 'bg-orange-500' },
    { label: 'Offline', value: 'Offline', color: 'bg-slate-400' }
  ];

  const currentStatusObj = statuses.find(s => s.value === currentUserAgent.status) || statuses[0];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 py-2.5 transition-all">
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Mobile hamburger & Global Search */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              onClick={onToggleSidebarMobile}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search */}
            <div className="relative w-full" ref={searchRef}>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder="Search case ID, customer, fleet company, or category..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-400 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              {/* Search Dropdown */}
              {showSearchResults && searchMatches.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                    Matching Cases ({searchMatches.length})
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {searchMatches.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchQuery('');
                          navigate(`/workspace/${c.id}`);
                        }}
                        className="p-2.5 hover:bg-indigo-50/60 cursor-pointer transition flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-indigo-600">{c.id}</span>
                            <span className="font-medium text-slate-800">{c.customer.name}</span>
                            <span className="text-[11px] text-slate-400 font-normal">({c.customer.company})</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">{c.title}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          c.priority === 'Critical' ? 'bg-rose-100 text-rose-700 font-bold' :
                          c.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {c.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Role, Status, Simulate Call, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-xs font-medium transition"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Role:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[140px]">{currentRole}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Switch Demo Persona
                  </div>
                  {roles.map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        setCurrentRole(r);
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50 transition"
                    >
                      <span className={r === currentRole ? 'font-bold text-indigo-600' : 'text-slate-700'}>
                        {r}
                      </span>
                      {r === currentRole && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Agent Live Status Selector */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium transition"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${currentStatusObj.color} animate-pulse`} />
                <span className="text-slate-700 font-semibold">{currentStatusObj.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showStatusDropdown && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Change Staff Status
                  </div>
                  {statuses.map(s => (
                    <button
                      key={s.value}
                      onClick={() => {
                        updateCurrentUserStatus(s.value);
                        setShowStatusDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-50 transition"
                    >
                      <span className={`w-2 h-2 rounded-full ${s.color}`} />
                      <span className={s.value === currentUserAgent.status ? 'font-bold text-slate-900' : 'text-slate-600'}>
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Simulate Call Button */}
            <button
              onClick={() => setIsSimulateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-semibold shadow-sm shadow-indigo-200 transition"
              title="Simulate Inbound Call"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden sm:inline">Simulate Call</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition relative"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-900">Live Operation Alerts</span>
                    <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                      {metrics.criticalCasesCount} Critical
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-rose-50 rounded-lg border border-rose-100">
                      <p className="font-bold text-rose-900 text-[11px]">SLA Urgency Alert</p>
                      <p className="text-rose-700 text-[11px] mt-0.5">CAS-8901 (Apex Metro) is approaching Tier 1 SLA window.</p>
                      <span className="text-[10px] text-rose-500 font-mono mt-1 block">14m remaining</span>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                      <p className="font-bold text-amber-900 text-[11px]">VIP Account Activity</p>
                      <p className="text-amber-700 text-[11px] mt-0.5">FreshChill BioLogistics sensor heartbeat dropped.</p>
                      <span className="text-[10px] text-amber-500 font-mono mt-1 block">Queue wait: 6m</span>
                    </div>
                    <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                      <p className="font-bold text-indigo-900 text-[11px]">AI Copilot Engine v2.4</p>
                      <p className="text-indigo-700 text-[11px] mt-0.5">Deterministic rules engine actively evaluating transcripts.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Data Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data to default baseline?')) {
                  resetToDefaults();
                }
              }}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Agent Avatar Badge - Venkat Kishor (VK) */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-800 text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-indigo-500/30 shadow-sm tracking-tight select-none">
                  VK
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="hidden xl:block text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-800 leading-tight">Venkat Kishor</p>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">VK</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight font-medium">{currentUserAgent.department}</p>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Simulate Call Modal */}
      <SimulateCallModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
      />
    </>
  );
};
