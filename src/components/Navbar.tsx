import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { RankBadge } from './RankBadge';
import { GamerAvatar } from './GamerAvatar';
import { PerformanceToggle } from './PerformanceToggle';
import {
  Shield,
  Search,
  Users,
  Trophy,
  Layers,
  Sparkles,
  ClipboardCheck,
  Award,
  Bell,
  Menu,
  X,
  ExternalLink,
  Sliders,
  ChevronRight,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    navigateTo,
    setSearchOpen,
    serverConfig,
    currentUser,
    setAuthModalOpen,
    logout
  } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'tierlist', label: 'Tierlist', icon: Layers },
    { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'testing', label: 'Testing', icon: ClipboardCheck },
    { id: 'results', label: 'Results', icon: Award },
    { id: 'staff', label: 'Staff', icon: Shield },
    { id: 'announcements', label: 'News', icon: Bell },
  ];

  const handleNav = (tabId: string) => {
    navigateTo(tabId);
    setMobileMenuOpen(false);
  };

  const isAdmin = currentUser && (
    currentUser.email.toLowerCase() === 'valtrox51@gmail.com' ||
    currentUser.rank === 'Owner' ||
    currentUser.rank === 'Administrator'
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0F0F17]/95 backdrop-blur-2xl border-b border-[#252538]">
      {/* Top micro alert banner */}
      <div className="bg-gradient-to-r from-red-600/20 via-[#7C3AED]/20 to-red-600/20 border-b border-[#7C3AED]/30 py-1.5 px-4 text-xs text-center text-zinc-300 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-semibold text-white">Season 1 Standardized Bedrock:</span>
        <span className="hidden sm:inline">15-Tier PvP Calibration queues are open on Discord!</span>
        <button
          onClick={() => handleNav('testing')}
          className="text-[#8B5CF6] hover:text-white font-medium underline ml-1 cursor-pointer"
        >
          Queue now &rarr;
        </button>
      </div>

      <div className="w-full max-w-[1750px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Left: Brand Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <img src="/valtrox-logo.svg" alt="Valtrox logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-base sm:text-lg font-black tracking-tight text-white hover:text-purple-300 transition-colors">
                  VALTROX
                </span>
                <span className="text-[9px] uppercase tracking-wider font-mono font-bold bg-red-500/20 text-red-300 px-1 py-0.2 rounded border border-red-500/40">
                  BEDROCK
                </span>
              </div>
            </div>
          </motion.div>

          {/* Center: Desktop Navigation Links (Only shown on extra-wide screens to prevent pushing right-side controls) */}
          <nav className="hidden 2xl:flex items-center gap-0.5 flex-1 justify-center max-w-2xl px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`relative px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-white shadow-glow-purple-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#171722]/70'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-[#171722] border border-[#7C3AED]/70 rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon size={13} className={isActive ? 'text-[#8B5CF6]' : 'text-zinc-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Section: Auth + Admin + Logout (GUARANTEED 100% VISIBLE ON 100% ZOOM) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Performance mode toggle (PC / Phone) */}
            <PerformanceToggle />

            {/* Quick Search trigger icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#171722] border border-[#252538] text-xs text-zinc-400 hover:text-white hover:border-[#7C3AED]/50 transition-all cursor-pointer shadow-sm group"
              title="Search (Ctrl + K)"
            >
              <Search size={14} className="group-hover:text-[#8B5CF6] transition-colors" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="hidden 2xl:inline-block bg-[#0F0F17] px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-400 border border-[#252538]">
                Ctrl K
              </kbd>
            </button>

            {/* Auth Profile / Login / Logout Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* User profile badge */}
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-xl bg-[#171722] border border-[#252538] shadow-sm">
                  <GamerAvatar name={currentUser.ign} size="sm" rank={currentUser.rank} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-white font-mono leading-none">{currentUser.ign}</span>
                    <RankBadge rank={currentUser.rank} size="sm" className="mt-0.5" />
                  </div>
                </div>

                {/* 👑 Master Admin Panel button - STRICTLY FOR THIS ACCOUNT ONLY & ALWAYS VISIBLE */}
                {isAdmin && (
                  <button
                    onClick={() => handleNav('admin')}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black shrink-0 ${
                      activeTab === 'admin'
                        ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                        : 'bg-red-950/60 text-red-200 border-red-500/60 hover:bg-red-900/80 hover:border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    }`}
                    title="Master Admin Panel"
                  >
                    <Sliders size={13} className="text-amber-300" />
                    <span>👑 Admin Panel</span>
                  </button>
                )}

                {/* Log Out button - ALWAYS VISIBLE WITH CLEAR STYLING */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/70 border border-red-500/30 hover:border-red-500/70 text-red-300 hover:text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                  title="Log out of Valtrox"
                >
                  <LogOut size={13} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Log In button */}
                <button
                  onClick={() => setAuthModalOpen(true, 'login')}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#171722] hover:bg-[#1F1F2E] border border-[#252538] hover:border-[#7C3AED]/50 text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
                >
                  <LogIn size={13} className="text-purple-400" />
                  <span>Log In</span>
                </button>
                {/* Sign Up button */}
                <button
                  onClick={() => setAuthModalOpen(true, 'signup')}
                  className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white text-xs font-bold shadow-glow-purple transition-all cursor-pointer"
                >
                  <UserPlus size={13} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile & Medium Screen Hamburger for Navigation Tabs */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="2xl:hidden p-2 rounded-xl bg-[#171722] hover:bg-[#1F1F2E] border border-[#252538] text-zinc-300 hover:text-white cursor-pointer transition-colors"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Drawer Menu for Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="2xl:hidden bg-[#171722]/98 border-b-2 border-[#7C3AED]/30 px-4 sm:px-6 py-4 space-y-3 overflow-hidden shadow-2xl backdrop-blur-xl"
          >
            {/* Grid of Navigation Items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#7C3AED]/25 text-white border border-[#7C3AED]/60 shadow-glow-purple-sm'
                        : 'text-zinc-300 hover:text-white hover:bg-[#0F0F17] border border-[#252538]/50'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-[#8B5CF6]' : 'text-zinc-400'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {isAdmin && (
              <div className="pt-2 border-t border-[#252538]">
                <button
                  onClick={() => handleNav('admin')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-black shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer"
                >
                  <Sliders size={16} className="text-amber-300" />
                  <span>👑 Open Master Admin Control Panel</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};