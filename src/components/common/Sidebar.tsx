import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  ListOrdered, 
  Headphones, 
  BarChart3, 
  Bot, 
  Radio, 
  X,
  Sparkles,
  Layers,
  HeartHandshake
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { cases, currentUserAgent, metrics } = useApp();

  // Find most recent active case for workspace link
  const activeCase = cases.find(c => c.status !== 'Resolved' && c.status !== 'Closed') || cases[0];
  const activeCasePath = activeCase ? `/workspace/${activeCase.id}` : '/queue';

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Call Queue',
      path: '/queue',
      icon: ListOrdered,
      badge: metrics.openCases > 0 ? metrics.openCases : null,
      badgeColor: 'bg-indigo-600 text-white'
    },
    {
      name: 'Customer Workspace',
      path: activeCasePath,
      icon: Headphones,
      badge: 'Active',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      name: 'Team & Analytics',
      path: '/analytics',
      icon: BarChart3,
      badge: null
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800 w-64 select-none">
      
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">OnGround</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">CallOps Operations</p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Workspaces
        </p>

        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-indigo-700/80 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* AI Copilot Status Banner */}
        <div className="pt-6">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-800/80 border border-indigo-800/40 text-xs">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI Guidance Engine</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Deterministic SOP assistant analyzing live sentiment & resolution paths.
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active v2.4
              </span>
              <span className="text-cyan-400 font-semibold">Rules Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shift Overview Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-indigo-400/40 shadow-md tracking-wider select-none">
              VK
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-white truncate">Venkat Kishor</p>
              <span className="text-[9px] font-extrabold px-1 py-0.2 bg-indigo-500/30 text-indigo-300 rounded border border-indigo-400/40">VK</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{currentUserAgent.status} • Lead</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-center">
          <div className="bg-slate-800/40 rounded-lg p-1.5">
            <span className="text-[10px] text-slate-400 block">Calls Today</span>
            <span className="text-xs font-bold text-white">{currentUserAgent.callsHandledToday}</span>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-1.5">
            <span className="text-[10px] text-slate-400 block">CSAT Rating</span>
            <span className="text-xs font-bold text-amber-400">{currentUserAgent.csatRating} ★</span>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 max-w-xs w-full animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
