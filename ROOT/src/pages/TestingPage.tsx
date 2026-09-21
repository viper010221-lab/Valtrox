import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  ClipboardCheck,
  CheckCircle2,
  Shield,
  Award,
  ExternalLink,
  Calculator,
  ArrowRight,
  Video
} from 'lucide-react';
import { GamemodeIcon } from '../components/GamemodeIcon';
import { TierBadge } from '../components/TierBadge';
import { INITIAL_GAMEMODES } from '../data/initialData';
import { Gamemode, TierRank } from '../types';

export const TestingPage: React.FC = () => {
  const { testers, serverConfig, navigateTo } = useData();

  const [calcGamemode, setCalcGamemode] = useState<Gamemode>('Bedfight');
  const [rounds, setRounds] = useState<Array<'win' | 'loss' | null>>([null, null, null]);
  const [testerTier, setTesterTier] = useState<TierRank>('HT1');

  // Derive win/loss counts from the rounds array.
  const roundsWon = rounds.filter((r) => r === 'win').length;
  const roundsLost = rounds.filter((r) => r === 'loss').length;
  const roundsPlayed = roundsWon + roundsLost;

  // Cycle a single round: undecided → win → loss → undecided.
  const cycleRound = (index: number) => {
    setRounds((prev) => {
      const next = [...prev];
      const cur = next[index];
      next[index] = cur === null ? 'win' : cur === 'win' ? 'loss' : null;
      return next;
    });
  };

  const resetRounds = () => setRounds([null, null, null]);

  const calculatePredictedTier = (): { tier: TierRank; confidence: string; reason: string } => {
    // Score-aware FT3 mapping (first-to-3). Checked most-specific-first.
    if (roundsWon === 3 && roundsLost === 0) return { tier: 'HT1', confidence: '98%', reason: 'Dominant 3-0 sweep in official FT3 qualifies for High S Tier (HT1).' };
    if (roundsWon === 3 && roundsLost === 1) return { tier: 'MT1', confidence: '95%', reason: 'Convincing 3-1 win qualifies for Mid S Tier (MT1).' };
    if (roundsWon === 3 && roundsLost === 2) return { tier: 'LT1', confidence: '90%', reason: 'Clutch 3-2 win qualifies for Low S Tier (LT1) mechanics and game sense.' };
    if (roundsWon === 2 && roundsLost === 0) return { tier: 'HT2', confidence: '88%', reason: 'Strong 2-0 lead against an official evaluator demonstrates High A Tier (HT2).' };
    if (roundsWon === 2 && roundsLost === 1) return { tier: 'MT2', confidence: '85%', reason: 'Competitive 2-1 result qualifies for Mid A Tier (MT2).' };
    if (roundsWon === 1 && roundsLost <= 2) return { tier: 'HT3', confidence: '80%', reason: 'Won a round against an official evaluator — High B Tier (HT3).' };
    if (roundsWon === 1) return { tier: 'MT3', confidence: '75%', reason: 'Competitive rounds in a 1-3 loss — Mid B Tier (MT3).' };
    return { tier: 'MT4', confidence: '70%', reason: 'Entry calibration — placed at Mid C Tier (MT4).' };
  };

  const prediction = calculatePredictedTier();

  // What would the player reach if they won the very next round?
  const getNextTierGuidance = (): { label: string; emoji: string } => {
    if (roundsPlayed === 0) return { label: 'Tap a round to start simulating', emoji: '👆' };
    const hypothetical = [...rounds, 'win'] as Array<'win' | 'loss' | null>;
    const hWon = hypothetical.filter((r) => r === 'win').length;
    const hLost = hypothetical.filter((r) => r === 'loss').length;
    // Re-run the same FT3 logic on the hypothetical score.
    let nextTier: TierRank = 'MT4';
    if (hWon === 3 && hLost <= 2) nextTier = hLost <= 0 ? 'HT1' : hLost === 1 ? 'MT1' : 'LT1';
    else if (hWon === 2 && hLost <= 1) nextTier = hLost === 0 ? 'HT2' : 'MT2';
    else if (hWon === 1 && hLost <= 2) nextTier = 'HT3';
    else nextTier = 'MT3';
    if (nextTier === prediction.tier) return { label: 'Maximum tier reached for this score', emoji: '✅' };
    return { label: `Win next round → ${nextTier}`, emoji: '🏆' };
  };

  const guidance = getNextTierGuidance();
  const winRate = roundsPlayed > 0 ? Math.round((roundsWon / roundsPlayed) * 100) : 0;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#42A5F5]">
            <ClipboardCheck size={14} />
            <span>Bedrock Union Testing Standard</span>
          </div>
          <h1 className="text-3xl font-extrabold heading-gold tracking-tight mt-1">
            Tier Testing & Evaluation Guide
          </h1>
          <p className="text-sm text-sky-200 mt-1">
            Official 1v1 testing protocol for <strong>Bedfight</strong>, <strong>Skywars</strong>, <strong>Mace</strong>, and <strong>Fireball Fight</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0E4A87]/70 border border-white/20 text-xs font-mono text-sky-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Queue: <strong className="text-emerald-400">{serverConfig.testingStatus}</strong></span>
          </div>
          <a
            href={serverConfig.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-[#1976D2] hover:bg-[#42A5F5] text-white text-xs font-bold shadow-glow-blue-sm transition-all flex items-center gap-1.5"
          >
            <span>Apply in Discord</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* 4-Step Process */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-[#0E4A87]/70 border border-white/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-900/30 border border-[#1976D2]/40 flex items-center justify-center font-mono font-bold text-[#42A5F5]">
            01
          </div>
          <h3 className="font-bold text-white text-base">Open Testing Ticket</h3>
          <p className="text-xs text-sky-200 leading-relaxed">
            Navigate to <strong>#tier-testing-apply</strong> in Discord and choose Bedfight, Skywars, Mace, or Fireball Fight.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0E4A87]/70 border border-white/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-900/30 border border-[#1976D2]/40 flex items-center justify-center font-mono font-bold text-[#42A5F5]">
            02
          </div>
          <h3 className="font-bold text-white text-base">POV & Client Check</h3>
          <p className="text-xs text-sky-200 leading-relaxed">
            Launch approved Minecraft Bedrock client with screen recording active and input display.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0E4A87]/70 border border-white/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-900/30 border border-[#1976D2]/40 flex items-center justify-center font-mono font-bold text-[#42A5F5]">
            03
          </div>
          <h3 className="font-bold text-white text-base">First-to-3 Set</h3>
          <p className="text-xs text-sky-200 leading-relaxed">
            Duel a verified Tester on the official Bedrock Union server under strict recording rules.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0E4A87]/70 border border-white/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-900/30 border border-[#1976D2]/40 flex items-center justify-center font-mono font-bold text-emerald-400">
            04
          </div>
          <h3 className="font-bold text-white text-base">Council Evaluation</h3>
          <p className="text-xs text-sky-200 leading-relaxed">
            Tester grades score, mechanics, and game sense, publishing your official Tier Badge instantly.
          </p>
        </div>
      </div>

      {/* Interactive Simulator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0E4A87]/85 via-[#1257A0] to-[#0B3C70]/55 border border-[#1976D2]/40 shadow-[0_10px_35px_rgba(25,118,210,0.15)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#42A5F5]">
              <Calculator size={16} />
              <span>Interactive Simulation Tool</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">Tier Test Score Estimator</h3>
            <p className="text-xs text-sky-200">
              Input test rounds won vs an official tester to calculate your predicted Bedrock Union tier rating.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#1976D2]/20 border border-[#1976D2]/30 text-sky-200 text-xs font-semibold">
            Algorithm v4.2
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-4 md:col-span-2">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-sky-200 block mb-1.5">Gamemode</label>
                  <select
                    value={calcGamemode}
                    onChange={(e) => setCalcGamemode(e.target.value as Gamemode)}
                    className="w-full px-3 py-2 bg-[#0B3C70]/55 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#1976D2]"
                  >
                    {INITIAL_GAMEMODES.map((gm) => (
                      <option key={gm.id} value={gm.id}>{gm.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-sky-200 block mb-1.5">Tester Rank</label>
                  <select
                    value={testerTier}
                    onChange={(e) => setTesterTier(e.target.value as TierRank)}
                    className="w-full px-3 py-2 bg-[#0B3C70]/55 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#1976D2]"
                  >
                    <option value="HT1">High Tier 1 Tester (HT1)</option>
                    <option value="LT1">Low Tier 1 Tester (LT1)</option>
                    <option value="HT2">High Tier 2 Tester (HT2)</option>
                  </select>
                </div>
              </div>

              {/* Round-by-round scoreboard */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-sky-200">FT3 Match Rounds</label>
                  <button onClick={resetRounds} className="inline-flex items-center min-h-[36px] px-1 text-[10px] text-sky-300 hover:text-[#42A5F5] transition-colors font-semibold uppercase tracking-wider cursor-pointer">Reset</button>
                </div>
                <div className="flex items-center gap-3">
                  {rounds.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => cycleRound(i)}
                      className={`relative flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${
                        r === 'win'
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : r === 'loss'
                          ? 'bg-red-500/15 border-red-500/50 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                          : 'bg-[#0B3C70]/55 border-white/20 text-sky-300 hover:border-[#1976D2]/40 hover:text-sky-100'
                      }`}
                    >
                      <span className="block text-[10px] opacity-60 mb-0.5">R{i + 1}</span>
                      {r === 'win' ? 'W' : r === 'loss' ? 'L' : '—'}
                    </button>
                  ))}
                </div>
                {/* Live score line */}
                <div className="mt-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">Score</span>
                    <span className="text-sm font-extrabold text-white font-mono">
                      You <span className="text-emerald-400">{roundsWon}</span>
                      <span className="text-sky-300 mx-1">–</span>
                      <span className="text-red-400">{roundsLost}</span> Tester
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-sky-300">{roundsPlayed}/3 rounds</span>
                </div>
                {/* Win-rate progress bar */}
                <div className="mt-2 h-1.5 w-full rounded-full bg-[#0B3C70]/55 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1976D2] to-emerald-400 transition-all duration-300"
                    style={{ width: `${winRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B3C70]/60 border border-white/20 text-xs text-sky-200 flex items-start gap-2.5">
              <Shield size={16} className="text-sky-300 mt-0.5 flex-shrink-0" />
              <span>
                Calculated for a standard <strong>First-to-3 (FT3)</strong> test match in Bedfight, Skywars, Mace, or Fireball Fight.
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B3C70]/55 border border-[#1976D2]/40 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-sky-300 uppercase">Estimated Tier</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#1976D2]/15 border border-[#1976D2]/30 text-sky-200">
                  FT3 · {roundsWon}-{roundsLost}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <TierBadge tier={prediction.tier} size="xl" pulse />
                <div className="flex-1">
                  <span className="text-sm font-extrabold text-white block">{prediction.tier}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{prediction.confidence} Confidence</span>
                </div>
              </div>

              {/* Win-rate gauge */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-sky-300 uppercase tracking-wider">Round Win Rate</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">{winRate}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#0E4A87]/70 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-300"
                    style={{ width: `${winRate}%` }}
                  />
                </div>
              </div>

              {/* Next-tier guidance */}
              <div className="mt-4 p-3 rounded-lg bg-[#0E4A87]/70 border border-white/20 flex items-start gap-2">
                <span className="text-sm leading-none">{guidance.emoji}</span>
                <div>
                  <span className="text-[11px] font-bold text-white block">{guidance.label}</span>
                  <span className="text-[10px] text-sky-300 leading-relaxed mt-0.5 block">{prediction.reason}</span>
                </div>
              </div>
            </div>

            <a
              href={serverConfig.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-[#1976D2] hover:bg-[#42A5F5] text-white text-xs font-bold text-center block transition-all shadow-glow-blue-sm"
            >
              Queue Real Test on Discord &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#0E4A87]/70 border border-white/20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 size={16} />
            <span>Eligibility Requirements</span>
          </div>
          <ul className="space-y-3 text-xs text-sky-100 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
              <span><strong>Verified Minecraft Bedrock Edition:</strong> Valid Gamertag with Xbox Live link.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
              <span><strong>Ping Ceiling:</strong> Maximum latency of 120ms to the test region server.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
              <span><strong>Discord Voice Presence:</strong> Must be in the designated Bedrock Union testing voice channel during the match.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[#0E4A87]/70 border border-white/20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
            <Video size={16} />
            <span>Recording & Anti-Cheat Standards</span>
          </div>
          <ul className="space-y-3 text-xs text-sky-100 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300 mt-1.5" />
              <span><strong>Uncut POV Required:</strong> Full 1080p/720p 60fps recording from match start to finish.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300 mt-1.5" />
              <span><strong>Input Overlay:</strong> Keyboard/mouse overlay or handcam (mandatory for Touch device competitors).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};