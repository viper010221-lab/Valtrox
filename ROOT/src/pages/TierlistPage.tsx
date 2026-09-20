import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Layers, Search, Sparkles } from 'lucide-react';
import { GamemodeIcon } from '../components/GamemodeIcon';
import { GamerAvatar } from '../components/GamerAvatar';
import { RankBadge } from '../components/RankBadge';
import { Gamemode, TierRank } from '../types';
import { INITIAL_GAMEMODES, ALL_TIERS_ORDER, TIER_POINTS, getPlayerPoints } from '../data/initialData';

export const TierlistPage: React.FC = () => {
  const { players, selectedGamemode, setSelectedGamemode, navigateTo } = useData();
  const [searchFilter, setSearchFilter] = useState('');

  const currentModeInfo = INITIAL_GAMEMODES.find((g) => g.id === selectedGamemode) || INITIAL_GAMEMODES[0];

  const tierGroups = useMemo(() => {
    const groups: Record<TierRank, typeof players> = {
      HT1: [],
      MT1: [],
      LT1: [],
      HT2: [],
      MT2: [],
      LT2: [],
      HT3: [],
      MT3: [],
      LT3: [],
      HT4: [],
      MT4: [],
      LT4: [],
      HT5: [],
      MT5: [],
      LT5: [],
      Unranked: [],
      Untested: []
    };

    players.forEach((player) => {
      const tier = player.tiers[selectedGamemode] || 'Untested';
      if (
        !searchFilter ||
        player.ign.toLowerCase().includes(searchFilter.toLowerCase()) ||
        player.discordTag.toLowerCase().includes(searchFilter.toLowerCase())
      ) {
        if (groups[tier]) {
          groups[tier].push(player);
        }
      }
    });

    return groups;
  }, [players, selectedGamemode, searchFilter]);

  const getTierDetails = (tier: TierRank) => {
    switch (tier) {
      case 'HT1': return { label: 'HT1 — High S Tier', style: 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]' };
      case 'MT1': return { label: 'MT1 — Mid S Tier', style: 'bg-sky-900/40 text-sky-100 border-sky-300/50' };
      case 'LT1': return { label: 'LT1 — Low S Tier', style: 'bg-sky-950/40 text-sky-200 border-sky-400/40' };
      case 'HT2': return { label: 'HT2 — High A Tier', style: 'bg-indigo-950/40 text-indigo-300 border-indigo-500/40' };
      case 'MT2': return { label: 'MT2 — Mid A Tier', style: 'bg-blue-950/40 text-blue-300 border-blue-500/40' };
      case 'LT2': return { label: 'LT2 — Low A Tier', style: 'bg-sky-950/40 text-sky-300 border-sky-500/40' };
      case 'HT3': return { label: 'HT3 — High B Tier', style: 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40' };
      case 'MT3': return { label: 'MT3 — Mid B Tier', style: 'bg-teal-950/40 text-teal-300 border-teal-500/40' };
      case 'LT3': return { label: 'LT3 — Low B Tier', style: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' };
      case 'HT4': return { label: 'HT4 — High C Tier', style: 'bg-green-950/40 text-green-300 border-green-500/40' };
      case 'MT4': return { label: 'MT4 — Mid C Tier', style: 'bg-slate-800/40 text-slate-300 border-slate-600/40' };
      case 'LT4': return { label: 'LT4 — Low C Tier', style: 'bg-slate-900/40 text-slate-400 border-slate-700/40' };
      case 'HT5': return { label: 'HT5 — High D Tier', style: 'bg-zinc-800/40 text-sky-100 border-zinc-600/40' };
      case 'MT5': return { label: 'MT5 — Mid D Tier', style: 'bg-zinc-900/40 text-sky-200 border-zinc-700/40' };
      case 'LT5': return { label: 'LT5 — Low D Tier', style: 'bg-neutral-900/40 text-neutral-400 border-neutral-700/40' };
      default: return { label: tier, style: 'bg-neutral-900/40 text-neutral-400 border-neutral-700/40' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#42A5F5]">
            <Layers size={14} />
            <span>Standardized Bedrock Tierlists</span>
          </div>
          <h1 className="text-3xl font-extrabold heading-gold tracking-tight mt-1">
            Competitive Roster Tierlist
          </h1>
          <p className="text-sm text-sky-200 mt-1">
            Visual hierarchy across all 15 competitive tiers (S, A, B, C, D) for Bedfight, Skywars, Mace, and Fireball Fight.
          </p>
        </div>

        <button
          onClick={() => navigateTo('testing')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1976D2] to-[#42A5F5] hover:from-[#42A5F5] hover:to-[#1976D2] text-white text-xs font-bold shadow-glow-blue transition-all cursor-pointer flex items-center gap-2"
        >
          <Sparkles size={14} />
          <span>Apply for Tier Test &rarr;</span>
        </button>
      </div>

      {/* Gamemode Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {INITIAL_GAMEMODES.map((gm) => {
          const isSelected = selectedGamemode === gm.id;
          return (
            <button
              key={gm.id}
              onClick={() => setSelectedGamemode(gm.id)}
              className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-[#0E4A87]/85 to-[#1565C0]/50 border-[#1976D2] shadow-glow-blue'
                  : 'bg-[#0E4A87]/60 hover:bg-[#0E4A87]/70 border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${isSelected ? 'bg-[#1976D2] border-[#42A5F5] text-white' : 'bg-[#0B3C70]/55 border-white/20 text-sky-200'}`}>
                  <GamemodeIcon gamemode={gm.id} size={20} />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-sky-100'}`}>{gm.name}</h3>
                  <span className="text-[11px] text-sky-200 font-mono">15 Calibrated Tiers</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search Filter */}
      <div className="p-4 rounded-2xl bg-[#0E4A87]/70 border border-white/20">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300" />
          <input
            type="text"
            placeholder={`Filter ${selectedGamemode} players in tierlist...`}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0B3C70]/55 border border-white/20 focus:border-[#1976D2] rounded-xl text-xs text-white placeholder-sky-300 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Tierlist Matrix (15 Tiers) */}
      <div className="space-y-3">
        {ALL_TIERS_ORDER.map((tier) => {
          const playersInTier = tierGroups[tier] || [];
          const details = getTierDetails(tier);

          return (
            <div
              key={tier}
              className="rounded-2xl bg-[#0E4A87]/70 border border-white/20 overflow-hidden flex flex-col md:flex-row shadow-lg"
            >
              {/* Tier Left Header */}
              <div className={`p-4 md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-white/20 flex items-center justify-between md:justify-center md:flex-col gap-1 ${details.style}`}>
                <span className="font-mono font-black text-sm">{details.label}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-white font-bold">
                  {TIER_POINTS[tier]} PTS
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-white font-bold">
                  {playersInTier.length} {playersInTier.length === 1 ? 'Player' : 'Players'}
                </span>
              </div>

              {/* Tier Players Grid */}
              <div className="p-4 flex-1 flex flex-wrap items-center gap-3 min-h-[70px]">
                {playersInTier.length > 0 ? (
                  playersInTier.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => navigateTo('player-detail', player.id)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0B3C70]/55 hover:bg-[#1565C0]/60 border border-white/20 hover:border-[#1976D2]/50 cursor-pointer transition-all group"
                    >
                      <GamerAvatar name={player.ign} size="sm" rank={player.rank} />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white group-hover:text-sky-200 text-xs block">
                            {player.ign}
                          </span>
                          {player.rank && <RankBadge rank={player.rank} size="sm" />}
                        </div>
                        <span className="text-[10px] text-sky-300 font-mono">
                          {player.region} &bull; {getPlayerPoints(player)} PTS
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-sky-300 italic">No competitors currently registered in {tier}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
