import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Search, Users, CheckCircle2, Smartphone, Monitor, Gamepad2, ChevronRight } from 'lucide-react';
import { TierBadge } from '../components/TierBadge';
import { GamemodeIcon } from '../components/GamemodeIcon';
import { GamerAvatar } from '../components/GamerAvatar';
import { RankBadge } from '../components/RankBadge';
import { Gamemode, TierRank } from '../types';
import { INITIAL_GAMEMODES, getPlayerPoints } from '../data/initialData';

export const PlayersPage: React.FC = () => {
  const { players, navigateTo } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedDevice, setSelectedDevice] = useState<string>('All');
  const [selectedGamemode, setSelectedGamemode] = useState<Gamemode | 'All'>('All');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rank' | 'points' | 'winrate'>('rank');

  const filteredPlayers = useMemo(() => {
    return players
      .filter((p) => {
        const matchesSearch =
          p.ign.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.discordTag.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRegion = selectedRegion === 'All' || p.region === selectedRegion;
        const matchesDevice = selectedDevice === 'All' || p.device === selectedDevice;

        let matchesGamemodeTier = true;
        if (selectedGamemode !== 'All') {
          const tier = p.tiers[selectedGamemode];
          if (selectedTierFilter !== 'All') {
            matchesGamemodeTier = tier === selectedTierFilter;
          } else {
            matchesGamemodeTier = tier !== undefined && tier !== 'Untested';
          }
        } else if (selectedTierFilter !== 'All') {
          matchesGamemodeTier = Object.values(p.tiers).includes(selectedTierFilter as TierRank);
        }

        return matchesSearch && matchesRegion && matchesDevice && matchesGamemodeTier;
      })
      .sort((a, b) => {
        if (sortBy === 'points') return getPlayerPoints(b) - getPlayerPoints(a);
        if (sortBy === 'winrate') return b.winRate - a.winRate;
        return a.globalRank - b.globalRank;
      });
  }, [players, searchTerm, selectedRegion, selectedDevice, selectedGamemode, selectedTierFilter, sortBy]);

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Touch':
        return <span title="Touch Device"><Smartphone size={14} className="text-pink-400" /></span>;
      case 'KBM':
        return <span title="Keyboard & Mouse"><Monitor size={14} className="text-cyan-400" /></span>;
      case 'Controller':
        return <span title="Controller"><Gamepad2 size={14} className="text-amber-400" /></span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#42A5F5]">
            <Users size={14} />
            <span>Competitive Player Registry</span>
          </div>
          <h1 className="text-3xl font-extrabold heading-gold tracking-tight mt-1">
            Players & Verified Profiles
          </h1>
          <p className="text-sm text-sky-200 mt-1">
            Explore verified Minecraft Bedrock competitors, gamemode tier assignments, and test records.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-sky-200">
          <span className="px-3 py-1.5 rounded-lg bg-[#0E4A87]/70 border border-white/20">
            Total Players: <strong className="text-white">{players.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#0E4A87]/70 border border-white/20">
            Showing: <strong className="text-sky-300">{filteredPlayers.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0E4A87]/70 border border-white/20 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300" />
            <input
              type="text"
              placeholder="Search by IGN or Discord tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0B3C70]/55 border border-white/20 rounded-xl text-sm text-white placeholder-sky-300 focus:outline-none focus:border-[#1976D2]"
            />
          </div>

          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B3C70]/55 border border-white/20 rounded-xl text-sm text-sky-100 focus:outline-none focus:border-[#1976D2]"
            >
              <option value="All">All Regions</option>
              <option value="NA">North America (NA)</option>
              <option value="EU">Europe (EU)</option>
              <option value="AS">Asia (AS)</option>
              <option value="SA">South America (SA)</option>
              <option value="OC">Oceania (OC)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B3C70]/55 border border-white/20 rounded-xl text-sm text-sky-100 focus:outline-none focus:border-[#1976D2]"
            >
              <option value="All">All Devices</option>
              <option value="KBM">Keyboard & Mouse</option>
              <option value="Touch">Touch / Mobile</option>
              <option value="Controller">Controller</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#0B3C70]/55 border border-white/20 rounded-xl text-sm text-sky-100 focus:outline-none focus:border-[#1976D2]"
            >
              <option value="rank">Sort by Rank (#1 - #100)</option>
              <option value="points">Sort by Points (Highest)</option>
              <option value="winrate">Sort by Win Rate (%)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/15 text-xs">
          <span className="text-sky-300 font-semibold mr-1">Filter Gamemode:</span>
          <button
            onClick={() => setSelectedGamemode('All')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              selectedGamemode === 'All'
                ? 'bg-[#1976D2] text-white font-bold'
                : 'bg-[#0B3C70]/55 text-sky-200 hover:text-white border border-white/20'
            }`}
          >
            All Modes
          </button>
          {INITIAL_GAMEMODES.map((gm) => (
            <button
              key={gm.id}
              onClick={() => setSelectedGamemode(gm.id)}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                selectedGamemode === gm.id
                  ? 'bg-[#1976D2] text-white font-bold shadow-glow-blue-sm'
                  : 'bg-[#0B3C70]/55 text-sky-200 hover:text-white border border-white/20'
              }`}
            >
              <GamemodeIcon gamemode={gm.id} size={14} />
              <span>{gm.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Players Grid View */}
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              onClick={() => navigateTo('player-detail', player.id)}
              className="p-6 rounded-2xl bg-[#0E4A87]/70 border border-white/20 hover:border-[#1976D2]/50 transition-all cursor-pointer group flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <GamerAvatar name={player.ign} size="md" rank={player.rank} />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-extrabold text-white group-hover:text-sky-200 text-base transition-colors">
                          {player.ign}
                        </h3>
                        {player.rank && <RankBadge rank={player.rank} size="sm" />}
                        {player.verified && (
                          <span title="Verified Competitor">
                            <CheckCircle2 size={15} className="text-emerald-400" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-sky-200 font-mono">{player.discordTag}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-black text-amber-400">#{player.globalRank}</div>
                    <div className="text-[11px] text-[#42A5F5] font-bold">{getPlayerPoints(player)} PTS</div>
                  </div>
                </div>

                <p className="text-xs text-sky-200 line-clamp-2 leading-relaxed">
                  {player.bio || 'Competitive Minecraft Bedrock player active in Bedrock Union leagues.'}
                </p>

                <div className="flex items-center gap-2 text-xs font-mono text-sky-200">
                  <span className="px-2 py-0.5 rounded bg-[#0B3C70]/55 border border-white/20">
                    {player.region}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#0B3C70]/55 border border-white/20">
                    {getDeviceIcon(player.device)}
                    <span>{player.device}</span>
                  </span>
                  <span className="text-[11px] text-sky-300">
                    WR: <strong className="text-sky-100">{player.winRate}%</strong>
                  </span>
                </div>

                <div className="pt-2 border-t border-white/15">
                  <div className="text-[11px] font-semibold text-sky-300 uppercase tracking-wider mb-2">
                    Current Tiers:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {INITIAL_GAMEMODES.slice(0, 4).map((gm) => (
                      <div key={gm.id} className="flex items-center gap-1 bg-[#0B3C70]/55 px-2 py-1 rounded-md border border-white/20 text-[11px]">
                        <GamemodeIcon gamemode={gm.id} size={12} />
                        <span className="text-sky-200">{gm.name}:</span>
                        <TierBadge tier={player.tiers[gm.id] || 'Untested'} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs text-sky-300 font-semibold group-hover:translate-x-1 transition-transform">
                <span>View Full Profile & Test History</span>
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0E4A87]/70 rounded-2xl border border-white/20 space-y-3">
          <Users size={36} className="text-sky-300 mx-auto" />
          <h3 className="text-lg font-bold text-white">No players found</h3>
          <p className="text-sm text-sky-200 max-w-sm mx-auto">
            Try adjusting your search query, region, or gamemode filters.
          </p>
        </div>
      )}
    </div>
  );
};