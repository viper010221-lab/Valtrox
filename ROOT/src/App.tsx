import React from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { McBlock } from './components/McBlock';
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
    <div className="min-h-screen relative flex flex-col text-white selection:bg-[#FBBF24] selection:text-[#0B3C70] overflow-x-hidden">
      {/* Minecraft sky backdrop: block grid + logo-style sunburst rays */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-20 z-0" />
      <div className="fixed inset-0 bg-sky-rays pointer-events-none opacity-70 z-0" />

      {/* Perspective floor — a grid that recedes to the horizon and gives the
          flat sky a sense of standing on solid ground. */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="floor-3d opacity-25" />
      </div>

      {/* Isometric blocks drifting at different depths. Kept behind the page
          canvas (z-0 vs z-10) so they read as scenery in the gaps between
          panels rather than competing with content. Hidden on phones, where
          they would just crowd the narrow column. */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden md:block scene-3d-deep" aria-hidden="true">
        <McBlock tone="blue" size={38} className="absolute top-[16%] left-[3%] float-3d" />
        <McBlock
          tone="gold"
          size={28}
          className="absolute top-[58%] left-[7%] float-3d float-3d--slow"
          style={{ animationDelay: '1.2s' }}
        />
        <McBlock
          tone="cyan"
          size={46}
          className="absolute top-[24%] right-[2.5%] float-3d float-3d--fast"
          style={{ animationDelay: '2.4s' }}
        />
        <McBlock
          tone="gold"
          size={24}
          className="absolute top-[76%] right-[8%] float-3d float-3d--slow"
          style={{ animationDelay: '0.6s' }}
        />
      </div>

      {perfMode === 'pc' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-radial-glow opacity-90" />
          {/* Lightweight Ambient Glowing Orbs with GPU acceleration */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#FBBF24]/20 rounded-full blur-3xl transform-gpu animate-pulse-glow" />
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl transform-gpu animate-pulse-glow" style={{ animationDelay: '2s' }} />
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