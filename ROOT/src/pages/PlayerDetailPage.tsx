import React from 'react';
import { useData } from '../context/DataContext';
import {
  Users,
  Shield,
  Trophy,
  CheckCircle2,
  Calendar,
  Globe,
  Smartphone,
  Award,
  Clock,
  ChevronLeft,
  ArrowLeft,
  Sparkles,
  Zap,
  Flame,
  Share2
} from 'lucide-react';
import { TierBadge } from '../components/TierBadge';
import { GamerAvatar } from '../components/GamerAvatar';
import { RankBadge } from '../components/RankBadge';
import { GamemodeIcon } from '../components/GamemodeIcon';
import { INITIAL_GAMEMODES, getPlayerPoints } from '../data/initialData';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export const PlayerDetailPage: React.FC = () => {
  const { players, selectedPlayerId, navigateTo, testResults } = useData();

  const player = players.find((p) => p.id === selectedPlayerId) || players[0];

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1976D2', '#42A5F5', '#F59E0B', '#10B981']
    });
  };

  if (!player) {
    return (
      <div className="text-center py-20">
        <p className="text-sky-200">Player not found.</p>
        <button
          onClick={() => navigateTo('players')}
          className="mt-4 px-4 py-2 rounded-xl bg-[#1976D2] text-white text-xs font-bold cursor-pointer"
        >
          Back to Players
        </button>
      </div>
    );
  }

  const playerTests = testResults.filter(
    (tr) => tr.playerId === player.id || tr.playerIgn.toLowerCase() === player.ign.toLowerCase()
  );

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('leaderboards')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E4A87]/70 hover:bg-[#1565C0]/60 border border-white/20 text-xs font-semibold text-sky-100 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Standings</span>
        </button>

        <button
          onClick={triggerConfetti}
          className="px-3.5 py-1.5 rounded-xl bg-[#1976D2]/20 hover:bg-[#1976D2]/30 border border-[#1976D2]/40 text-sky-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-glow-blue-sm cursor-pointer"
        >
          <Sparkles size={13} className="text-amber-400" />
          <span>Celebrate Tier 🚀</span>
        </button>
      </div>

      {/* Hero Profile Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0E4A87]/85 via-[#151522] to-[#0B3C70]/55 border border-[#1976D2]/40 p-6 sm:p-10 shadow-2xl"
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#1976D2]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <GamerAvatar name={player.ign} size="xl" rank={player.rank} />
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-[#0B3C70]/55 border border-white/20 text-[11px] font-mono text-amber-400 font-bold shadow">
                #{player.globalRank}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-3xl sm:text-4xl font-black heading-gold tracking-tight">
                  {player.ign}
                </h1>
                {player.rank && <RankBadge rank={player.rank} size="md" />}
                {player.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 size={12} />
                    <span>Verified Competitor</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-sky-200">
                <span className="text-sky-200 font-semibold">{player.discordTag}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Globe size={12} />
                  <span>Region: {player.region}</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Smartphone size={12} />
                  <span>Device: {player.device}</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Joined {player.joinDate}</span>
                </span>
              </div>

              <p className="text-sm text-sky-100 max-w-xl leading-relaxed pt-1">
                {player.bio || 'Competitive Bedrock warrior actively competing in Bedrock Union sanctioned tier tests and tournaments.'}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col gap-3 w-full md:w-auto">
            <div className="p-4 rounded-xl bg-[#0B3C70]/55 border border-white/20 text-center min-w-[120px] shadow-lg">
              <div className="text-xs text-sky-300 uppercase font-mono">Total Points</div>
              <div className="text-2xl font-black text-[#42A5F5] font-mono">{getPlayerPoints(player).toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0B3C70]/55 border border-white/20 text-center min-w-[120px] shadow-lg">
              <div className="text-xs text-sky-300 uppercase font-mono">Win Rate</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">{player.winRate}%</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid: 3 Gamemode Current Tiers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#42A5F5]">
            <Award size={14} />
            <span>Gamemode Tier Ratings</span>
          </div>
          <span className="text-xs text-sky-300">Season 4 Active Ranks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {INITIAL_GAMEMODES.map((gm, idx) => {
            const currentTier = player.tiers[gm.id] || 'Untested';
            const isTested = currentTier !== 'Untested' && currentTier !== 'Unranked';
            return (
              <motion.div
                key={gm.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-2xl border transition-all space-y-3 ${
                  isTested
                    ? 'bg-gradient-to-br from-[#0E4A87]/85 to-[#1a1a2b] border-[#1976D2]/50 shadow-glow-blue-sm'
                    : 'bg-[#0E4A87]/70 border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#0B3C70]/55 border border-white/20">
                      <GamemodeIcon gamemode={gm.id} size={20} />
                    </div>
                    <span className="font-bold text-white text-base">{gm.name}</span>
                  </div>
                  <TierBadge tier={currentTier} size="md" pulse={isTested} />
                </div>

                <p className="text-xs text-sky-200 leading-relaxed">
                  {gm.description}
                </p>

                <div className="pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] text-sky-200">
                  <span>Status: <strong className={isTested ? 'text-emerald-400' : 'text-sky-200'}>{isTested ? 'Officially Certified' : 'Untested'}</strong></span>
                  {isTested && <span className="text-sky-300 font-mono font-bold">Passed</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Historical Test Results Log */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Clock size={14} />
            <span>Official Tier Test History</span>
          </div>
          <span className="text-xs text-sky-300">Audited by Bedrock Union Testers</span>
        </div>

        {playerTests.length > 0 ? (
          <div className="rounded-2xl slab-3d bg-[#0E4A87]/70 border border-white/20 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0B3C70]/75 text-sky-200 uppercase text-[11px] font-mono tracking-wider border-b border-white/20">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Gamemode</th>
                    <th className="py-3.5 px-4">Tier Outcome</th>
                    <th className="py-3.5 px-4">Match Score</th>
                    <th className="py-3.5 px-4">Tester</th>
                    <th className="py-3.5 px-4">Evaluator Feedback Notes</th>
                    <th className="py-3.5 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/15 text-xs">
                  {playerTests.map((test) => (
                    <tr key={test.id} className="hover:bg-[#1565C0]/60/60 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-semibold text-white flex items-center gap-2">
                        <GamemodeIcon gamemode={test.gamemode} size={16} />
                        <span>{test.gamemode}</span>
                      </td>
                      <td className="py-4 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-sky-200">{test.previousTier}</span>
                          <span className="text-sky-300 font-bold">&rarr;</span>
                          <TierBadge tier={test.newTier} size="md" pulse />
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-emerald-400">{test.score}</td>
                      <td className="py-4 px-4 font-semibold text-sky-200">{test.testerName}</td>
                      <td className="py-4 px-4 text-sky-100 max-w-sm whitespace-pre-line leading-relaxed">{test.notes}</td>
                      <td className="py-4 px-4 text-right font-mono text-sky-200">{test.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl slab-3d bg-[#0E4A87]/70 border border-white/20 text-center space-y-2">
            <p className="text-sm text-sky-200">No test records registered yet for {player.ign}.</p>
            <p className="text-xs text-sky-300">Apply for a tier test via Discord to have your matches audited and recorded here.</p>
          </div>
        )}
      </div>
    </div>
  );
};