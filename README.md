# OnGround CallOps AI 🎧⚡

**Call Centre Staff Operations & AI Copilot Platform**  
**Project Owner:** Venkat Kishor

---

## 📖 Project Overview
**OnGround CallOps AI** is a modern, responsive call-centre staff management application built for ground logistics, fleet telematics, and customer support triage. It provides an all-in-one console combining real-time queue orchestration, customer history, staff presence tracking, business analytics, and a deterministic AI Copilot guidance engine.

The application runs entirely on the frontend with browser state and `localStorage` persistence, requiring no external backend or database server.

---

## 🚀 Key Features

### 1. Operations Dashboard
- **Live KPI Metrics**: Total calls handled, open and active cases, cases resolved today, average handling time (AHT), and active floor staffing.
- **Dynamic Performance Charts**: Recharts composed visualization with toggles for:
  - *Volume & Resolution*: Inbound call volume, resolved cases, and escalations.
  - *Efficiency & SLA*: Average handling time (minutes) and SLA adherence percentage.
- **Floor Presence Tracker**: Live agent availability grid (Available, In Call, Wrap-up, Break, Offline) with quick status toggling.
- **Urgent & High-Priority Table**: Critical (P1) and High (P2) tickets nearing SLA breach with direct links to the workspace.
- **Recent Interactions Stream**: Activity feed logging caller touches, staff notes, and case resolutions.

### 2. Multi-Channel Call Queue
- **Queue Table**: Displays Case ID, customer name, company, category, priority badge, status, assigned agent, wait time, and SLA countdowns.
- **Search & Filtering**: Search across ticket IDs, customer names, companies, and subjects. Filter by Category, Priority, Status, and Assigned Agent.
- **Quick-Access Tabs**: `Open & Unresolved`, `All Cases`, `Critical (P1)`, `Assigned to Me` (Venkat Kishor), and `Resolved Archive`.
- **Queue Sorting**: Sort ascending and descending by wait time, priority severity, or creation timestamp.
- **Inline Agent Reassignment**: Reassign any ticket directly from the table row dropdown.
- **CSV Export**: One-click download of the active filtered ticket table.
- **Call Simulator**: Modal test harness to inject simulated customer calls with custom categories, severity, and customer profiles.

### 3. Customer Workspace
- **Customer Profile Card**: Contact details (email, phone, location), tier badge (`Enterprise VIP`, `Growth Corporate`, `Standard Pro`), contract ARR, CSAT score, and lifetime ticket counts.
- **Case Controls**: Instant status updates (`Open`, `In Progress`, `Escalated`, `Pending Follow-up`, `Resolved`, `Closed`), priority shifts, and agent reassignment.
- **Conversation History & Audio Simulator**:
  - Simulated live HD call audio player with play/pause, duration timer, and animated waveform bars.
  - Full transcript history with customer sentiment badges (`Critical Tone`, `Frustrated`, `Pleased`).
  - Active reply composer to send responses directly into the transcript.
- **Internal Staff Notes**: Private team notes with author attribution, timestamps, deletion, and "Pin to Top" toggles.
- **Resolution Workflow**: Confirmation dialog to document technical root causes and mark cases as Resolved.
- **Follow-up Scheduler**: Interactive modal to schedule follow-up dates, times, channels (`Phone Call`, `Video Call`, `Email`, `Field Tech Visit`), and custom instructions.

### 4. AI Assistance Panel (Deterministic Copilot)
> **Simulated AI Engine**: Clearly labelled as rule-based heuristics (*OnGround Intelligence Core v2.4*). No external LLM or backend is connected.
- **Conversation Summary**: Condensed summary of customer issues and emotional sentiment.
- **Key Concerns Extraction**: Identifies operational bottlenecks from conversation transcripts.
- **Escalation Warning & Risk Meter**: High, Moderate, or Low risk score with trigger explanations (e.g. churn keywords, high SLA proximity, Enterprise tier).
- **Suggested Customer Response**: Contextual response draft with:
  - **Insert into Reply Box**: One-click insertion into the active message composer.
  - **Copy to Clipboard**: Quick copy with confirmation.
- **Recommended Next Action**: Standard Operating Procedure (SOP) playbooks (e.g., SRE incident bridge routing, credit token dispatch, OTA device reboot) with simulated execution logged into internal notes.
- **Transparent Explanation**: Explains why recommendations were generated and references standard operating procedure codes (e.g. `SOP-FIN-204`, `SOP-TECH-302`).

### 5. Team & Analytics
- **Workforce Performance KPIs**: Ingestion totals, team resolution rates, average handling time, and mean CSAT scores.
- **Interactive Recharts Visualizations**:
  - *Hourly Call Velocity & Wait Trends*: Bar chart tracking call volume across shift hours.
  - *Incident Category Distribution*: Donut chart with category shares and legends.
  - *Average Handling Time Benchmarking*: Horizontal bar chart comparing agent AHT against the 5.0 minute target.
- **Agent Performance Leaderboard**: Full team scorecard with resolution ratios, handled volumes, and one-click agent filtering.
- **Date & Department Filters**: Switch between `Today`, `Last 7 Days`, `Last 30 Days`, and `This Quarter`.

---

## 🛠️ Technology Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router v7
- **Data Visualizations**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API + LocalStorage Synchronization

---

## 💻 Installation & Setup

### Prerequisites
- Node.js (v18.0 or newer)
- npm or yarn

### Commands
```bash
# 1. Navigate to project root
cd "c:/MCA_3rd_Sem/OnGround CallOps AI"

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start development server
npm run dev

# 4. Create production build
npm run build
```

The application runs locally at `http://localhost:5173/`.

---

## 🗂️ Folder Structure
```
OnGround CallOps AI/
├── index.html                     # HTML shell with Inter typography
├── package.json                   # Dependencies and scripts
├── tailwind.config.js             # Tailwind CSS tokens
├── tsconfig.json                  # Root TypeScript configuration
├── tsconfig.app.json              # App TypeScript compiler configuration
├── vite.config.ts                 # Vite bundler configuration
├── .gitignore                     # Git ignore rules
└── src/
    ├── main.tsx                   # React root entry point
    ├── App.tsx                    # Shell layout & React Router routing
    ├── index.css                  # Tailwind styles and custom scrollbar rules
    ├── types/
    │   └── index.ts               # Core TypeScript data interfaces
    ├── data/
    │   └── mockData.ts            # Realistic mock cases, agents, and metrics
    ├── utils/
    │   └── aiEngine.ts            # Deterministic AI rules engine
    ├── context/
    │   └── AppContext.tsx         # Central state management & localStorage persistence
    ├── components/
    │   ├── common/
    │   │   ├── Header.tsx         # Top navigation, demo role switcher, VK avatar
    │   │   ├── Sidebar.tsx        # Responsive navigation and agent shift card
    │   │   ├── ToastContainer.tsx # Dynamic toast notifications
    │   │   └── SimulateCallModal.tsx # Inbound call simulation modal
    │   ├── dashboard/
    │   │   ├── KpiCard.tsx        # Metric card with trend indicators
    │   │   ├── PerformanceCharts.tsx # Recharts volume and handling time charts
    │   │   ├── AgentAvailabilityList.tsx # Live floor staffing presence list
    │   │   ├── HighPriorityTable.tsx # High-priority case action table
    │   │   └── RecentInteractionsFeed.tsx # Omni-channel interaction activity feed
    │   ├── queue/
    │   │   └── QueueTable.tsx     # Filterable, sortable call queue table
    │   ├── workspace/
    │   │   ├── CustomerProfileCard.tsx # Customer contract and contact details
    │   │   ├── ConversationView.tsx    # Live audio playback, waveform & composer
    │   │   ├── InternalNotesView.tsx   # Staff internal notes with pinning
    │   │   ├── ResolutionModal.tsx     # Confirmation dialog for closing cases
    │   │   ├── FollowUpModal.tsx       # Scheduled follow-up booking dialog
    │   │   └── AiAssistancePanel.tsx   # Deterministic AI Copilot console
    │   └── analytics/
    │       ├── AnalyticsCharts.tsx     # Hourly velocity, donut distribution, AHT bars
    │       └── AgentLeaderboard.tsx    # Agent scorecard with interactive filter
    └── pages/
        ├── DashboardPage.tsx      # Main operational command center
        ├── QueuePage.tsx          # Real-time multi-channel ticket queue
        ├── WorkspacePage.tsx      # Deep triage console with AI Copilot
        └── AnalyticsPage.tsx      # Workforce analytics & agent scorecard
```

---

## 🖥️ Screen Layouts & UI Structure

### Dashboard (`/`)
```
+---------------------------------------------------------------------------------+
| Top Bar: Logo | Global Search | Role: Specialist | Status: Available | [VK User] |
+---------------------------------------------------------------------------------+
| Sidebar    | Command Banner: "Live Operations Floor" | [Simulate Call]         |
| - Dash     +--------------------------------------------------------------------+
| - Queue    | KPI 1: Calls | KPI 2: Open | KPI 3: Resolved | KPI 4: AHT | KPI 5: Staff |
| - Workspc  +------------------------------------+-------------------------------+
| - Analytics| Performance Charts (Recharts)      | Live Agent Availability (VK)  |
|            +------------------------------------+-------------------------------+
|            | Urgent & High-Priority Cases Table | Recent Interactions Feed      |
+---------------------------------------------------------------------------------+
```

### Customer Workspace (`/workspace/:caseId`)
```
+---------------------------------------------------------------------------------+
| Case Bar: [<- Queue] CAS-8902 | Priority: High | Status: In Progress | [Resolve]|
+---------------------------------------------------------------------------------+
| Customer Card      | Conversation View & Live Audio | AI Copilot (Deterministic)|
| - Profile & Tier   | - Audio waveform & playback    | - Summary & Tone          |
| - Contact & ARR    | - Transcript messages          | - Risk: Moderate          |
| Follow-up Card     | - Message composer             | - Suggested Response      |
| Staff Notes (Pinned)                                | - SOP: SOP-FIN-204        |
+---------------------------------------------------------------------------------+
```

---

## ⚠️ Known Limitations
1. **Frontend-Only Architecture**: All data is stored in the browser's `localStorage` and memory. There is no remote database or backend server sync.
2. **Simulated AI Engine**: AI Copilot recommendations are generated deterministically using keyword heuristics, customer tier SLA matrices, and category rule playbooks rather than a live generative LLM API.
3. **Simulated Audio Streaming**: The call audio playback bar simulates live streaming with an animated audio waveform and timer, without loading actual binary voice recordings.
