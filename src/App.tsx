import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardPage } from './pages/DashboardPage';
import { QueuePage } from './pages/QueuePage';
import { WorkspacePage } from './pages/WorkspacePage';
import { AnalyticsPage } from './pages/AnalyticsPage';

const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header onToggleSidebarMobile={() => setIsMobileSidebarOpen(true)} />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/queue" element={<QueuePage />} />
              <Route path="/workspace/:caseId" element={<WorkspacePage />} />
              <Route path="/workspace" element={<WorkspacePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Dynamic Toast Feedback Container */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
