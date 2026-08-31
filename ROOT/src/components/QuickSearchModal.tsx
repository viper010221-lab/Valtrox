import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Search, X, Users, Layers, Award, FileText, ChevronRight } from 'lucide-react';
import { TierBadge } from './TierBadge';
import { GamemodeIcon } from './GamemodeIcon';
import { GamerAvatar } from './GamerAvatar';
import { RankBadge } from './RankBadge';
import { INITIAL_GAMEMODES } from '../data/initialData';

export const QuickSearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, players, announcements, testResults, navigateTo, setSelectedGamemode } = useData();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  const filteredPlayers = query.trim()
    ? players.filter(
        (p) =>
          p.ign.toLowerCase().includes(query.toLowerCase()) ||
          p.discordTag.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : players.slice(0, 3);

  const filteredGamemodes = query.trim()
    ? INITIAL_GAMEMODES.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()))
    : INITIAL_GAMEMODES;

  const filteredAnnouncements = query.trim()
    ? announcements.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : announcements.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#171722] border border-[#7C3AED]/40 shadow-2xl shadow-purple-950/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#252538]">
          <Search size={18} className="text-[#8B5CF6] mr-3" />
          <input
            type="text"
            placeholder="Search players, gamemodes, tierlists, or announcements..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded-lg hover:bg-[#252538] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {/* Gamemodes */}
          <div>
            <div className="text-[11px] font-mono uppercase text-zinc-500 font-semibold mb-2 flex items-center gap-1.5">
              <Layers size={13} className="text-purple-400" />
              <span>Gamemodes</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {filteredGamemodes.map((gm) => (
                <div
                  key={gm.id}
                  onClick={() => {
                    setSelectedGamemode(gm.id);
                    navigateTo('tierlist');
                    setSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F0F17] hover:bg-[#252538]/60 border border-[#252538] cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <GamemodeIcon gamemode={gm.id} size={16} />
                    <span className="font-semibold text-white group-hover:text-purple-300">
                      {gm.name}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))}
            </div>
          </div>

          {/* Players */}
          <div>
            <div className="text-[11px] font-mono uppercase text-zinc-500 font-semibold mb-2 flex items-center gap-1.5">
              <Users size={13} className="text-emerald-400" />
              <span>Competitors</span>
            </div>
            <div className="space-y-1.5">
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => {
                    navigateTo('player-detail', player.id);
                    setSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F0F17] hover:bg-[#252538]/60 border border-[#252538] cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <GamerAvatar name={player.ign} size="sm" rank={player.rank} />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-white group-hover:text-purple-300">{player.ign}</span>
                        {player.rank && <RankBadge rank={player.rank} size="sm" />}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">{player.discordTag} &bull; {player.region}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TierBadge tier={player.tiers.Bedfight || 'Untested'} size="sm" />
                    <span className="font-mono text-zinc-400 font-semibold">{player.points} PTS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          {filteredAnnouncements.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase text-zinc-500 font-semibold mb-2 flex items-center gap-1.5">
                <FileText size={13} className="text-amber-400" />
                <span>News & Announcements</span>
              </div>
              <div className="space-y-1.5">
                {filteredAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    onClick={() => {
                      navigateTo('announcements');
                      setSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-[#0F0F17] hover:bg-[#252538]/60 border border-[#252538] cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white group-hover:text-purple-300 truncate max-w-sm">
                        {ann.title}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">{ann.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#0F0F17] border-t border-[#252538] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>Navigate with arrow keys</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};