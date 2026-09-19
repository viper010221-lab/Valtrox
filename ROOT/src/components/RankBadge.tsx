import React from 'react';
import { UserRank } from '../types';

// Legacy brand alias: accounts/testers saved under the old "Valtrox Partner" rank
// still render with the correct "Bedrock Union Partner" badge.
export const normalizeRank = (rank: UserRank): UserRank =>
  ((rank as string) === 'Valtrox Partner' ? 'Bedrock Union Partner' : rank);

interface RankBadgeProps {
  rank: UserRank;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const getRankColor = (rank: UserRank): { bg: string; text: string; border: string; glow: string } => {
  switch (normalizeRank(rank)) {
    case 'Owner':
      return {
        bg: 'bg-gradient-to-r from-red-600/30 via-amber-500/20 to-red-600/30',
        text: 'text-red-400 font-black',
        border: 'border-red-500/60',
        glow: 'shadow-[0_0_12px_rgba(239,68,68,0.4)]'
      };
    case 'Developer':
      return {
        bg: 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30',
        text: 'text-cyan-300 font-black',
        border: 'border-cyan-500/60',
        glow: 'shadow-[0_0_12px_rgba(6,182,212,0.4)]'
      };
    case 'Administrator':
      return {
        bg: 'bg-red-950/60',
        text: 'text-red-300 font-extrabold',
        border: 'border-red-500/50',
        glow: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]'
      };
    case 'Moderator':
      return {
        bg: 'bg-emerald-950/60',
        text: 'text-emerald-300 font-extrabold',
        border: 'border-emerald-500/50',
        glow: 'shadow-[0_0_10px_rgba(16,185,129,0.3)]'
      };
    case 'Bedrock Union Partner':
      return {
        bg: 'bg-purple-950/70',
        text: 'text-purple-300 font-extrabold',
        border: 'border-purple-500/60',
        glow: 'shadow-[0_0_12px_rgba(168,85,247,0.4)]'
      };
    case 'Tier Tester':
      return {
        bg: 'bg-blue-950/60',
        text: 'text-blue-300 font-bold',
        border: 'border-blue-500/50',
        glow: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]'
      };
    case 'Content Creator+':
      return {
        bg: 'bg-pink-950/60',
        text: 'text-pink-300 font-extrabold',
        border: 'border-pink-500/60',
        glow: 'shadow-[0_0_12px_rgba(236,72,153,0.4)]'
      };
    case 'Content Creator':
      return {
        bg: 'bg-rose-950/50',
        text: 'text-rose-300 font-bold',
        border: 'border-rose-500/50',
        glow: 'shadow-[0_0_8px_rgba(244,63,94,0.3)]'
      };
    case 'VIP':
      return {
        bg: 'bg-amber-950/60',
        text: 'text-amber-300 font-extrabold',
        border: 'border-amber-500/50',
        glow: 'shadow-[0_0_10px_rgba(245,158,11,0.35)]'
      };
    case 'MVP++':
      return {
        bg: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20',
        text: 'text-amber-300 font-black',
        border: 'border-amber-400/60',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]'
      };
    case 'MVP+':
      return {
        bg: 'bg-sky-950/60',
        text: 'text-sky-300 font-extrabold',
        border: 'border-sky-500/50',
        glow: 'shadow-[0_0_8px_rgba(14,165,233,0.3)]'
      };
    case 'MVP':
      return {
        bg: 'bg-cyan-950/50',
        text: 'text-cyan-300 font-bold',
        border: 'border-cyan-500/40',
        glow: 'shadow-[0_0_6px_rgba(6,182,212,0.25)]'
      };
    case 'Player':
    default:
      return {
        bg: 'bg-[#171722]/90',
        text: 'text-zinc-400 font-medium',
        border: 'border-[#252538]',
        glow: ''
      };
  }
};

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'md', className = '' }) => {
  const displayRank = normalizeRank(rank);
  const styles = getRankColor(displayRank);

  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5 rounded font-mono',
    md: 'text-[11px] px-2.5 py-0.5 rounded-md font-mono tracking-wide',
    lg: 'text-xs px-3 py-1 rounded-lg font-mono font-bold tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 uppercase border font-semibold select-none ${styles.bg} ${styles.text} ${styles.border} ${styles.glow} ${sizeClasses[size]} ${className}`}
    >
      {rank === 'Owner' && <span>👑</span>}
      {rank === 'Developer' && <span>⚡</span>}
      {rank === 'Administrator' && <span>🛡️</span>}
      {rank === 'VIP' && <span>⭐</span>}
      {displayRank}
    </span>
  );
};
