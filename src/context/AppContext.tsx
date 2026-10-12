import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SupportCase, 
  Agent, 
  UserRole, 
  CaseStatus, 
  PriorityLevel, 
  AgentStatus, 
  FollowUpSchedule, 
  ToastMessage,
  DailyMetricPoint,
  IssueCategory
} from '../types';
import { INITIAL_CASES, INITIAL_AGENTS, INITIAL_DAILY_METRICS } from '../data/mockData';
import { generateAiSuggestions } from '../utils/aiEngine';

interface AppContextType {
  cases: SupportCase[];
  agents: Agent[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUserAgent: Agent;
  updateCurrentUserStatus: (status: AgentStatus) => void;
  updateAgentStatus: (agentId: string, status: AgentStatus) => void;
  updateCaseStatus: (caseId: string, status: CaseStatus) => void;
  updateCasePriority: (caseId: string, priority: PriorityLevel) => void;
  reassignCase: (caseId: string, newAgentId: string) => void;
  addCaseMessage: (caseId: string, text: string, sender?: 'customer' | 'agent') => void;
  addInternalNote: (caseId: string, text: string, isPinned?: boolean) => void;
  deleteInternalNote: (caseId: string, noteId: string) => void;
  resolveCase: (caseId: string, resolutionNotes: string) => void;
  scheduleFollowUp: (caseId: string, followUpData: {
    scheduledDate: string;
    scheduledTime: string;
    method: FollowUpSchedule['method'];
    notes: string;
    assignedAgent: string;
  }) => void;
  completeFollowUp: (caseId: string) => void;
  addNewSimulatedCase: (customCase?: Partial<SupportCase>) => SupportCase;
  resetToDefaults: () => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Computed metrics
  metrics: {
    totalCallsHandled: number;
    openCases: number;
    resolvedCases: number;
    avgHandlingTimeMin: number;
    availableAgents: number;
    totalAgents: number;
    criticalCasesCount: number;
    slaBreachRiskCount: number;
  };
  dailyMetrics: DailyMetricPoint[];
}

const STORAGE_KEY_CASES = 'onground_callops_cases_v3';
const STORAGE_KEY_AGENTS = 'onground_callops_agents_v3';
const STORAGE_KEY_ROLE = 'onground_callops_role_v3';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Cases State
  const [cases, setCases] = useState<SupportCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CASES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load cases from localStorage', e);
    }
    return INITIAL_CASES;
  });

  // 2. Agents State
  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AGENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure agt-1 is updated to Venkat Kishor if loaded from previous cache
        return parsed.map((a: Agent) => a.id === 'agt-1' ? {
          ...a,
          name: 'Venkat Kishor',
          email: 'venkat.kishor@onground.ai',
          role: 'Senior Operations Specialist (You)'
        } : a);
      }
    } catch (e) {
      console.error('Failed to load agents from localStorage', e);
    }
    return INITIAL_AGENTS;
  });

  // 3. User Role State
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROLE);
      if (saved) return saved as UserRole;
    } catch {
      // fallback
    }
    return 'Senior Operations Specialist';
  });

  // 4. Current user is Venkat Kishor (id: agt-1)
  const currentUserAgent = agents.find(a => a.id === 'agt-1') || agents[0];

  // 5. Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, title, message, type, timestamp: Date.now() }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auto-dismiss toasts after 4 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setInterval(() => {
      const now = Date.now();
      setToasts(prev => prev.filter(t => now - t.timestamp < 4000));
    }, 1000);
    return () => clearInterval(timer);
  }, [toasts.length]);

  // Persist Cases to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(cases));
    } catch (e) {
      console.error('Could not save cases', e);
    }
  }, [cases]);

  // Persist Agents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify(agents));
    } catch (e) {
      console.error('Could not save agents', e);
    }
  }, [agents]);

  // Persist Role
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, currentRole);
    } catch (e) {
      console.error('Could not save role', e);
    }
  }, [currentRole]);

  // Actions
  const updateCurrentUserStatus = (status: AgentStatus) => {
    setAgents(prev => prev.map(a => a.id === currentUserAgent.id ? { ...a, status } : a));
    addToast('Agent Status Updated', `Your status is now set to ${status}.`, 'info');
  };

  const updateAgentStatus = (agentId: string, status: AgentStatus) => {
    const target = agents.find(a => a.id === agentId);
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status } : a));
    if (target) {
      addToast('Team Status Updated', `${target.name} is now ${status}.`, 'info');
    }
  };

  const updateCaseStatus = (caseId: string, newStatus: CaseStatus) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      const isResolvedOrClosed = newStatus === 'Resolved' || newStatus === 'Closed';
      const updatedCase: SupportCase = {
        ...c,
        status: newStatus,
        slaDue: isResolvedOrClosed ? 'Resolved' : (c.slaDue === 'Resolved' ? '25 mins remaining' : c.slaDue),
        resolvedAt: isResolvedOrClosed ? (c.resolvedAt || new Date().toISOString()) : undefined,
        resolvedBy: isResolvedOrClosed ? (c.resolvedBy || currentUserAgent.name) : undefined,
      };
      // Regenerate deterministic AI suggestions based on updated state
      updatedCase.aiInsights = generateAiSuggestions(updatedCase);
      return updatedCase;
    }));

    addToast('Case Status Changed', `Case ${caseId} status updated to "${newStatus}".`, 'success');
  };

  const updateCasePriority = (caseId: string, newPriority: PriorityLevel) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      const updatedCase: SupportCase = { ...c, priority: newPriority };
      updatedCase.aiInsights = generateAiSuggestions(updatedCase);
      return updatedCase;
    }));

    addToast('Priority Adjusted', `Case ${caseId} set to priority "${newPriority}".`, 'warning');
  };

  const reassignCase = (caseId: string, newAgentId: string) => {
    const targetAgent = agents.find(a => a.id === newAgentId);
    if (!targetAgent) return;

    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        assignedAgentId: targetAgent.id,
        assignedAgentName: targetAgent.name
      };
    }));

    addToast('Case Reassigned', `Case ${caseId} successfully assigned to ${targetAgent.name}.`, 'info');
  };

  const addCaseMessage = (caseId: string, text: string, sender: 'customer' | 'agent' = 'agent') => {
    if (!text.trim()) return;

    const newMessage = {
      id: 'msg-' + Date.now(),
      sender,
      senderName: sender === 'agent' ? currentUserAgent.name : 'Customer',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentiment: 'neutral' as const
    };

    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      const newTranscript = [...c.transcript, newMessage];
      const updatedCase: SupportCase = {
        ...c,
        transcript: newTranscript
      };
      // AI re-analyzes message keywords
      updatedCase.aiInsights = generateAiSuggestions(updatedCase);
      return updatedCase;
    }));

    addToast('Message Sent', 'Your reply has been sent and logged in conversation history.', 'success');
  };

  const addInternalNote = (caseId: string, text: string, isPinned = false) => {
    if (!text.trim()) return;

    const newNote = {
      id: 'note-' + Date.now(),
      author: currentUserAgent.name,
      authorRole: currentRole,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPinned
    };

    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        internalNotes: [newNote, ...c.internalNotes]
      };
    }));

    addToast('Note Added', 'Internal staff note securely saved.', 'success');
  };

  const deleteInternalNote = (caseId: string, noteId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        internalNotes: c.internalNotes.filter(n => n.id !== noteId)
      };
    }));

    addToast('Note Deleted', 'Internal note removed.', 'info');
  };

  const resolveCase = (caseId: string, resolutionNotes: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      const updated: SupportCase = {
        ...c,
        status: 'Resolved',
        resolutionNotes,
        resolvedAt: new Date().toISOString(),
        resolvedBy: currentUserAgent.name,
        slaDue: 'Resolved'
      };
      updated.aiInsights = generateAiSuggestions(updated);
      return updated;
    }));

    // Increment agent resolved count
    setAgents(prev => prev.map(a => a.id === currentUserAgent.id ? { ...a, resolvedToday: a.resolvedToday + 1 } : a));

    addToast('Case Resolved', `Case ${caseId} marked as Resolved and resolution summary archived.`, 'success');
  };

  const scheduleFollowUp = (caseId: string, followUpData: {
    scheduledDate: string;
    scheduledTime: string;
    method: FollowUpSchedule['method'];
    notes: string;
    assignedAgent: string;
  }) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        status: c.status === 'Resolved' ? c.status : 'Pending Follow-up',
        followUp: {
          ...followUpData,
          completed: false
        }
      };
    }));

    addToast('Follow-up Scheduled', `Follow-up set for ${followUpData.scheduledDate} at ${followUpData.scheduledTime}.`, 'info');
  };

  const completeFollowUp = (caseId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId || !c.followUp) return c;
      return {
        ...c,
        followUp: {
          ...c.followUp,
          completed: true,
          completedAt: new Date().toISOString()
        }
      };
    }));

    addToast('Follow-up Completed', `Follow-up marked as fulfilled.`, 'success');
  };

  const addNewSimulatedCase = (customCase?: Partial<SupportCase>): SupportCase => {
    const nextNum = Math.floor(8909 + Math.random() * 900);
    const id = `CAS-${nextNum}`;
    
    const sampleCategories: IssueCategory[] = [
      'Technical & API Outage',
      'Hardware & Telematics',
      'Billing & Invoicing',
      'On-Ground Logistics',
      'Account & Access'
    ];
    const category = customCase?.category || sampleCategories[Math.floor(Math.random() * sampleCategories.length)];
    const priority: PriorityLevel = customCase?.priority || (Math.random() > 0.6 ? 'Critical' : 'High');

    const customerNames = [
      { name: 'Diana Prince', comp: 'Gotham Express Couriers', email: 'diana@gothamexp.com', phone: '+1 (555) 309-8811', tier: 'Enterprise VIP' as const },
      { name: 'Carlos Mendez', comp: 'Pacific Route Logistics', email: 'carlos@pacificroute.net', phone: '+1 (555) 772-4910', tier: 'Growth Corporate' as const },
      { name: 'Samantha Wu', comp: 'HyperHaul Dynamics', email: 's.wu@hyperhaul.io', phone: '+1 (555) 618-9220', tier: 'Enterprise VIP' as const },
      { name: 'Vikram Mehta', comp: 'Apex Metro Fleet Solutions', email: 'v.mehta@apexmetro.com', phone: '+1 (555) 234-8905', tier: 'Enterprise VIP' as const },
    ];
    const chosenCust = customerNames[Math.floor(Math.random() * customerNames.length)];

    const newCase: SupportCase = {
      id,
      title: customCase?.title || `Live Dispatch Alert: Sensor telemetry sync variance on Sector 4`,
      customer: {
        id: `CUST-${Math.floor(1010 + Math.random() * 50)}`,
        name: chosenCust.name,
        company: chosenCust.comp,
        email: chosenCust.email,
        phone: chosenCust.phone,
        location: 'Austin, TX',
        tier: chosenCust.tier,
        accountSince: 'Jan 2024',
        lifetimeValue: '$92,000 / yr',
        satisfactionScore: 85,
        totalTicketsCount: 6,
        openTicketsCount: 1,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      },
      category,
      priority,
      status: 'Open',
      channel: 'Voice Call',
      assignedAgentId: currentUserAgent.id,
      assignedAgentName: currentUserAgent.name,
      waitingTimeMinutes: 1,
      handlingDurationMinutes: 0,
      createdAt: new Date().toISOString(),
      slaDue: '15 mins remaining',
      isSlaBreached: false,
      transcript: [
        {
          id: 'msg-sim-1',
          sender: 'customer',
          senderName: chosenCust.name,
          text: `Hello, this is ${chosenCust.name}. We just had our dispatch dashboard flag an alert on our route fleet telematics. Need immediate support!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sentiment: 'frustrated'
        }
      ],
      internalNotes: [
        {
          id: 'note-sim-1',
          author: 'System Bot',
          authorRole: 'Automated Routing',
          text: 'Incoming voice call connected to agent queue. Customer identity verified via caller ID.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      aiInsights: generateAiSuggestions({
        category,
        priority,
        title: `Live Dispatch Alert: Sensor telemetry sync variance on Sector 4`,
        customer: {
          id: 'CUST-NEW',
          name: chosenCust.name,
          company: chosenCust.comp,
          email: chosenCust.email,
          phone: chosenCust.phone,
          location: 'Austin, TX',
          tier: chosenCust.tier,
          accountSince: 'Jan 2024',
          lifetimeValue: '$92,000 / yr',
          satisfactionScore: 85,
          totalTicketsCount: 6,
          openTicketsCount: 1
        },
        transcript: [
          { id: '1', sender: 'customer', senderName: chosenCust.name, text: 'urgent alert sensor sync variance call', timestamp: 'now' }
        ]
      })
    };

    setCases(prev => [newCase, ...prev]);
    addToast('🚨 Incoming Call Simulated', `New case ${newCase.id} queued from ${chosenCust.comp} (${chosenCust.name}).`, 'warning');
    return newCase;
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY_CASES);
    localStorage.removeItem(STORAGE_KEY_AGENTS);
    localStorage.removeItem(STORAGE_KEY_ROLE);
    localStorage.removeItem('onground_callops_cases_v2');
    localStorage.removeItem('onground_callops_agents_v2');
    localStorage.removeItem('onground_callops_role_v2');
    setCases(INITIAL_CASES);
    setAgents(INITIAL_AGENTS);
    setCurrentRole('Senior Operations Specialist');
    addToast('Data Reset', 'All demo data has been reset to default state.', 'info');
  };

  // Computed Metrics
  const openCases = cases.filter(c => c.status === 'Open' || c.status === 'In Progress' || c.status === 'Escalated' || c.status === 'Pending Follow-up').length;
  const resolvedCases = cases.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const totalCallsHandled = 84 + cases.length; // baseline today + dynamic
  
  const handlingTimes = cases.map(c => c.handlingDurationMinutes).filter(t => t > 0);
  const avgHandlingTimeMin = handlingTimes.length > 0 
    ? Number((handlingTimes.reduce((acc, v) => acc + v, 0) / handlingTimes.length).toFixed(1))
    : 4.6;

  const availableAgents = agents.filter(a => a.status === 'Available').length;
  const criticalCasesCount = cases.filter(c => c.priority === 'Critical' && c.status !== 'Resolved' && c.status !== 'Closed').length;
  const slaBreachRiskCount = cases.filter(c => (c.priority === 'Critical' || c.priority === 'High') && c.status !== 'Resolved' && c.status !== 'Closed').length;

  // Dynamically reflect current day's volume & resolutions in daily performance charts
  const dynamicDailyMetrics = INITIAL_DAILY_METRICS.map((d, index) => {
    if (index === INITIAL_DAILY_METRICS.length - 1) {
      return {
        ...d,
        totalCalls: totalCallsHandled,
        resolvedCases: 76 + resolvedCases,
        avgHandlingMinutes: avgHandlingTimeMin,
      };
    }
    return d;
  });

  return (
    <AppContext.Provider
      value={{
        cases,
        agents,
        currentRole,
        setCurrentRole,
        currentUserAgent,
        updateCurrentUserStatus,
        updateAgentStatus,
        updateCaseStatus,
        updateCasePriority,
        reassignCase,
        addCaseMessage,
        addInternalNote,
        deleteInternalNote,
        resolveCase,
        scheduleFollowUp,
        completeFollowUp,
        addNewSimulatedCase,
        resetToDefaults,
        toasts,
        addToast,
        removeToast,
        metrics: {
          totalCallsHandled,
          openCases,
          resolvedCases,
          avgHandlingTimeMin,
          availableAgents,
          totalAgents: agents.length,
          criticalCasesCount,
          slaBreachRiskCount
        },
        dailyMetrics: dynamicDailyMetrics
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
