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
  const [roundsWon, setRoundsWon] = useState<number>(6);
  const [roundsLost, setRoundsLost] = useState<number>(10);
  const [testerTier, setTesterTier] = useState<TierRank>('HT1');

  const calculatePredictedTier = (): { tier: TierRank; confidence: string; reason: string } => {
    if (roundsWon >= 10 && roundsLost <= 2) return { tier: 'HT1', confidence: '98%', reason: 'Dominant victory (10-0 to 10-2) in official FT10 qualifies for High S Tier (HT1).' };
    if (roundsWon >= 10 && roundsLost <= 5) return { tier: 'MT1', confidence: '95%', reason: 'Convincing FT10 win qualifies for Mid S Tier (MT1).' };
    if (roundsWon >= 10) return { tier: 'LT1', confidence: '90%', reason: 'Close FT10 win indicates Low S Tier (LT1) mechanics and game sense.' };
    if (roundsWon >= 8) return { tier: 'HT2', confidence: '88%', reason: 'Winning 8-9 rounds against an official evaluator demonstrates High A Tier (HT2).' };
    if (roundsWon >= 6) return { tier: 'MT2', confidence: '85%', reason: 'Competitive neutral exchanges and clutch trades qualify for Mid A Tier (MT2).' };
    if (roundsWon >= 4) return { tier: 'LT2', confidence: '82%', reason: 'Solid fundamentals qualify for Low A Tier (LT2).' };
    if (roundsWon >= 3) return { tier: 'HT3', confidence: '80%', reason: 'Consistent combo resets qualify for High B Tier (HT3).' };
    if (roundsWon >= 2) return { tier: 'MT3', confidence: '78%', reason: 'Good mechanical potential placed at Mid B Tier (MT3).' };
    if (roundsWon >= 1) return { tier: 'HT4', confidence: '75%', reason: 'Promising foundation placed at High C Tier (HT4).' };
    return { tier: 'MT4', confidence: '70%', reason: 'Entry calibration placed at Mid C Tier (MT4).' };
  };

  const prediction = calculatePredictedTier();

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252538] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
            <ClipboardCheck size={14} />
            <span>Valtrox Testing Standard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Tier Testing & Evaluation Guide
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Official 1v1 testing protocol for <strong>Bedfight</strong>, <strong>Skywars</strong>, <strong>Mace</strong>, and <strong>Fireball Fight</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#171722] border border-[#252538] text-xs font-mono text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Queue: <strong className="text-emerald-400">{serverConfig.testingStatus}</strong></span>
          </div>
          <a
            href={serverConfig.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold shadow-glow-purple-sm transition-all flex items-center gap-1.5"
          >
            <span>Apply in Discord</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* 4-Step Process */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-[#171722] border border-[#252538] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-[#7C3AED]/40 flex items-center justify-center font-mono font-bold text-[#8B5CF6]">
            01
          </div>
          <h3 className="font-bold text-white text-base">Open Testing Ticket</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Navigate to <strong>#tier-testing-apply</strong> in Discord and choose Bedfight, Skywars, Mace, or Fireball Fight.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#171722] border border-[#252538] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-[#7C3AED]/40 flex items-center justify-center font-mono font-bold text-[#8B5CF6]">
            02
          </div>
          <h3 className="font-bold text-white text-base">POV & Client Check</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Launch approved Minecraft Bedrock client with screen recording active and input display.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#171722] border border-[#252538] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-[#7C3AED]/40 flex items-center justify-center font-mono font-bold text-[#8B5CF6]">
            03
          </div>
          <h3 className="font-bold text-white text-base">First-to-10 Set</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Duel a verified Tester on the official Valtrox server under strict recording rules.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#171722] border border-[#252538] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-[#7C3AED]/40 flex items-center justify-center font-mono font-bold text-emerald-400">
            04
          </div>
          <h3 className="font-bold text-white text-base">Council Evaluation</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Tester grades score, mechanics, and game sense, publishing your official Tier Badge instantly.
          </p>
        </div>
      </div>

      {/* Interactive Simulator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#171722] via-[#141420] to-[#0F0F17] border border-[#7C3AED]/40 shadow-[0_10px_35px_rgba(124,58,237,0.15)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
              <Calculator size={16} />
              <span>Interactive Simulation Tool</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">Tier Test Score Estimator</h3>
            <p className="text-xs text-zinc-400">
              Input test rounds won vs an official tester to calculate your predicted Valtrox tier rating.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-purple-300 text-xs font-semibold">
            Algorithm v4.2
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-4 md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Gamemode</label>
                <select
                  value={calcGamemode}
                  onChange={(e) => setCalcGamemode(e.target.value as Gamemode)}
                  className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
                >
                  {INITIAL_GAMEMODES.map((gm) => (
                    <option key={gm.id} value={gm.id}>{gm.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Your Score</label>
                  <span className="text-xs font-mono font-bold text-emerald-400">{roundsWon} Wins</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={roundsWon}
                  onChange={(e) => setRoundsWon(parseInt(e.target.value))}
                  className="w-full accent-[#7C3AED] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Tester Rank</label>
                <select
                  value={testerTier}
                  onChange={(e) => setTesterTier(e.target.value as TierRank)}
                  className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="HT1">High Tier 1 Tester (HT1)</option>
                  <option value="LT1">Low Tier 1 Tester (LT1)</option>
                  <option value="HT2">High Tier 2 Tester (HT2)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0F0F17]/70 border border-[#252538] text-xs text-zinc-400 flex items-start gap-2.5">
              <Shield size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
              <span>
                Calculated for a standard <strong>First-to-10 (FT10)</strong> test match in Bedfight, Skywars, Mace, or Fireball Fight.
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F0F17] border border-[#7C3AED]/40 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-mono text-zinc-500 uppercase">Estimated Tier</span>
              <div className="flex items-center gap-3 mt-2">
                <TierBadge tier={prediction.tier} size="xl" pulse />
                <span className="text-xs font-mono text-emerald-400 font-bold">{prediction.confidence} Confidence</span>
              </div>
              <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                {prediction.reason}
              </p>
            </div>

            <a
              href={serverConfig.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold text-center block transition-all shadow-glow-purple-sm"
            >
              Queue Real Test on Discord &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#171722] border border-[#252538] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 size={16} />
            <span>Eligibility Requirements</span>
          </div>
          <ul className="space-y-3 text-xs text-zinc-300 leading-relaxed">
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
              <span><strong>Discord Voice Presence:</strong> Must be in the designated Valtrox testing voice channel during the match.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[#171722] border border-[#252538] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Video size={16} />
            <span>Recording & Anti-Cheat Standards</span>
          </div>
          <ul className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5" />
              <span><strong>Uncut POV Required:</strong> Full 1080p/720p 60fps recording from match start to finish.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5" />
              <span><strong>Input Overlay:</strong> Keyboard/mouse overlay or handcam (mandatory for Touch device competitors).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};