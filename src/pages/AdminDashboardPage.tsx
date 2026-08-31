import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Sliders, Sparkles, Award, Users, Layers, Shield, Bell, Settings, CheckCircle2, Lock, Radio, UserCheck } from 'lucide-react';
import { AdminBroadcastAndRanks } from './admin/AdminBroadcastAndRanks';
import { AdminOverview } from './admin/AdminOverview';
import { AdminPublishResult } from './admin/AdminPublishResult';
import { AdminPlayers } from './admin/AdminPlayers';
import { AdminTiers } from './admin/AdminTiers';
import { AdminTesters } from './admin/AdminTesters';
import { AdminAnnouncements } from './admin/AdminAnnouncements';
import { AdminConfig } from './admin/AdminConfig';
import { AdminUsers } from './admin/AdminUsers';
import { RankBadge } from '../components/RankBadge';

export const AdminDashboardPage: React.FC = () => {
  const { players, navigateTo, currentUser, setAuthModalOpen } = useData();
  const [activeTab, setActiveTab] = useState<'broadcast-ranks' | 'overview' | 'publish-result' | 'players' | 'tiers' | 'testers' | 'announcements' | 'server-config' | 'admin-users'>('broadcast-ranks');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const isAdmin = currentUser && (
    currentUser.email.toLowerCase() === 'valtrox51@gmail.com' ||
    currentUser.rank === 'Owner' ||
    currentUser.rank === 'Administrator'
  );

  // Only the master owner email can manage admin users
  const isMasterOwner = currentUser && currentUser.email.toLowerCase() === 'valtrox51@gmail.com';

  // Access Restricted Guard for Non-Admins
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-[#171722] border-2 border-red-500/50 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <Lock size={32} />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono font-bold">
            <span>Restricted Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Admin Credentials Required</h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            This administrative control panel is strictly reserved for the Master Administrator account and designated Owner.
          </p>
        </div>

        {currentUser ? (
          <div className="p-4 rounded-2xl bg-[#0F0F17] border border-[#252538] text-xs font-mono text-zinc-300 space-y-1">
            <span>Logged in as: <strong className="text-white">{currentUser.ign}</strong> ({currentUser.email})</span>
            <div>Current Rank: <RankBadge rank={currentUser.rank} size="sm" /></div>
            <p className="text-[11px] text-zinc-500 pt-1">You do not have permission to access the admin portal.</p>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setAuthModalOpen(true, 'login')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-amber-600 hover:to-red-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
          >
            Sign In with Admin Account &rarr;
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#0F0F17] hover:bg-[#252538] border border-[#252538] text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(239,68,68,0.5)]">
          <CheckCircle2 size={16} />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252538] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 font-mono">
            <Sliders size={14} className="text-amber-400" />
            <span>Valtrox Master Administration Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <span>Admin Control Panel</span>
            <RankBadge rank={currentUser.rank} size="md" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Authenticated as <strong className="text-white">{currentUser.email}</strong> ({currentUser.ign}). Broadcast live 10s top DM news and assign community ranks.
          </p>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="px-3.5 py-1.5 rounded-xl bg-[#171722] hover:bg-[#1F1F2E] border border-[#252538] text-xs font-semibold text-zinc-300 transition-all cursor-pointer"
        >
          &larr; View Live Website
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveTab('broadcast-ranks')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'broadcast-ranks' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-[#171722] text-zinc-400 hover:text-white border border-[#252538]'
          }`}
        >
          <Radio size={14} className="text-amber-300 animate-pulse" />
          <span>News DM & User Ranks</span>
        </button>

        <button
          onClick={() => setActiveTab('publish-result')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'publish-result' ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm' : 'bg-[#171722] text-zinc-400 hover:text-white border border-[#252538]'
          }`}
        >
          <Award size={14} />
          <span>Publish Test Result</span>
        </button>

        <button
          onClick={() => setActiveTab('players')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'players' ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm' : 'bg-[#171722] text-zinc-400 hover:text-white border border-[#252538]'
          }`}
        >
          <Users size={14} />
          <span>Players Roster ({players.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tiers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tiers' ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm' : 'bg-[#171722] text-zinc-400 hover:text-white border border-[#252538]'
          }`}
        >
          <Layers size={14} />
          <span>15-Tier Calibration</span>
        </button>

        <button
          onClick={() => setActiveTab('testers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'testers' ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm' : 'bg-[#171722] text-zinc-400 hover:text-white border border-[#252538]'
          }`}
        >
          <Shield size={14} />
          <span>Testers & Staff</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'announcements' ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm' : 'bg-[#171722] text-zinc-400 hover:text-white border border-[#252538]'
          }`}
        >
          <Bell size={14} />
          <span>Announcements CMS</span>
        </button>

        <button
          onClick={() => setActiveTab('server-config')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'server-config' ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm' : 'bg-[#171722] text-zinc-400 hover:text-white border border-[#252538]'
          }`}
        >
          <Settings size={14} />
          <span>Server Config & Data</span>
        </button>

        {isMasterOwner && (
          <button
            onClick={() => setActiveTab('admin-users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'admin-users' ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm' : 'bg-[#171722] text-zinc-400 hover:text-white border border-[#252538]'
            }`}
          >
            <Shield size={14} />
            <span>Admin Users</span>
          </button>
        )}
      </div>

      {/* Tab Contents */}
      {activeTab === 'broadcast-ranks' && <AdminBroadcastAndRanks onFeedback={showFeedback} />}
      {activeTab === 'publish-result' && <AdminPublishResult onFeedback={showFeedback} />}
      {activeTab === 'players' && <AdminPlayers onFeedback={showFeedback} />}
      {activeTab === 'tiers' && <AdminTiers onFeedback={showFeedback} />}
      {activeTab === 'testers' && <AdminTesters onFeedback={showFeedback} />}
      {activeTab === 'announcements' && <AdminAnnouncements onFeedback={showFeedback} />}
      {activeTab === 'server-config' && <AdminConfig onFeedback={showFeedback} />}
      {activeTab === 'admin-users' && isMasterOwner && <AdminUsers onFeedback={showFeedback} />}
    </div>
  );
};
