import React from 'react';
import { Gamemode } from '../types';
import { Bed, Cloud, Hammer, Swords } from 'lucide-react';

interface GamemodeIconProps {
  gamemode: Gamemode;
  size?: number;
  className?: string;
}

export const GamemodeIcon: React.FC<GamemodeIconProps> = ({ gamemode, size = 18, className = '' }) => {
  switch (gamemode) {
    case 'Bedfight':
      return <Bed size={size} className={`text-red-400 ${className}`} />;
    case 'Skywars':
      return <Cloud size={size} className={`text-sky-400 ${className}`} />;
    case 'Mace':
      return <Hammer size={size} className={`text-emerald-400 ${className}`} />;
    default:
      return <Swords size={size} className={`text-purple-400 ${className}`} />;
  }
};