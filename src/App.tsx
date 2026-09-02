import React from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuickSearchModal } from './components/QuickSearchModal';
import { LiveDMBanner } from './components/LiveDMBanner';
import { AuthModal } from './components/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { PlayersPage } from './pages/PlayersPage';
import { PlayerDetailPage } from './pages/PlayerDetailPage';
import { LeaderboardsPage } from './pages/LeaderboardsPage';
import { TierlistPage } from './pages/TierlistPage';
import { TestingPage } from './pages/TestingPage';
import { ResultsPage } from './pages/ResultsPage';
import { StaffPage } from './pages/StaffPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { AnimatePresence, motion } from 'framer-motion';

export const AppContent: React.FC = () => {
  const { activeTab, perfMode } = useData();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'players':
        return <PlayersPage />;
      case 'player-detail':
        return <PlayerDetailPage />;
      case 'leaderboards':
        return <LeaderboardsPage />;
      case 'tierlist':
        return <TierlistPage />;
      case 'testing':
        return <TestingPage />;
      case 'results':
        return <ResultsPage />;
      case 'staff':
        return <StaffPage />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#0F0F17] text-[#F5F5F5] selection:bg-[#7C3AED] selection:text-white overflow-x-hidden">
      {/* Dynamic Cyber Grid Background */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-30 z-0" />
      {perfMode === 'pc' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-radial-glow opacity-80" />
          {/* Lightweight Ambient Glowing Orbs with GPU acceleration */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#7C3AED]/15 rounded-full blur-3xl transform-gpu animate-pulse-glow" />
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#8B5CF6]/10 rounded-full blur-3xl transform-gpu animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>
      )}

      {/* Live Server DM Broadcast Banner (10s auto-dismiss) */}
      <LiveDMBanner />

      {/* Global Navbar */}
      <div className="relative z-40">
        <Navbar />
      </div>

      {/* Main Page Canvas with Animated Page Transitions */}
      <main className="relative z-10 flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global SaaS Footer */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* Quick Search Modal (Ctrl/Cmd + K) */}
      <QuickSearchModal />

      {/* Global Auth Modal (Login / Signup) */}
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;