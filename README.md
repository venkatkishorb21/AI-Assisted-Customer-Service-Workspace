# OnGround CallOps AI 🎧

### Call Centre Staff Operations & AI Copilot Platform

**Project Owner:** Venkat Kishor

## Project Overview

OnGround CallOps AI is a modern, responsive call-centre staff management application designed to streamline customer support operations. It provides a centralized interface for managing customer interactions, monitoring call queues, tracking agent performance, and displaying AI-assisted recommendations.

The application uses frontend state, realistic mock data, and browser `localStorage` for persistence. No backend server or database is required.

## Key Features

### 1. Operations Dashboard
- Call handling, open cases, resolved cases, and average handling time metrics.
- Interactive performance charts.
- Agent availability monitoring.
- High-priority case tracking.
- Recent customer interaction activity.

### 2. Call Queue Management
- Customer and case information.
- Search, filtering, and sorting.
- Priority and status indicators.
- Agent assignment and reassignment.
- Quick-access views for open, critical, assigned, and resolved cases.
- CSV export and simulated incoming call functionality, where implemented.

### 3. Customer Interaction Workspace
- Customer profile and interaction history.
- Case status and priority updates.
- Agent reassignment.
- Conversation transcript and reply composer.
- Internal staff notes.
- Resolution workflow.
- Follow-up scheduling.

### 4. AI Assistance Panel
The application includes a simulated, rule-based AI assistance panel that demonstrates:
- Conversation summaries.
- Customer concern identification.
- Suggested responses.
- Escalation warnings.
- Recommended next actions.
- Explanations for recommendations.

**Note:** The AI assistance is simulated using deterministic rules. No live AI model or external AI API is connected.

### 5. Team and Analytics
- Agent performance indicators.
- Resolution rate comparisons.
- Average handling time analytics.
- Interactive charts.
- Case category distribution.
- Date and department filters, where implemented.

## Technology Stack

- **Frontend:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Charts:** Recharts
- **Icons:** Lucide React
- **State Management:** React Context API
- **Persistence:** Browser localStorage

## Project Architecture

The application follows a component-based frontend architecture.

- `src/components/` — Reusable interface components.
- `src/pages/` — Main application pages.
- `src/context/` — Shared application state.
- `src/data/` — Sample data.
- `src/types/` — TypeScript interfaces.
- `src/utils/` — Utility functions and simulated AI rules.
- `public/` — Static assets.
- `package.json` — Dependencies and scripts.
- `vite.config.ts` — Vite configuration.
- `tailwind.config.js` — Tailwind CSS configuration.

The exact folder structure may vary depending on the final implementation.

## Installation and Setup

### Prerequisites

- Node.js 18 or newer, compatible with the project's dependencies.
- npm.

### 1. Clone the repository

```bash
git clone https://github.com/venkatkishorb21/AI-Assisted-Customer-Service-Workspace.git
```

### 2. Navigate to the project folder

```bash
cd AI-Assisted-Customer-Service-Workspace
```

### 3. Install dependencies

```bash
npm install
```

If dependency compatibility issues occur, inspect the error before considering alternative installation options.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed in the terminal, typically `http://localhost:5173/`.

### 5. Create a production build

```bash
npm run build
```

## Testing

The application should be checked for:
- Navigation and routing.
- Search, filtering, and sorting.
- Customer case updates.
- Dashboard metric consistency.
- Form validation and notifications.
- Browser storage persistence.
- Responsive layout.
- Production build errors.

Only tests that have actually been executed should be reported as passed.

## Known Limitations

1. **Frontend-only application:** No backend server, remote database, or server-side synchronization.
2. **Mock data:** Customer records, call activities, and agent information are sample data.
3. **Simulated AI:** Recommendations use predefined rules rather than a live generative AI model.
4. **Simulated calls:** Audio and call-related interactions may be demonstrations rather than real telephony integrations.
5. **Local persistence:** Data saved in localStorage is specific to the browser and device.

## AI Development Tools

AI-assisted development tools may be used to support implementation, debugging, and documentation. The specific tools used should be listed accurately by the project owner.

## Future Enhancements

- Backend and database integration.
- Secure authentication and role-based access control.
- Real-time call centre integrations.
- Live AI-powered conversation summaries.
- Automated testing and continuous integration.
- Cloud deployment.

## License

This project was developed as a frontend engineering assignment and portfolio project. No open-source license is specified yet.