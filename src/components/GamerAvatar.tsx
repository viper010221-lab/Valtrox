import React from 'react';
import { UserRank } from '../types';

interface GamerAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rank?: UserRank;
  className?: string;
}

const AVATAR_GRADIENTS = [
  'from-purple-600 to-indigo-700',
  'from-violet-600 to-fuchsia-700',
  'from-blue-600 to-cyan-700',
  'from-emerald-600 to-teal-700',
  'from-rose-600 to-pink-700',
  'from-amber-600 to-orange-700',
  'from-indigo-600 to-purple-800'
];

export const GamerAvatar: React.FC<GamerAvatarProps> = ({
  name,
  size = 'md',
  rank,
  className = ''
}) => {
  const getInitials = (str: string) => {
    if (!str) return 'VX';
    const parts = str.trim().split(/[\s_-]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const getGradient = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
    return AVATAR_GRADIENTS[index];
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px] rounded-lg',
    md: 'w-10 h-10 text-xs rounded-xl',
    lg: 'w-14 h-14 text-base rounded-2xl',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 text-2xl font-black rounded-3xl'
  };

  const rankBorder = () => {
    if (rank === 'Owner') return 'border-2 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]';
    if (rank === 'Developer') return 'border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]';
    if (rank === 'Administrator') return 'border-2 border-red-400';
    if (rank === 'Moderator') return 'border-2 border-emerald-400';
    if (rank === 'VIP' || rank === 'MVP++') return 'border-2 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]';
    if (rank === 'Tier Tester') return 'border-2 border-blue-400';
    return 'border border-[#252538]';
  };

  const gradient = getGradient(name);
  const initials = getInitials(name);

  return (
    <div
      className={`relative inline-flex items-center justify-center font-mono font-extrabold text-white select-none bg-gradient-to-br ${gradient} ${sizeClasses[size]} ${rankBorder()} ${className}`}
      title={name}
    >
      <div className="relative z-10 flex items-center justify-center tracking-wider drop-shadow-md">
        {initials}
      </div>
      {/* Subtle pixel grid texture overlay */}
      <div className="absolute inset-0 bg-white/10 mix-blend-overlay rounded-inherit pointer-events-none" />
      <div className="absolute inset-0 border-t border-white/25 rounded-inherit pointer-events-none" />
    </div>
  );
};
