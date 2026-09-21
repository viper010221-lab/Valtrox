import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { UserRank, Gamemode } from '../../types';
import { RankBadge } from '../../components/RankBadge';
import { GamerAvatar } from '../../components/GamerAvatar';
import { Radio, ShieldAlert, Send, UserCheck, CheckCircle2, AlertCircle, Sparkles, Mail, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPlayerPoints } from '../../data/initialData';

const ALL_RANKS: UserRank[] = [
  'Owner',
  'Developer',
  'Administrator',
  'Moderator',
  'Bedrock Union Partner',
  'VIP',
  'Tier Tester',
  'Content Creator+',
  'Content Creator',
  'MVP++',
  'MVP+',
  'MVP',
  'Player'
];

export const AdminBroadcastAndRanks: React.FC<{ onFeedback: (msg: string) => void }> = ({ onFeedback }) => {
  const { sendLiveDM, accounts, assignRankByEmail, currentUser } = useData();

  // Broadcast state
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Rank assignment state
  const [targetEmail, setTargetEmail] = useState('');
  const [selectedRank, setSelectedRank] = useState<UserRank>('VIP');
  const [assignStatus, setAssignStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setIsBroadcasting(true);
    sendLiveDM(broadcastMessage.trim());
    onFeedback('Broadcast sent! Displaying top DM alert across the platform for 10s.');
    setBroadcastMessage('');
    setTimeout(() => setIsBroadcasting(false), 500);
  };

  const handleAssignRank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim()) return;

    const res = assignRankByEmail(targetEmail.trim(), selectedRank);
    if (res.success) {
      setAssignStatus({ type: 'success', message: res.message });
      onFeedback(res.message);
      setTargetEmail('');
    } else {
      setAssignStatus({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. SEND NEWS / LIVE TOP DM BROADCAST */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-950/20 via-[#0E4A87]/80 to-[#0E4A87]/70 border-2 border-red-500/50 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400">
            <Radio size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black heading-gold">Live News & DM Broadcast System</h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-mono">
                10-Sec Auto-Expire
              </span>
            </div>
            <p className="text-xs text-sky-200">
              Type any announcement. It will appear at the very top of the website like a direct server message and fade away after 10 seconds.
            </p>
          </div>
        </div>

        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-sky-100 block mb-1.5">Broadcast Message Content</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. 📢 BEDFIGHT TOURNAMENT REGISTRATION IS NOW LIVE! Open tickets in Discord to compete for  Prize Pool!"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full px-4 py-3 bg-[#0B3C70]/55 border border-white/20 focus:border-red-500 rounded-2xl text-xs text-white placeholder-sky-300 focus:outline-none transition-colors leading-relaxed font-sans"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-sky-300 font-mono">
              Sender will be marked as <strong className="text-red-400">{currentUser?.ign || 'Bedrock Union Owner'} [Owner]</strong>
            </span>
            <button
              type="submit"
              disabled={isBroadcasting || !broadcastMessage.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-rose-600 hover:to-red-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={14} />
              <span>Broadcast Live DM to All Users &rarr;</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* 2. USER RANK ASSIGNMENT BY EMAIL */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 sm:p-8 rounded-3xl bg-[#0E4A87]/70 border border-[#1976D2]/50 shadow-2xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#1976D2]/20 border border-[#1976D2]/40 text-sky-300">
            <UserCheck size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black heading-gold">Assign User Community Rank</h2>
            <p className="text-xs text-sky-200">
              Input any registered user's email address and choose their platform permissions and prestige badge rank.
            </p>
          </div>
        </div>

        {assignStatus && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
              assignStatus.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/60 border-red-500/50 text-red-300'
            }`}
          >
            {assignStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{assignStatus.message}</span>
          </div>
        )}

        <form onSubmit={handleAssignRank} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-sky-100">Target User Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300" />
              <input
                type="email"
                required
                placeholder="e.g. player@gmail.com"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B3C70]/55 border border-white/20 focus:border-[#1976D2] rounded-xl text-xs text-white focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-sky-100">Assign Platform Rank</label>
            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value as UserRank)}
              className="w-full px-3.5 py-2.5 bg-[#0B3C70]/55 border border-white/20 focus:border-[#1976D2] rounded-xl text-xs text-white focus:outline-none transition-colors cursor-pointer font-mono"
            >
              {ALL_RANKS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1976D2] to-[#42A5F5] hover:from-[#42A5F5] hover:to-[#1976D2] text-white font-bold text-xs shadow-glow-blue transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            <span>Update User Rank</span>
          </button>
        </form>

        {/* Registered Accounts Table */}
        <div className="pt-4 border-t border-white/20 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-200 font-mono">
            Registered Accounts Directory ({accounts.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B3C70]/55 text-sky-200 uppercase text-[10px] font-mono border-b border-white/20">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Discord</th>
                  <th className="py-3 px-4">Current Rank</th>
                  <th className="py-3 px-4 text-center">Quick Assign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/15 font-mono">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-[#1565C0]/60/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <GamerAvatar name={acc.ign} size="sm" rank={acc.rank} />
                        <span className="font-bold text-white">{acc.ign}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sky-100">{acc.email}</td>
                    <td className="py-3 px-4 text-sky-200">{acc.discordTag}</td>
                    <td className="py-3 px-4">
                      <RankBadge rank={acc.rank} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <select
                        value={acc.rank}
                        onChange={(e) => assignRankByEmail(acc.email, e.target.value as UserRank)}
                        className="px-2 py-1 bg-[#0B3C70]/55 border border-white/20 rounded-lg text-[11px] text-sky-100 focus:border-[#1976D2] focus:outline-none cursor-pointer"
                      >
                        {ALL_RANKS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* 3. PLAYER, LEADERBOARD & TIERLIST REMOVAL MODERATION */}
      <PlayerRemovalModeration onFeedback={onFeedback} />
    </div>
  );
};

const PlayerRemovalModeration: React.FC<{ onFeedback: (msg: string) => void }> = ({ onFeedback }) => {
  const { players, deletePlayer, updatePlayerTier } = useData();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(players[0]?.id || '');
  const [selectedMode, setSelectedMode] = useState<Gamemode>('Bedfight');
  const [searchFilter, setSearchFilter] = useState('');

  const targetPlayer = players.find((p) => p.id === selectedPlayerId);

  const handleRemoveFromEntirePlatform = (playerId: string, ign: string) => {
    if (window.confirm(`⚠️ Are you sure you want to completely remove ${ign} from the Leaderboards, Players Roster, and Tierlists?`)) {
      deletePlayer(playerId);
      onFeedback(`Removed ${ign} completely from Leaderboards, Players & Tierlists.`);
    }
  };

  const handleClearGamemodeTier = (playerId: string, ign: string, mode: Gamemode) => {
    updatePlayerTier(playerId, mode, 'Untested', 'Admin', 'N/A', 'Removed from tierlist by Administrator');
    onFeedback(`Cleared ${ign}'s ${mode} placement (set to Untested).`);
  };

  const handleClearAllTiers = (playerId: string, ign: string) => {
    if (window.confirm(`Reset all tierlist placements for ${ign}?`)) {
      updatePlayerTier(playerId, 'Bedfight', 'Untested', 'Admin', 'N/A', 'Reset');
      updatePlayerTier(playerId, 'Skywars', 'Untested', 'Admin', 'N/A', 'Reset');
      updatePlayerTier(playerId, 'Mace', 'Untested', 'Admin', 'N/A', 'Reset');
      updatePlayerTier(playerId, 'Fireball Fight', 'Untested', 'Admin', 'N/A', 'Reset');
      onFeedback(`Reset all 4 gamemode tiers for ${ign} to Untested.`);
    }
  };

  const filteredPlayers = players.filter(p =>
    p.ign.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.discordTag.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-950/20 via-[#0E4A87]/80 to-[#0E4A87]/70 border-2 border-red-500/50 shadow-2xl space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400">
          <Trash2 size={22} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black heading-gold">Leaderboard, Tierlist & Player Removal</h2>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-mono">
              Admin Moderation
            </span>
          </div>
          <p className="text-xs text-sky-200">
            Instantly remove players from the active leaderboard standings, wipe their tierlist placements, or delete them from the platform.
          </p>
        </div>
      </div>

      {players.length === 0 ? (
        <div className="p-6 rounded-2xl bg-[#0B3C70]/55 border border-white/20 text-center text-xs text-sky-200 font-mono">
          No players currently registered in the database. Use "Publish Test Result" or "Players Roster" to register players.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick Remove Action Panel */}
          {targetPlayer && (
            <div className="p-4 rounded-2xl bg-[#0B3C70]/55 border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <GamerAvatar name={targetPlayer.ign} size="md" rank={targetPlayer.rank} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white font-mono">{targetPlayer.ign}</span>
                    <span className="text-xs font-mono text-amber-400 font-bold">#{targetPlayer.globalRank}</span>
                  </div>
                  <span className="text-xs text-sky-200 font-mono">
                    BF: {targetPlayer.tiers.Bedfight} | SW: {targetPlayer.tiers.Skywars} | Mace: {targetPlayer.tiers.Mace} | FB: {targetPlayer.tiers['Fireball Fight']}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleClearGamemodeTier(targetPlayer.id, targetPlayer.ign, selectedMode)}
                  className="px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Remove from {selectedMode} Tierlist
                </button>
                <button
                  type="button"
                  onClick={() => handleClearAllTiers(targetPlayer.id, targetPlayer.ign)}
                  className="px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Reset All Tiers
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveFromEntirePlatform(targetPlayer.id, targetPlayer.ign)}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 size={13} />
                  <span>Remove from Platform</span>
                </button>
              </div>
            </div>
          )}

          {/* Searchable Players Moderation List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-200 font-mono">
                Active Players Roster ({players.length})
              </span>
              <input
                type="text"
                placeholder="Filter player to moderate..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#0B3C70]/55 border border-white/20 focus:border-red-500 rounded-xl text-xs text-white placeholder-sky-300 focus:outline-none"
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/20">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B3C70]/55 text-sky-200 uppercase text-[10px] font-mono border-b border-white/20">
                  <tr>
                    <th className="py-2.5 px-3">Player</th>
                    <th className="py-2.5 px-3">Bedfight</th>
                    <th className="py-2.5 px-3">Skywars</th>
                    <th className="py-2.5 px-3">Mace</th>
                    <th className="py-2.5 px-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/15 font-mono">
                  {filteredPlayers.map((p) => (
                    <tr key={p.id} className="hover:bg-[#1565C0]/60/60 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <GamerAvatar name={p.ign} size="sm" rank={p.rank} />
                          <div>
                            <span className="font-bold text-white block">{p.ign}</span>
                            <span className="text-[10px] text-sky-200">#{p.globalRank} • {getPlayerPoints(p)} PTS</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-sky-100">{p.tiers.Bedfight || 'Untested'}</td>
                      <td className="py-2.5 px-3 text-sky-100">{p.tiers.Skywars || 'Untested'}</td>
                      <td className="py-2.5 px-3 text-sky-100">{p.tiers.Mace || 'Untested'}</td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleClearAllTiers(p.id, p.ign)}
                            className="px-2 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 text-[11px] font-bold cursor-pointer"
                            title="Reset all tiers to Untested"
                          >
                            Clear Tiers
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromEntirePlatform(p.id, p.ign)}
                            className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/50 text-red-300 text-[11px] font-bold cursor-pointer flex items-center gap-1"
                            title="Remove from platform, leaderboard, and tierlist"
                          >
                            <Trash2 size={11} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
