import { Agent, SupportCase, DailyMetricPoint } from '../types';
import { generateAiSuggestions } from '../utils/aiEngine';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agt-1',
    name: 'Venkat Kishor',
    email: 'venkat.kishor@onground.ai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Senior Operations Specialist (You)',
    status: 'Available',
    department: 'Technical & Telematics',
    callsHandledToday: 18,
    resolvedToday: 15,
    avgHandlingTimeMin: 4.2,
    csatRating: 4.9,
    activeCaseId: 'CAS-8902'
  },
  {
    id: 'agt-2',
    name: 'Marcus Vance',
    email: 'marcus.vance@onground.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Senior Operations Specialist',
    status: 'In Call',
    department: 'Enterprise Logistics',
    callsHandledToday: 14,
    resolvedToday: 11,
    avgHandlingTimeMin: 5.6,
    csatRating: 4.8,
    activeCaseId: 'CAS-8901'
  },
  {
    id: 'agt-3',
    name: 'Aisha Al-Mansoor',
    email: 'aisha.m@onground.ai',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'Support Team Lead',
    status: 'Available',
    department: 'Escalations & VIP',
    callsHandledToday: 9,
    resolvedToday: 8,
    avgHandlingTimeMin: 6.8,
    csatRating: 4.95,
  },
  {
    id: 'agt-4',
    name: 'David Chen',
    email: 'david.chen@onground.ai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Tier 1 Support Agent',
    status: 'Wrap-up',
    department: 'Billing & Invoicing',
    callsHandledToday: 21,
    resolvedToday: 19,
    avgHandlingTimeMin: 3.9,
    csatRating: 4.7,
    activeCaseId: 'CAS-8904'
  },
  {
    id: 'agt-5',
    name: 'Elena Rostova',
    email: 'elena.rostova@onground.ai',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'Customer Success Specialist',
    status: 'Break',
    department: 'Retention & Account Access',
    callsHandledToday: 12,
    resolvedToday: 10,
    avgHandlingTimeMin: 5.1,
    csatRating: 4.85,
  },
  {
    id: 'agt-6',
    name: 'Liam O’Connor',
    email: 'liam.oconnor@onground.ai',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Field Engineer Support',
    status: 'Offline',
    department: 'Hardware & Telematics',
    callsHandledToday: 7,
    resolvedToday: 6,
    avgHandlingTimeMin: 7.4,
    csatRating: 4.6,
  }
];

export const INITIAL_CASES: SupportCase[] = [
  {
    id: 'CAS-8901',
    title: 'Production Gateway 504 Timeouts on Live Vehicle Telemetry Webhooks',
    customer: {
      id: 'CUST-1001',
      name: 'Sarah Jenkins',
      company: 'Apex Metro Fleet Solutions',
      email: 's.jenkins@apexmetro.com',
      phone: '+1 (555) 234-8901',
      location: 'Chicago, IL',
      tier: 'Enterprise VIP',
      accountSince: 'Nov 2023',
      lifetimeValue: '$148,000 / yr',
      satisfactionScore: 78,
      totalTicketsCount: 14,
      openTicketsCount: 1,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
    },
    category: 'Technical & API Outage',
    priority: 'Critical',
    status: 'Escalated',
    channel: 'Voice Call',
    assignedAgentId: 'agt-2',
    assignedAgentName: 'Marcus Vance',
    waitingTimeMinutes: 2,
    handlingDurationMinutes: 11,
    createdAt: '2026-10-12T09:15:00Z',
    slaDue: '14 mins remaining',
    isSlaBreached: false,
    transcript: [
      {
        id: 'msg-1',
        sender: 'system',
        senderName: 'IVR Dispatch',
        text: 'Caller routed to Enterprise Tier 1 queue. Selected prompt: Critical API Outage.',
        timestamp: '09:15 AM'
      },
      {
        id: 'msg-2',
        sender: 'customer',
        senderName: 'Sarah Jenkins',
        text: 'Hello, our operations dispatch dashboard just went completely red. We have over 140 delivery vans on the road right now and our server logs show 504 Gateway Timeouts from your onground.api/v2/telemetry endpoint!',
        timestamp: '09:16 AM',
        sentiment: 'critical'
      },
      {
        id: 'msg-3',
        sender: 'agent',
        senderName: 'Marcus Vance',
        text: 'Good morning Sarah, I understand the severity of this. Let me pull up your tenant gateway health for Apex Metro right now. Can you confirm if you are seeing errors on both primary and backup webhooks?',
        timestamp: '09:17 AM',
        sentiment: 'neutral'
      },
      {
        id: 'msg-4',
        sender: 'customer',
        senderName: 'Sarah Jenkins',
        text: 'Yes! Both endpoints are failing. Our drivers cannot confirm delivery packages, and our corporate clients are already escalating. If this is down for another 30 minutes we face SLA penalties from our clients!',
        timestamp: '09:19 AM',
        sentiment: 'frustrated'
      }
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'Marcus Vance',
        authorRole: 'Senior Operations Specialist',
        text: 'Checked Datadog: US-East cluster experiencing high TCP connection pool saturation. Escalated to SRE On-call engineer (Dave K).',
        timestamp: '09:21 AM',
        isPinned: true
      }
    ],
    followUp: {
      scheduledDate: '2026-10-12',
      scheduledTime: '11:00',
      method: 'Phone Call',
      notes: 'Post-incident SLA health check and root-cause analysis debrief with Sarah.',
      assignedAgent: 'Marcus Vance',
      completed: false
    },
    aiInsights: generateAiSuggestions({
      category: 'Technical & API Outage',
      priority: 'Critical',
      title: 'Production Gateway 504 Timeouts on Live Vehicle Telemetry Webhooks',
      customer: {
        id: 'CUST-1001',
        name: 'Sarah Jenkins',
        company: 'Apex Metro Fleet Solutions',
        email: 's.jenkins@apexmetro.com',
        phone: '+1 (555) 234-8901',
        location: 'Chicago, IL',
        tier: 'Enterprise VIP',
        accountSince: 'Nov 2023',
        lifetimeValue: '$148,000 / yr',
        satisfactionScore: 78,
        totalTicketsCount: 14,
        openTicketsCount: 1
      },
      transcript: [
        { id: '1', sender: 'customer', senderName: 'Sarah', text: 'outage down 504 gateway timeout cancel sla penalty urgent', timestamp: 'now' }
      ]
    })
  },
  {
    id: 'CAS-8902',
    title: 'Disputed Overcharge on Regional Roaming SIM Telematics Invoicing',
    customer: {
      id: 'CUST-1002',
      name: 'Michael Rivera',
      company: 'TransCoast Haulage',
      email: 'm.rivera@transcoasthawl.com',
      phone: '+1 (555) 872-3341',
      location: 'Dallas, TX',
      tier: 'Growth Corporate',
      accountSince: 'Jan 2024',
      lifetimeValue: '$62,400 / yr',
      satisfactionScore: 84,
      totalTicketsCount: 8,
      openTicketsCount: 1,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80'
    },
    category: 'Billing & Invoicing',
    priority: 'High',
    status: 'In Progress',
    channel: 'Voice Call',
    assignedAgentId: 'agt-1',
    assignedAgentName: 'Venkat Kishor',
    waitingTimeMinutes: 4,
    handlingDurationMinutes: 6,
    createdAt: '2026-10-12T09:40:00Z',
    slaDue: '32 mins remaining',
    isSlaBreached: false,
    transcript: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Michael Rivera',
        text: 'Hi Venkat, I am reviewing our September statement #INV-99214. We were billed $1,420 in satellite roaming surcharge, but our contract explicitly states interstate roaming is capped at $400 flat.',
        timestamp: '09:41 AM',
        sentiment: 'frustrated'
      },
      {
        id: 'msg-2',
        sender: 'agent',
        senderName: 'Venkat Kishor',
        text: 'Hello Michael, thank you for checking with us. Let me pull up your Master Service Agreement addendum regarding multi-state telemetry coverage.',
        timestamp: '09:43 AM',
        sentiment: 'neutral'
      },
      {
        id: 'msg-3',
        sender: 'customer',
        senderName: 'Michael Rivera',
        text: 'Please do. Our accounting dept will pause automated payments on Friday if this is not reconciled or credited.',
        timestamp: '09:45 AM',
        sentiment: 'frustrated'
      }
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'Venkat Kishor',
        authorRole: 'Senior Operations Specialist',
        text: 'Checked billing audit: Carrier rate card had a configuration flag set to standard commercial rather than preferred fleet tier. Difference is exactly $1,020.',
        timestamp: '09:47 AM'
      }
    ],
    aiInsights: generateAiSuggestions({
      category: 'Billing & Invoicing',
      priority: 'High',
      title: 'Disputed Overcharge on Regional Roaming SIM Telematics Invoicing',
      customer: {
        id: 'CUST-1002',
        name: 'Michael Rivera',
        company: 'TransCoast Haulage',
        email: 'm.rivera@transcoasthawl.com',
        phone: '+1 (555) 872-3341',
        location: 'Dallas, TX',
        tier: 'Growth Corporate',
        accountSince: 'Jan 2024',
        lifetimeValue: '$62,400 / yr',
        satisfactionScore: 84,
        totalTicketsCount: 8,
        openTicketsCount: 1
      },
      transcript: [
        { id: '1', sender: 'customer', senderName: 'Michael', text: 'disputed overcharge refund invoice pause payment', timestamp: 'now' }
      ]
    })
  },
  {
    id: 'CAS-8903',
    title: 'Fleet Tracker Unit Heartbeat Lost on Refrigerated Cargo Trailers',
    customer: {
      id: 'CUST-1003',
      name: 'Amara Okafor',
      company: 'FreshChill BioLogistics',
      email: 'a.okafor@freshchillbio.com',
      phone: '+1 (555) 441-9022',
      location: 'Atlanta, GA',
      tier: 'Enterprise VIP',
      accountSince: 'Aug 2022',
      lifetimeValue: '$210,000 / yr',
      satisfactionScore: 92,
      totalTicketsCount: 19,
      openTicketsCount: 2,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    category: 'Hardware & Telematics',
    priority: 'Critical',
    status: 'Open',
    channel: 'Voice Call',
    assignedAgentId: 'agt-1',
    assignedAgentName: 'Venkat Kishor',
    waitingTimeMinutes: 6,
    handlingDurationMinutes: 0,
    createdAt: '2026-10-12T09:50:00Z',
    slaDue: '8 mins remaining',
    isSlaBreached: false,
    transcript: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Amara Okafor',
        text: 'Urgent! Three of our refrigerated pharma containers traveling along I-75 have stopped streaming cold-chain temperature telemetry! The temperature must stay under -20C.',
        timestamp: '09:50 AM',
        sentiment: 'critical'
      }
    ],
    internalNotes: [],
    aiInsights: generateAiSuggestions({
      category: 'Hardware & Telematics',
      priority: 'Critical',
      title: 'Fleet Tracker Unit Heartbeat Lost on Refrigerated Cargo Trailers',
      customer: {
        id: 'CUST-1003',
        name: 'Amara Okafor',
        company: 'FreshChill BioLogistics',
        email: 'a.okafor@freshchillbio.com',
        phone: '+1 (555) 441-9022',
        location: 'Atlanta, GA',
        tier: 'Enterprise VIP',
        accountSince: 'Aug 2022',
        lifetimeValue: '$210,000 / yr',
        satisfactionScore: 92,
        totalTicketsCount: 19,
        openTicketsCount: 2
      },
      transcript: [
        { id: '1', sender: 'customer', senderName: 'Amara', text: 'urgent sensor telematics temperature signal lost', timestamp: 'now' }
      ]
    })
  },
  {
    id: 'CAS-8904',
    title: 'Executive MFA Reset Request Following Mobile Phone Loss',
    customer: {
      id: 'CUST-1004',
      name: 'Robert Thornton',
      company: 'Zenith Logistics Global',
      email: 'r.thornton@zenithlog.com',
      phone: '+1 (555) 671-1209',
      location: 'New York, NY',
      tier: 'Standard Pro',
      accountSince: 'Mar 2024',
      lifetimeValue: '$34,000 / yr',
      satisfactionScore: 90,
      totalTicketsCount: 4,
      openTicketsCount: 1,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
    },
    category: 'Account & Access',
    priority: 'Medium',
    status: 'In Progress',
    channel: 'Live Chat',
    assignedAgentId: 'agt-4',
    assignedAgentName: 'David Chen',
    waitingTimeMinutes: 3,
    handlingDurationMinutes: 8,
    createdAt: '2026-10-12T09:25:00Z',
    slaDue: '45 mins remaining',
    isSlaBreached: false,
    transcript: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Robert Thornton',
        text: 'Lost my company phone at LGA airport this morning. I cannot authenticate into the OnGround Staff portal to review our driver schedules.',
        timestamp: '09:26 AM'
      },
      {
        id: 'msg-2',
        sender: 'agent',
        senderName: 'David Chen',
        text: 'Hi Robert, I can certainly assist with resetting your authenticator device after verifying your corporate credentials.',
        timestamp: '09:28 AM'
      }
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'David Chen',
        authorRole: 'Tier 1 Support Agent',
        text: 'Identity verified against registered backup corporate domain email.',
        timestamp: '09:31 AM'
      }
    ],
    aiInsights: generateAiSuggestions({
      category: 'Account & Access',
      priority: 'Medium',
      title: 'Executive MFA Reset Request Following Mobile Phone Loss',
      customer: {
        id: 'CUST-1004',
        name: 'Robert Thornton',
        company: 'Zenith Logistics Global',
        email: 'r.thornton@zenithlog.com',
        phone: '+1 (555) 671-1209',
        location: 'New York, NY',
        tier: 'Standard Pro',
        accountSince: 'Mar 2024',
        lifetimeValue: '$34,000 / yr',
        satisfactionScore: 90,
        totalTicketsCount: 4,
        openTicketsCount: 1
      },
      transcript: []
    })
  },
  {
    id: 'CAS-8905',
    title: 'Delivery Geofence Trigger Delayed on Downtown Micro-Hub Route',
    customer: {
      id: 'CUST-1005',
      name: 'Jessica Gomez',
      company: 'UrbanQuick Courier',
      email: 'jess.g@urbanquick.io',
      phone: '+1 (555) 319-4820',
      location: 'San Francisco, CA',
      tier: 'Growth Corporate',
      accountSince: 'Jun 2023',
      lifetimeValue: '$74,500 / yr',
      satisfactionScore: 88,
      totalTicketsCount: 11,
      openTicketsCount: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80'
    },
    category: 'On-Ground Logistics',
    priority: 'Medium',
    status: 'Resolved',
    channel: 'Support Email',
    assignedAgentId: 'agt-1',
    assignedAgentName: 'Venkat Kishor',
    waitingTimeMinutes: 0,
    handlingDurationMinutes: 14,
    createdAt: '2026-10-12T08:00:00Z',
    slaDue: 'Resolved',
    isSlaBreached: false,
    transcript: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Jessica Gomez',
        text: 'Drivers are arriving at delivery drop-offs but the app takes 90 seconds to register they entered the polygon geofence.',
        timestamp: '08:01 AM'
      },
      {
        id: 'msg-2',
        sender: 'agent',
        senderName: 'Venkat Kishor',
        text: 'Hello Jessica, I adjusted your polygon geofence buffer radius to 25 meters in tenant settings. This prevents GPS drift latency in dense urban high-rise areas.',
        timestamp: '08:12 AM'
      },
      {
        id: 'msg-3',
        sender: 'customer',
        senderName: 'Jessica Gomez',
        text: 'That worked immediately! All 8 drivers tested and it auto-completes instantly. Thank you so much!',
        timestamp: '08:14 AM',
        sentiment: 'positive'
      }
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'Venkat Kishor',
        authorRole: 'Senior Operations Specialist',
        text: 'Applied urban canyon geofence preset config #SF-DOWNTOWN.',
        timestamp: '08:13 AM'
      }
    ],
    resolutionNotes: 'Adjusted geofence tolerance radius from 10m to 25m to counteract GPS multipath interference in high-rise corridors. Verified live driver completion timestamps.',
    resolvedAt: '2026-10-12T08:15:00Z',
    resolvedBy: 'Venkat Kishor',
    aiInsights: generateAiSuggestions({
      category: 'On-Ground Logistics',
      priority: 'Medium',
      title: 'Delivery Geofence Trigger Delayed on Downtown Micro-Hub Route',
      customer: {
        id: 'CUST-1005',
        name: 'Jessica Gomez',
        company: 'UrbanQuick Courier',
        email: 'jess.g@urbanquick.io',
        phone: '+1 (555) 319-4820',
        location: 'San Francisco, CA',
        tier: 'Growth Corporate',
        accountSince: 'Jun 2023',
        lifetimeValue: '$74,500 / yr',
        satisfactionScore: 88,
        totalTicketsCount: 11,
        openTicketsCount: 0
      },
      transcript: [{ id: '1', sender: 'customer', senderName: 'Jessica', text: 'thank you that worked immediately', timestamp: 'now' }]
    })
  },
  {
    id: 'CAS-8906',
    title: 'Customer Threatening Contract Termination Over Repeated Integration Latency',
    customer: {
      id: 'CUST-1006',
      name: 'Arthur Pendelton',
      company: 'Vanguard Freightliners',
      email: 'a.pendelton@vanguardfreight.com',
      phone: '+1 (555) 902-1823',
      location: 'Philadelphia, PA',
      tier: 'Enterprise VIP',
      accountSince: 'Feb 2023',
      lifetimeValue: '$180,000 / yr',
      satisfactionScore: 42,
      totalTicketsCount: 22,
      openTicketsCount: 2,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
    },
    category: 'Service Cancellation',
    priority: 'Critical',
    status: 'Pending Follow-up',
    channel: 'Voice Call',
    assignedAgentId: 'agt-3',
    assignedAgentName: 'Aisha Al-Mansoor',
    waitingTimeMinutes: 1,
    handlingDurationMinutes: 18,
    createdAt: '2026-10-12T08:45:00Z',
    slaDue: 'Action Required',
    isSlaBreached: false,
    transcript: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Arthur Pendelton',
        text: 'This is the third time this quarter our dispatcher sync has crashed during morning shift shift. We are paying six figures annually and our Board is demanding we terminate our contract and switch to competitor Samsara.',
        timestamp: '08:46 AM',
        sentiment: 'critical'
      },
      {
        id: 'msg-2',
        sender: 'agent',
        senderName: 'Aisha Al-Mansoor',
        text: 'Arthur, I hear your frustration loud and clear and I want to apologize directly on behalf of our leadership. You should never have had to face this disruption.',
        timestamp: '08:48 AM'
      }
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'Aisha Al-Mansoor',
        authorRole: 'Support Team Lead',
        text: 'High churn threat. Executive customer retention discount matrix approved for 25% off next two quarters + dedicated TAM assignment.',
        timestamp: '08:55 AM',
        isPinned: true
      }
    ],
    followUp: {
      scheduledDate: '2026-10-13',
      scheduledTime: '14:30',
      method: 'Video Call',
      notes: 'Executive alignment with VP of Logistics & Principal Solutions Architect.',
      assignedAgent: 'Aisha Al-Mansoor',
      completed: false
    },
    aiInsights: generateAiSuggestions({
      category: 'Service Cancellation',
      priority: 'Critical',
      title: 'Customer Threatening Contract Termination Over Repeated Integration Latency',
      customer: {
        id: 'CUST-1006',
        name: 'Arthur Pendelton',
        company: 'Vanguard Freightliners',
        email: 'a.pendelton@vanguardfreight.com',
        phone: '+1 (555) 902-1823',
        location: 'Philadelphia, PA',
        tier: 'Enterprise VIP',
        accountSince: 'Feb 2023',
        lifetimeValue: '$180,000 / yr',
        satisfactionScore: 42,
        totalTicketsCount: 22,
        openTicketsCount: 2
      },
      transcript: [{ id: '1', sender: 'customer', senderName: 'Arthur', text: 'cancel terminate contract switch competitor angry', timestamp: 'now' }]
    })
  },
  {
    id: 'CAS-8907',
    title: 'Discrepancy in Field Worker Attendance Geostamp Reports',
    customer: {
      id: 'CUST-1007',
      name: 'Nadia Petrov',
      company: 'OmniField Facilities',
      email: 'n.petrov@omnifield.com',
      phone: '+1 (555) 601-3829',
      location: 'Seattle, WA',
      tier: 'Standard Pro',
      accountSince: 'May 2024',
      lifetimeValue: '$28,000 / yr',
      satisfactionScore: 86,
      totalTicketsCount: 3,
      openTicketsCount: 1,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
    },
    category: 'On-Ground Logistics',
    priority: 'Low',
    status: 'Open',
    channel: 'Support Email',
    assignedAgentId: 'agt-1',
    assignedAgentName: 'Venkat Kishor',
    waitingTimeMinutes: 12,
    handlingDurationMinutes: 0,
    createdAt: '2026-10-12T09:30:00Z',
    slaDue: '1 hr 18 mins',
    isSlaBreached: false,
    transcript: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Nadia Petrov',
        text: 'Hi there, we exported our weekly timecard CSV and 3 employee clock-in timestamps show UTC instead of Pacific Daylight Time.',
        timestamp: '09:30 AM'
      }
    ],
    internalNotes: [],
    aiInsights: generateAiSuggestions({
      category: 'On-Ground Logistics',
      priority: 'Low',
      title: 'Discrepancy in Field Worker Attendance Geostamp Reports',
      customer: {
        id: 'CUST-1007',
        name: 'Nadia Petrov',
        company: 'OmniField Facilities',
        email: 'n.petrov@omnifield.com',
        phone: '+1 (555) 601-3829',
        location: 'Seattle, WA',
        tier: 'Standard Pro',
        accountSince: 'May 2024',
        lifetimeValue: '$28,000 / yr',
        satisfactionScore: 86,
        totalTicketsCount: 3,
        openTicketsCount: 1
      },
      transcript: []
    })
  },
  {
    id: 'CAS-8908',
    title: 'Cellular Firmware Patch 3.2.4 Failing Checksum Verification',
    customer: {
      id: 'CUST-1008',
      name: 'Kenneth Miller',
      company: 'Apex Metro Fleet Solutions',
      email: 'k.miller@apexmetro.com',
      phone: '+1 (555) 234-8902',
      location: 'Chicago, IL',
      tier: 'Enterprise VIP',
      accountSince: 'Nov 2023',
      lifetimeValue: '$148,000 / yr',
      satisfactionScore: 80,
      totalTicketsCount: 15,
      openTicketsCount: 2,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    },
    category: 'Hardware & Telematics',
    priority: 'High',
    status: 'In Progress',
    channel: 'Voice Call',
    assignedAgentId: 'agt-6',
    assignedAgentName: 'Liam O’Connor',
    waitingTimeMinutes: 5,
    handlingDurationMinutes: 12,
    createdAt: '2026-10-12T09:10:00Z',
    slaDue: '20 mins remaining',
    isSlaBreached: false,
    transcript: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Kenneth Miller',
        text: 'The firmware update we deployed across our depot last night failed checksum for 18 units with error code ERR_CRC_32.',
        timestamp: '09:11 AM'
      }
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'Liam O’Connor',
        authorRole: 'Field Engineer Support',
        text: 'Checksum mismatch caused by CDN caching stale release bundle. Purged cache on CDN edge node.',
        timestamp: '09:18 AM'
      }
    ],
    aiInsights: generateAiSuggestions({
      category: 'Hardware & Telematics',
      priority: 'High',
      title: 'Cellular Firmware Patch 3.2.4 Failing Checksum Verification',
      customer: {
        id: 'CUST-1008',
        name: 'Kenneth Miller',
        company: 'Apex Metro Fleet Solutions',
        email: 'k.miller@apexmetro.com',
        phone: '+1 (555) 234-8902',
        location: 'Chicago, IL',
        tier: 'Enterprise VIP',
        accountSince: 'Nov 2023',
        lifetimeValue: '$148,000 / yr',
        satisfactionScore: 80,
        totalTicketsCount: 15,
        openTicketsCount: 2
      },
      transcript: []
    })
  }
];

export const INITIAL_DAILY_METRICS: DailyMetricPoint[] = [
  { date: 'Mon', totalCalls: 112, resolvedCases: 98, escalatedCases: 6, avgHandlingMinutes: 4.8, slaCompliancePct: 96.2 },
  { date: 'Tue', totalCalls: 128, resolvedCases: 114, escalatedCases: 8, avgHandlingMinutes: 4.6, slaCompliancePct: 95.8 },
  { date: 'Wed', totalCalls: 145, resolvedCases: 130, escalatedCases: 11, avgHandlingMinutes: 5.1, slaCompliancePct: 94.1 },
  { date: 'Thu', totalCalls: 132, resolvedCases: 122, escalatedCases: 5, avgHandlingMinutes: 4.3, slaCompliancePct: 97.4 },
  { date: 'Fri', totalCalls: 164, resolvedCases: 149, escalatedCases: 9, avgHandlingMinutes: 4.9, slaCompliancePct: 93.9 },
  { date: 'Sat', totalCalls: 78, resolvedCases: 74, escalatedCases: 2, avgHandlingMinutes: 3.8, slaCompliancePct: 98.7 },
  { date: 'Sun (Today)', totalCalls: 84, resolvedCases: 76, escalatedCases: 4, avgHandlingMinutes: 4.1, slaCompliancePct: 97.0 }
];

export const HOURLY_CALL_DISTRIBUTION = [
  { hour: '08:00', incoming: 14, resolved: 12, waitMin: 1.2 },
  { hour: '09:00', incoming: 28, resolved: 22, waitMin: 3.4 },
  { hour: '10:00', incoming: 42, resolved: 36, waitMin: 4.8 },
  { hour: '11:00', incoming: 38, resolved: 35, waitMin: 3.9 },
  { hour: '12:00', incoming: 29, resolved: 28, waitMin: 2.1 },
  { hour: '13:00', incoming: 34, resolved: 31, waitMin: 2.7 },
  { hour: '14:00', incoming: 46, resolved: 40, waitMin: 4.5 },
  { hour: '15:00', incoming: 39, resolved: 36, waitMin: 3.2 },
  { hour: '16:00', incoming: 25, resolved: 24, waitMin: 1.8 }
];

export const CATEGORY_DISTRIBUTION = [
  { name: 'Technical & API Outage', value: 34, color: '#ef4444' },
  { name: 'Hardware & Telematics', value: 28, color: '#f59e0b' },
  { name: 'Billing & Invoicing', value: 22, color: '#3b82f6' },
  { name: 'On-Ground Logistics', value: 18, color: '#10b981' },
  { name: 'Account & Access', value: 12, color: '#8b5cf6' },
  { name: 'Service Cancellation', value: 6, color: '#ec4899' }
];
