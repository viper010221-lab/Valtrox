import React from 'react';
import { TierRank } from '../types';

interface TierBadgeProps {
  tier: TierRank;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pulse?: boolean;
  className?: string;
}

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  size = 'md',
  pulse = false,
  className = '',
}) => {
  const getTierStyles = (t: TierRank) => {
    switch (t) {
      // S TIERS
      case 'HT1':
        return {
          bg: 'bg-gradient-to-r from-amber-500/25 via-purple-600/35 to-amber-500/25 text-amber-300 border-amber-400/80 shadow-[0_0_18px_rgba(245,158,11,0.45)] ring-1 ring-amber-400/40',
          label: 'HT1 👑',
          name: 'HT1 — High S Tier'
        };
      case 'MT1':
        return {
          bg: 'bg-gradient-to-r from-purple-900/70 to-purple-600/50 text-purple-200 border-purple-400/70 shadow-[0_0_14px_rgba(168,85,247,0.4)]',
          label: 'MT1',
          name: 'MT1 — Mid S Tier'
        };
      case 'LT1':
        return {
          bg: 'bg-purple-950/60 text-purple-300 border-purple-500/60 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
          label: 'LT1',
          name: 'LT1 — Low S Tier'
        };

      // A TIERS
      case 'HT2':
        return {
          bg: 'bg-indigo-950/70 text-indigo-200 border-indigo-400/60 shadow-[0_0_12px_rgba(99,102,241,0.35)]',
          label: 'HT2',
          name: 'HT2 — High A Tier'
        };
      case 'MT2':
        return {
          bg: 'bg-blue-950/70 text-blue-200 border-blue-400/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]',
          label: 'MT2',
          name: 'MT2 — Mid A Tier'
        };
      case 'LT2':
        return {
          bg: 'bg-sky-950/60 text-sky-200 border-sky-400/50',
          label: 'LT2',
          name: 'LT2 — Low A Tier'
        };

      // B TIERS
      case 'HT3':
        return {
          bg: 'bg-cyan-950/70 text-cyan-200 border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]',
          label: 'HT3',
          name: 'HT3 — High B Tier'
        };
      case 'MT3':
        return {
          bg: 'bg-teal-950/70 text-teal-200 border-teal-400/50',
          label: 'MT3',
          name: 'MT3 — Mid B Tier'
        };
      case 'LT3':
        return {
          bg: 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40',
          label: 'LT3',
          name: 'LT3 — Low B Tier'
        };

      // C TIERS
      case 'HT4':
        return {
          bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-400/50 shadow-[0_0_8px_rgba(16,185,129,0.25)]',
          label: 'HT4',
          name: 'HT4 — High C Tier'
        };
      case 'MT4':
        return {
          bg: 'bg-green-950/60 text-green-300 border-green-500/50',
          label: 'MT4',
          name: 'MT4 — Mid C Tier'
        };
      case 'LT4':
        return {
          bg: 'bg-slate-900/70 text-slate-300 border-slate-500/50',
          label: 'LT4',
          name: 'LT4 — Low C Tier'
        };

      // D TIERS
      case 'HT5':
        return {
          bg: 'bg-zinc-800/70 text-zinc-300 border-zinc-500/50',
          label: 'HT5',
          name: 'HT5 — High D Tier'
        };
      case 'MT5':
        return {
          bg: 'bg-zinc-900/70 text-zinc-400 border-zinc-600/50',
          label: 'MT5',
          name: 'MT5 — Mid D Tier'
        };
      case 'LT5':
        return {
          bg: 'bg-neutral-900/80 text-neutral-400 border-neutral-700/50',
          label: 'LT5',
          name: 'LT5 — Low D Tier'
        };

      case 'Unranked':
      case 'Untested':
      default:
        return {
          bg: 'bg-[#171722]/80 text-zinc-500 border-zinc-700/30',
          label: 'Unranked',
          name: 'Unranked'
        };
    }
  };

  const style = getTierStyles(tier);

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-bold',
    lg: 'text-sm px-3.5 py-1.5 font-extrabold',
    xl: 'text-base px-5 py-2 font-black tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-mono rounded-lg border uppercase transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
        style.bg
      } ${sizeClasses[size]} ${pulse ? 'animate-pulse' : ''} ${className}`}
      title={style.name}
    >
      {style.label}
    </span>
  );
};