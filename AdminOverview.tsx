import React from 'react';
import { useData } from '../../context/DataContext';
import { Sparkles, Users, Award, Shield, Settings, ArrowRight } from 'lucide-react';

export const AdminOverview: React.FC<{ onNavigateTab: (tab: any) => void }> = ({ onNavigateTab }) => {
  const { players, testResults, testers, serverConfig } = useData();

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#171722] border border-[#252538] space-y-1">
          <span className="text-xs font-mono text-zinc-400 uppercase">Registered Players</span>
          <div className="text-3xl font-black text-white font-mono">{players.length}</div>
          <span className="text-[11px] text-emerald-400 font-medium">100% Synced to Database</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171722] border border-[#252538] space-y-1">
          <span className="text-xs font-mono text-zinc-400 uppercase">Audited Test Results</span>
          <div className="text-3xl font-black text-[#8B5CF6] font-mono">{testResults.length}</div>
          <span className="text-[11px] text-purple-300 font-medium">Official Public Ledger</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171722] border border-[#252538] space-y-1">
          <span className="text-xs font-mono text-zinc-400 uppercase">Active Testers</span>
          <div className="text-3xl font-black text-cyan-400 font-mono">{testers.length}</div>
          <span className="text-[11px] text-cyan-300 font-medium">7 Gamemodes Covered</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171722] border border-[#252538] space-y-1">
          <span className="text-xs font-mono text-zinc-400 uppercase">Testing Queue Status</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">{serverConfig.testingStatus}</div>
          <span className="text-[11px] text-zinc-400 font-medium">{serverConfig.activeSeason}</span>
        </div>
      </div>

      {/* Quick Staff Actions */}
      <div className="p-6 rounded-2xl bg-[#171722] border border-[#252538] space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Staff Operations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigateTab('publish-result')}
            className="p-5 rounded-xl bg-[#0F0F17] hover:bg-[#1F1F2E] border border-[#252538] text-left space-y-2 group transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-[#8B5CF6]">
              <Award size={20} />
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-bold text-white text-sm">Submit Test Scorecard</div>
            <p className="text-xs text-zinc-400">Award official HT1-LT5 tier rank with instant site-wide sync</p>
          </button>

          <button
            onClick={() => onNavigateTab('players')}
            className="p-5 rounded-xl bg-[#0F0F17] hover:bg-[#1F1F2E] border border-[#252538] text-left space-y-2 group transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-cyan-400">
              <Users size={20} />
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-bold text-white text-sm">Register New Player</div>
            <p className="text-xs text-zinc-400">Add player by Minecraft IGN, Discord tag, and Region</p>
          </button>

          <button
            onClick={() => onNavigateTab('server-config')}
            className="p-5 rounded-xl bg-[#0F0F17] hover:bg-[#1F1F2E] border border-[#252538] text-left space-y-2 group transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-amber-400">
              <Settings size={20} />
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-bold text-white text-sm">Server Settings & Backup</div>
            <p className="text-xs text-zinc-400">Toggle testing queue and export full JSON database backup</p>
          </button>
        </div>
      </div>
    </div>
  );
};