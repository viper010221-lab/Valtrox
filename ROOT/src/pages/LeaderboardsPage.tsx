import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Gamemode, TierRank } from '../types';
import { INITIAL_GAMEMODES, TIER_POINTS, getPlayerPoints } from '../data/initialData';
import { TierBadge } from '../components/TierBadge';
import { GamerAvatar } from '../components/GamerAvatar';
import { RankBadge } from '../components/RankBadge';
import {
  Trophy,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { GamemodeIcon } from '../components/GamemodeIcon';
import { motion, AnimatePresence } from 'framer-motion';

export const LeaderboardsPage: React.FC = () => {
  const { players, navigateTo, activeTab } = useData();
  const [activeBoard, setActiveBoard] = useState<Gamemode>('Bedfight');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  // Weighted sorting calculation across all 15 tiers (official tier point values)
  const tierRankWeights: Record<TierRank, number> = TIER_POINTS;

  const rankedPlayers = useMemo(() => {
    return [...players]
      .filter((p) => {
        const tier = p.tiers[activeBoard];
        const isTestedInMode = tier && tier !== 'Untested' && tier !== 'Unranked';
        if (!isTestedInMode) return false;

        const matchesSearch =
          p.ign.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.discordTag.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = selectedRegion === 'All' || p.region === selectedRegion;
        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        const scoreA = tierRankWeights[a.tiers[activeBoard] || 'Untested'];
        const scoreB = tierRankWeights[b.tiers[activeBoard] || 'Untested'];
        if (scoreB !== scoreA) return scoreB - scoreA;
        return b.winRate - a.winRate;
      });
  }, [players, activeBoard, searchTerm, selectedRegion]);

  const activeModeDetails = INITIAL_GAMEMODES.find((g) => g.id === activeBoard) || INITIAL_GAMEMODES[0];
  const topThree = rankedPlayers.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header with Glowing Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252538] pb-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-xs font-bold uppercase tracking-wider text-purple-300 shadow-glow-purple-sm">
            <Trophy size={13} className="text-amber-400" />
            <span>Gamemode Standings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
            Competitive Leaderboards
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Standardized Bedrock rankings certified exclusively for <strong className="text-white">Bedfight</strong>, <strong className="text-white">Skywars</strong>, and <strong className="text-white">Mace</strong>, and <strong className="text-white">Fireball Fight</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('testing')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white text-xs font-bold shadow-glow-purple transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            <Sparkles size={14} />
            <span>Queue for Tier Test &rarr;</span>
          </button>
        </div>
      </motion.div>

      {/* Gamemode Switcher Tabs with Layout Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {INITIAL_GAMEMODES.map((gm) => {
          const isSelected = activeBoard === gm.id;
          const countForMode = players.filter((p) => p.tiers[gm.id] && p.tiers[gm.id] !== 'Untested' && p.tiers[gm.id] !== 'Unranked').length;
          return (
            <motion.button
              key={gm.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveBoard(gm.id)}
              className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-br from-[#171722] to-[#1F1F2E] border-[#7C3AED] shadow-glow-purple'
                  : 'bg-[#171722]/60 hover:bg-[#171722] border-[#252538] hover:border-[#7C3AED]/40'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C3AED]/20 rounded-full blur-2xl pointer-events-none" />
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${isSelected ? 'bg-[#7C3AED] border-[#8B5CF6] text-white' : 'bg-[#0F0F17] border-[#252538] text-zinc-400'}`}>
                    <GamemodeIcon gamemode={gm.id} size={20} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                      {gm.name}
                    </h3>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {countForMode} certified {countForMode === 1 ? 'player' : 'players'}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7C3AED]/30 text-purple-300 border border-[#7C3AED]/50">
                    Active
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* TOP 3 PODIUM SECTION (Only for tested players in this mode) */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {topThree.map((player, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigateTo('player-detail', player.id)}
                className={`relative p-5 rounded-2xl border backdrop-blur-md cursor-pointer transition-all hover:-translate-y-1 group ${
                  isFirst
                    ? 'bg-gradient-to-b from-amber-500/10 via-[#171722] to-[#171722] border-amber-500/50 shadow-glow-gold'
                    : isSecond
                    ? 'bg-gradient-to-b from-slate-400/10 via-[#171722] to-[#171722] border-slate-400/40'
                    : 'bg-gradient-to-b from-amber-800/10 via-[#171722] to-[#171722] border-amber-700/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-black font-mono px-2.5 py-1 rounded-lg border ${
                    isFirst ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    isSecond ? 'bg-slate-400/20 text-slate-300 border-slate-400/40' :
                    'bg-amber-800/20 text-amber-400 border-amber-700/40'
                  }`}>
                    {isFirst ? '#1 Champion 👑' : isSecond ? '#2 Contender 🥈' : '#3 Challenger 🥉'}
                  </span>
                  <TierBadge tier={player.tiers[activeBoard] || 'Untested'} size="md" pulse={isFirst} />
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <div className="relative">
                    <GamerAvatar name={player.ign} size="lg" rank={player.rank} />
                    {isFirst && (
                      <span className="absolute -top-2 -right-1 text-sm">👑</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-white group-hover:text-purple-300 transition-colors text-base">
                        {player.ign}
                      </h4>
                      {player.rank && <RankBadge rank={player.rank} size="sm" />}
                      {player.verified && <CheckCircle2 size={14} className="text-emerald-400" />}
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">{player.discordTag}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#252538]/70 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-mono">Winrate: <strong className="text-emerald-400">{player.winRate}%</strong></span>
                  <span className="text-purple-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Inspect Profile</span>
                    <ChevronRight size={12} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#171722] border border-[#252538] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="relative w-full sm:max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder={`Search ${activeBoard} ranked players...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0F0F17] border border-[#252538] focus:border-[#7C3AED] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
            <Filter size={14} className="text-purple-400" />
            <span>Region:</span>
          </span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3.5 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
          >
            <option value="All">All Regions</option>
            <option value="NA">North America (NA)</option>
            <option value="EU">Europe (EU)</option>
            <option value="AS">Asia (AS)</option>
            <option value="SA">South America (SA)</option>
            <option value="OC">Oceania (OC)</option>
          </select>
        </div>
      </div>

      {/* Gamemode Leaderboard Table or Empty State */}
      {rankedPlayers.length > 0 ? (
        <div className="rounded-2xl bg-[#171722] border border-[#252538] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0F0F17]/90 text-zinc-400 uppercase text-[11px] font-mono tracking-wider border-b border-[#252538]">
                <tr>
                  <th className="py-4 px-4 sm:px-6">Pos</th>
                  <th className="py-4 px-4">Player</th>
                  <th className="py-4 px-4">Region</th>
                  <th className="py-4 px-4">Device</th>
                  <th className="py-4 px-4">{activeBoard} Tier Rank</th>
                  <th className="py-4 px-4 text-center">Win Rate</th>
                  <th className="py-4 px-4 text-right">Points</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252538]/60 text-xs">
                <AnimatePresence>
                  {rankedPlayers.map((player, idx) => (
                    <motion.tr
                      key={player.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: Math.min(idx * 0.04, 0.4) }}
                      onClick={() => navigateTo('player-detail', player.id)}
                      className="hover:bg-[#1F1F2E]/70 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold">
                        <div className="flex items-center gap-2">
                          {idx === 0 && <span className="text-amber-400 font-extrabold text-sm">1 👑</span>}
                          {idx === 1 && <span className="text-zinc-300 font-extrabold text-sm">2 🥈</span>}
                          {idx === 2 && <span className="text-amber-600 font-extrabold text-sm">3 🥉</span>}
                          {idx > 2 && <span className="text-zinc-400">{idx + 1}</span>}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <GamerAvatar name={player.ign} size="sm" rank={player.rank} />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white group-hover:text-purple-300 transition-colors text-sm">
                                {player.ign}
                              </span>
                              {player.rank && <RankBadge rank={player.rank} size="sm" />}
                              {player.verified && (
                                <span title="Verified Competitor">
                                  <CheckCircle2 size={13} className="text-emerald-400" />
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-zinc-400 font-mono">{player.discordTag}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-zinc-400">
                        <span className="px-2.5 py-1 rounded-lg bg-[#0F0F17] border border-[#252538]">
                          {player.region}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-zinc-300 font-medium">
                        {player.device}
                      </td>

                      <td className="py-4 px-4">
                        <TierBadge tier={player.tiers[activeBoard] || 'Untested'} size="md" pulse={idx === 0} />
                      </td>

                      <td className="py-4 px-4 text-center font-mono font-bold text-emerald-400">
                        {player.winRate}%
                      </td>

                      <td className="py-4 px-4 text-right font-mono font-extrabold text-[#8B5CF6] text-sm">
                        {getPlayerPoints(player).toLocaleString()} PTS
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateTo('player-detail', player.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0F0F17] hover:bg-[#7C3AED] text-zinc-300 hover:text-white border border-[#252538] hover:border-[#8B5CF6] text-xs font-semibold transition-all cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-[#171722] border border-[#252538] text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#0F0F17] border border-[#252538] flex items-center justify-center mx-auto text-purple-400">
            <GamemodeIcon gamemode={activeBoard} size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Certified {activeBoard} Players Yet</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Tier testing queues for {activeBoard} are currently open. Be the first player to duel an official evaluator and claim the #1 spot on the leaderboard!
            </p>
          </div>
          <button
            onClick={() => navigateTo('testing')}
            className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold shadow-glow-purple-sm transition-all cursor-pointer"
          >
            Apply for {activeBoard} Test &rarr;
          </button>
        </div>
      )}
    </div>
  );
};