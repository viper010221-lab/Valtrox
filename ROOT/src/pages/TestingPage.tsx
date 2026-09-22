import React from 'react';
import { useData } from '../context/DataContext';
import {
  ClipboardCheck,
  CheckCircle2,
  ExternalLink,
  Video
} from 'lucide-react';

export const TestingPage: React.FC = () => {
  const { serverConfig } = useData();

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 scene-3d-deep">
        <div className="p-6 rounded-2xl card-3d tilt-3d bg-[#0E4A87]/70 border border-white/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-900/30 border border-[#1976D2]/40 flex items-center justify-center font-mono font-bold text-[#42A5F5]">
            01
          </div>
          <h3 className="font-bold text-white text-base">Open Testing Ticket</h3>
          <p className="text-xs text-sky-200 leading-relaxed">
            Navigate to <strong>#tier-testing-apply</strong> in Discord and choose Bedfight, Skywars, Mace, or Fireball Fight.
          </p>
        </div>

        <div className="p-6 rounded-2xl card-3d tilt-3d bg-[#0E4A87]/70 border border-white/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-900/30 border border-[#1976D2]/40 flex items-center justify-center font-mono font-bold text-[#42A5F5]">
            02
          </div>
          <h3 className="font-bold text-white text-base">POV & Client Check</h3>
          <p className="text-xs text-sky-200 leading-relaxed">
            Launch approved Minecraft Bedrock client with screen recording active and input display.
          </p>
        </div>

        <div className="p-6 rounded-2xl card-3d tilt-3d bg-[#0E4A87]/70 border border-white/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-900/30 border border-[#1976D2]/40 flex items-center justify-center font-mono font-bold text-[#42A5F5]">
            03
          </div>
          <h3 className="font-bold text-white text-base">First-to-3 Set</h3>
          <p className="text-xs text-sky-200 leading-relaxed">
            Duel a verified Tester on the official Bedrock Union server under strict recording rules.
          </p>
        </div>

        <div className="p-6 rounded-2xl card-3d tilt-3d bg-[#0E4A87]/70 border border-white/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-900/30 border border-[#1976D2]/40 flex items-center justify-center font-mono font-bold text-emerald-400">
            04
          </div>
          <h3 className="font-bold text-white text-base">Council Evaluation</h3>
          <p className="text-xs text-sky-200 leading-relaxed">
            Tester grades score, mechanics, and game sense, publishing your official Tier Badge instantly.
          </p>
        </div>
      </div>

      {/* Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 scene-3d-deep">
        <div className="p-6 rounded-2xl slab-3d bg-[#0E4A87]/70 border border-white/20 space-y-4">
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

        <div className="p-6 rounded-2xl slab-3d bg-[#0E4A87]/70 border border-white/20 space-y-4">
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
