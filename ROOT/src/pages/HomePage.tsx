import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Shield,
  Trophy,
  Layers,
  Sparkles,
  Zap,
  Users,
  Award,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Flame,
  Sliders,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { GamemodeIcon } from '../components/GamemodeIcon';
import { TierBadge } from '../components/TierBadge';
import { GamerAvatar } from '../components/GamerAvatar';
import { RankBadge } from '../components/RankBadge';
import { DiscordWidget } from '../components/DiscordWidget';
import { INITIAL_GAMEMODES, getPlayerPoints } from '../data/initialData';
import { Gamemode, TierRank } from '../types';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  const { players, testResults, serverConfig, navigateTo, setSelectedGamemode, perfMode } = useData();
  const [selectedShowcaseMode, setSelectedShowcaseMode] = useState<Gamemode>('Bedfight');

  // Interactive quick calculator state
  const [calcMode, setCalcMode] = useState<Gamemode>('Bedfight');
  const [calcScore, setCalcScore] = useState<string>('3-1');
  const [calcMechanics, setCalcMechanics] = useState<string>('High');

  const getSimulatedTier = (): TierRank => {
    if (calcScore === '3-0' && calcMechanics === 'Elite') return 'HT1';
    if (calcScore === '3-0') return 'MT1';
    if (calcScore === '3-1' && calcMechanics === 'Elite') return 'LT1';
    if (calcScore === '3-1') return 'HT2';
    if (calcScore === '3-2' && calcMechanics === 'High') return 'MT2';
    if (calcScore === '3-2') return 'LT2';
    if (calcScore === '2-3' && calcMechanics === 'High') return 'HT3';
    if (calcScore === '2-3') return 'MT3';
    if (calcScore === '1-3' && calcMechanics === 'High') return 'LT3';
    if (calcScore === '1-3') return 'HT4';
    if (calcScore === '0-3' && calcMechanics === 'High') return 'MT4';
    if (calcScore === '0-3' && calcMechanics === 'Medium') return 'LT4';
    if (calcScore === '0-3') return 'LT5';
    return 'MT4';
  };

  const showcasePlayers = players
    .filter((p) => {
      const tier = p.tiers[selectedShowcaseMode];
      return tier && tier !== 'Untested' && tier !== 'Unranked';
    })
    .sort((a, b) => {
      const pa = getPlayerPoints(a);
      const pb = getPlayerPoints(b);
      if (pb !== pa) return pb - pa;
      return (b.winRate ?? 0) - (a.winRate ?? 0);
    })
    .slice(0, 5);

  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-10 overflow-hidden">
        {/* Glow ambient background orbs */}
        {perfMode === 'pc' && (
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-[#7C3AED]/25 to-[#8B5CF6]/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 right-10 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-[100px] pointer-events-none" />
          </>
        )}

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#171722]/90 border border-[#7C3AED]/50 shadow-glow-purple-sm text-xs font-semibold text-purple-300 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C3AED]"></span>
            </span>
            <span>Minecraft Bedrock Competitive Community</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]"
          >
            The Standard for <br className="hidden sm:inline" />
            <span className="gradient-text-purple">Bedrock Tier Testing</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 font-normal leading-relaxed"
          >
            Bedrock Union is the official competitive gaming platform for Minecraft Bedrock. Discover standardized
            tierlists for <strong className="text-zinc-200">Bedfight</strong>, <strong className="text-zinc-200">Skywars</strong>, and <strong className="text-zinc-200">Mace</strong>, <strong className="text-zinc-200">Fireball Fight</strong>, get tested by verified veterans, track rankings, and dominate scrims.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <a
              href={serverConfig.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white font-bold text-sm shadow-glow-purple flex items-center gap-2 transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <span>Join Official Discord</span>
              <ExternalLink size={16} />
            </a>

            <button
              onClick={() => navigateTo('leaderboards')}
              className="px-6 py-3.5 rounded-xl bg-[#171722] hover:bg-[#1F1F2E] border border-[#252538] hover:border-[#7C3AED]/60 text-white font-semibold text-sm flex items-center gap-2 transition-all transform hover:-translate-y-1 cursor-pointer shadow-lg"
            >
              <Trophy size={16} className="text-amber-400" />
              <span>Gamemode Rankings</span>
            </button>

            <button
              onClick={() => navigateTo('testing')}
              className="px-6 py-3.5 rounded-xl bg-[#171722]/80 hover:bg-[#171722] border border-[#252538] hover:border-purple-500/40 text-zinc-300 hover:text-white font-medium text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Award size={16} className="text-[#8B5CF6]" />
              <span>Tier Testing Guide</span>
            </button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-10 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-5 rounded-2xl bg-[#171722]/90 border border-[#252538] backdrop-blur-xl shadow-2xl">
              <div className="p-3 text-center border-r border-[#252538] last:border-0 group">
                <div className="text-3xl font-extrabold text-white font-mono group-hover:scale-105 transition-transform">
                  128
                </div>
                <div className="text-xs text-zinc-400 font-medium mt-1">Verified Players</div>
              </div>
              <div className="p-3 text-center border-r border-[#252538] last:border-0 group">
                <div className="text-3xl font-extrabold text-[#8B5CF6] font-mono group-hover:scale-105 transition-transform">
                  2
                </div>
                <div className="text-xs text-zinc-400 font-medium mt-1">Tier Tests Completed</div>
              </div>
              <div className="p-3 text-center border-r border-[#252538] last:border-0 group">
                <div className="text-3xl font-extrabold text-white font-mono group-hover:scale-105 transition-transform">
                  {serverConfig.discordMembers.toLocaleString()}
                </div>
                <div className="text-xs text-zinc-400 font-medium mt-1">Discord Members</div>
              </div>
              <div className="p-3 text-center group">
                <div className="text-3xl font-extrabold text-emerald-400 font-mono group-hover:scale-105 transition-transform">4 Modes</div>
                <div className="text-xs text-zinc-400 font-medium mt-1">Bedfight, Skywars, Mace, Fireball Fight</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RECENT RESULTS TICKER */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
              <Sparkles size={14} />
              <span>Live Testing Audit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Recent Tier Test Results</h2>
          </div>
          <button
            onClick={() => navigateTo('results')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View all public results ({testResults.length})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(perfMode === 'phone' ? testResults.slice(0, 4) : testResults).map((result, idx) => (
            <motion.div
              key={result.id}
              initial={perfMode === 'pc' ? { opacity: 0, y: 15 } : false}
              animate={perfMode === 'pc' ? { opacity: 1, y: 0 } : { opacity: 1 }}
              transition={perfMode === 'pc' ? { delay: idx * 0.15 } : undefined}
              onClick={() => navigateTo('results')}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#171722] to-[#1a1a26] border border-[#252538] hover:border-[#7C3AED]/60 transition-all transform hover:-translate-y-1 cursor-pointer space-y-4 group shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#0F0F17] border border-[#252538]">
                    <GamemodeIcon gamemode={result.gamemode} size={18} />
                  </div>
                  <span className="text-sm font-bold text-zinc-200">{result.gamemode}</span>
                </div>
                <span className="text-xs text-zinc-400 font-mono px-2.5 py-1 rounded bg-[#0F0F17] border border-[#252538]">
                  {result.date}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-white group-hover:text-purple-300 transition-colors text-lg">
                    {result.playerIgn}
                  </span>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Tested by <strong className="text-purple-400">{result.testerName}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs text-zinc-400 px-2 py-0.5 rounded bg-[#0F0F17] border border-[#252538]">
                    {result.previousTier}
                  </span>
                  <span className="text-purple-400 font-black text-sm">&rarr;</span>
                  <TierBadge tier={result.newTier} size="lg" pulse />
                </div>
              </div>

              <div className="pt-3 border-t border-[#252538]/70 flex items-center justify-between text-xs text-zinc-400">
                <span>Match Score: <strong className="text-emerald-400 font-mono text-sm">{result.score}</strong></span>
                <span className="text-purple-400 font-semibold group-hover:underline flex items-center gap-1">
                  <span>View Breakdown</span>
                  <ArrowUpRight size={12} />
                </span>
              </div>

              {result.notes && (
                <div className="text-xs text-zinc-300 bg-[#0F0F17]/90 p-3 rounded-xl border border-[#252538]/80 whitespace-pre-line leading-relaxed">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1">
                    Tester Feedback
                  </div>
                  {result.notes}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* GAMEMODE SPOTLIGHT (3 Modes) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">Competitive Roster</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Official Supported Gamemodes</h2>
          </div>
          <button
            onClick={() => navigateTo('tierlist')}
            className="px-4 py-2 rounded-xl bg-[#171722] border border-[#252538] hover:border-[#7C3AED]/50 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Explore All Tierlists</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_GAMEMODES.map((gm, idx) => (
            <motion.div
              key={gm.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => {
                setSelectedGamemode(gm.id);
                navigateTo('tierlist');
              }}
              className="p-6 rounded-2xl bg-[#171722] border border-[#252538] hover:border-[#7C3AED]/60 transition-all cursor-pointer group flex flex-col justify-between space-y-5 shadow-xl relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-xl bg-[#0F0F17] border border-[#252538] group-hover:border-[#7C3AED]/50 transition-colors">
                    <GamemodeIcon gamemode={gm.id} size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {gm.name}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1.5">
                    {gm.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#252538] flex items-center justify-between text-xs text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
                <span>View {gm.name} Standings & Tierlist</span>
                <ChevronRight size={15} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GAMEMODE STANDINGS SHOWCASE (Replaces Global Leaderboard) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Trophy size={14} />
              <span>Standardized Standings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Gamemode Standings Spotlight</h2>
          </div>

          {/* Gamemode Switcher Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#171722] border border-[#252538]">
            {INITIAL_GAMEMODES.map((gm) => (
              <button
                key={gm.id}
                onClick={() => setSelectedShowcaseMode(gm.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedShowcaseMode === gm.id
                    ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <GamemodeIcon gamemode={gm.id} size={13} />
                <span>{gm.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#171722] border border-[#252538] overflow-hidden shadow-2xl">
          {showcasePlayers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0F0F17]/90 text-zinc-400 uppercase text-[11px] font-mono tracking-wider border-b border-[#252538]">
                  <tr>
                    <th className="py-4 px-4 sm:px-6">Rank</th>
                    <th className="py-4 px-4">Player</th>
                    <th className="py-4 px-4">Region</th>
                    <th className="py-4 px-4">{selectedShowcaseMode} Tier</th>
                    <th className="py-4 px-4 text-center">Win Rate</th>
                    <th className="py-4 px-4 text-right">Points</th>
                    <th className="py-4 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252538]/60">
                  {showcasePlayers.map((player, idx) => (
                    <tr
                      key={player.id}
                      className="hover:bg-[#1F1F2E]/70 transition-colors group cursor-pointer"
                      onClick={() => navigateTo('player-detail', player.id)}
                    >
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold">
                        {idx === 0 && <span className="text-amber-400 text-base">#1 👑</span>}
                        {idx === 1 && <span className="text-zinc-300 text-base">#2 🥈</span>}
                        {idx > 1 && <span className="text-zinc-400">#{idx + 1}</span>}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <GamerAvatar name={player.ign} size="md" rank={player.rank} />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white group-hover:text-purple-300 transition-colors">
                                {player.ign}
                              </span>
                              {player.rank && <RankBadge rank={player.rank} size="sm" />}
                              {player.verified && (
                                <span title="Verified Competitor">
                                  <CheckCircle2 size={14} className="text-emerald-400" />
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-zinc-400 font-mono">{player.discordTag}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-zinc-400">
                        <span className="px-2.5 py-0.5 rounded bg-[#0F0F17] border border-[#252538] text-xs">
                          {player.region}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <TierBadge tier={player.tiers[selectedShowcaseMode] || 'Untested'} size="md" pulse={idx === 0} />
                      </td>

                      <td className="py-4 px-4 text-center font-mono font-bold text-emerald-400">
                        {player.winRate}%
                      </td>

                      <td className="py-4 px-4 text-right font-mono font-extrabold text-[#8B5CF6]">
                        {getPlayerPoints(player).toLocaleString()} PTS
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateTo('player-detail', player.id);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0F0F17] hover:bg-[#7C3AED] text-zinc-300 hover:text-white border border-[#252538] hover:border-[#8B5CF6] text-xs font-semibold transition-all cursor-pointer"
                        >
                          Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-white">No players tested in {selectedShowcaseMode} yet</p>
              <p className="text-xs text-zinc-400">Be the first to duel our testers in Discord and take the #1 rank!</p>
            </div>
          )}

          <div className="p-4 bg-[#0F0F17]/90 border-t border-[#252538] flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              Showing top certified <strong className="text-white">{selectedShowcaseMode}</strong> competitors
            </span>
            <button
              onClick={() => navigateTo('leaderboards')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View Full {selectedShowcaseMode} Leaderboard</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TIER SIMULATOR WIDGET */}
      <section className="p-8 rounded-3xl bg-gradient-to-br from-[#171722] via-[#1A1A28] to-[#12121B] border border-[#7C3AED]/40 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#7C3AED]/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-xs font-bold uppercase tracking-wider text-purple-300">
              <Zap size={13} className="text-amber-400" />
              <span>Interactive Tier Estimator</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Test Your Estimated Tier Placement
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Wondering where you will place before booking your official test? Input your scrim win rates and mechanical precision to calculate your predicted Bedrock Union tier.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Gamemode</label>
                <select
                  value={calcMode}
                  onChange={(e) => setCalcMode(e.target.value as Gamemode)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F17] border border-[#252538] focus:border-[#7C3AED] text-xs text-white focus:outline-none"
                >
                  <option value="Bedfight">Bedfight</option>
                  <option value="Skywars">Skywars</option>
                  <option value="Mace">Mace</option>
                  <option value="Fireball Fight">Fireball Fight</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Tester Match Score</label>
                <select
                  value={calcScore}
                  onChange={(e) => setCalcScore(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F17] border border-[#252538] focus:border-[#7C3AED] text-xs text-white focus:outline-none"
                >
                  <option value="3-0">3 - 0 (Clean Sweep)</option>
                  <option value="3-1">3 - 1 (Dominant)</option>
                  <option value="3-2">3 - 2 (Close Win)</option>
                  <option value="2-3">2 - 3 (Close Loss)</option>
                  <option value="1-3">1 - 3 (Contested)</option>
                  <option value="0-3">0 - 3 (Learning)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Mechanics & Aim</label>
                <select
                  value={calcMechanics}
                  onChange={(e) => setCalcMechanics(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F17] border border-[#252538] focus:border-[#7C3AED] text-xs text-white focus:outline-none"
                >
                  <option value="Elite">Elite (100% precision)</option>
                  <option value="High">High (Smooth tracking)</option>
                  <option value="Medium">Medium (Consistent)</option>
                  <option value="Developing">Developing</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0F0F17]/90 border border-[#252538] flex flex-col items-center justify-center text-center space-y-4 shadow-inner">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Estimated Result</span>
            <div className="p-4">
              <TierBadge tier={getSimulatedTier()} size="xl" pulse />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">Estimated for {calcMode}</div>
              <div className="text-xs text-zinc-400 font-mono">Score: {calcScore} | Aim: {calcMechanics}</div>
            </div>
            <button
              onClick={() => navigateTo('testing')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold shadow-glow-purple-sm transition-all cursor-pointer"
            >
              Book Official Test in Discord &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* DISCORD CTA */}
      <DiscordWidget />
    </div>
  );
};