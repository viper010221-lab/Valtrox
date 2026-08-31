import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Layers, Search, Sparkles } from 'lucide-react';
import { GamemodeIcon } from '../components/GamemodeIcon';
import { GamerAvatar } from '../components/GamerAvatar';
import { RankBadge } from '../components/RankBadge';
import { Gamemode, TierRank } from '../types';
import { INITIAL_GAMEMODES, ALL_TIERS_ORDER } from '../data/initialData';

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
      case 'MT1': return { label: 'MT1 — Mid S Tier', style: 'bg-purple-900/40 text-purple-200 border-purple-400/50' };
      case 'LT1': return { label: 'LT1 — Low S Tier', style: 'bg-purple-950/40 text-purple-300 border-purple-500/40' };
      case 'HT2': return { label: 'HT2 — High A Tier', style: 'bg-indigo-950/40 text-indigo-300 border-indigo-500/40' };
      case 'MT2': return { label: 'MT2 — Mid A Tier', style: 'bg-blue-950/40 text-blue-300 border-blue-500/40' };
      case 'LT2': return { label: 'LT2 — Low A Tier', style: 'bg-sky-950/40 text-sky-300 border-sky-500/40' };
      case 'HT3': return { label: 'HT3 — High B Tier', style: 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40' };
      case 'MT3': return { label: 'MT3 — Mid B Tier', style: 'bg-teal-950/40 text-teal-300 border-teal-500/40' };
      case 'LT3': return { label: 'LT3 — Low B Tier', style: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' };
      case 'HT4': return { label: 'HT4 — High C Tier', style: 'bg-green-950/40 text-green-300 border-green-500/40' };
      case 'MT4': return { label: 'MT4 — Mid C Tier', style: 'bg-slate-800/40 text-slate-300 border-slate-600/40' };
      case 'LT4': return { label: 'LT4 — Low C Tier', style: 'bg-slate-900/40 text-slate-400 border-slate-700/40' };
      case 'HT5': return { label: 'HT5 — High D Tier', style: 'bg-zinc-800/40 text-zinc-300 border-zinc-600/40' };
      case 'MT5': return { label: 'MT5 — Mid D Tier', style: 'bg-zinc-900/40 text-zinc-400 border-zinc-700/40' };
      case 'LT5': return { label: 'LT5 — Low D Tier', style: 'bg-neutral-900/40 text-neutral-400 border-neutral-700/40' };
      default: return { label: tier, style: 'bg-neutral-900/40 text-neutral-400 border-neutral-700/40' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252538] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
            <Layers size={14} />
            <span>Standardized Bedrock Tierlists</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Competitive Roster Tierlist
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Visual hierarchy across all 15 competitive tiers (S, A, B, C, D) for Bedfight, Skywars, and Mace.
          </p>
        </div>

        <button
          onClick={() => navigateTo('testing')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white text-xs font-bold shadow-glow-purple transition-all cursor-pointer flex items-center gap-2"
        >
          <Sparkles size={14} />
          <span>Apply for Tier Test &rarr;</span>
        </button>
      </div>

      {/* Gamemode Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {INITIAL_GAMEMODES.map((gm) => {
          const isSelected = selectedGamemode === gm.id;
          return (
            <button
              key={gm.id}
              onClick={() => setSelectedGamemode(gm.id)}
              className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-[#171722] to-[#1F1F2E] border-[#7C3AED] shadow-glow-purple'
                  : 'bg-[#171722]/60 hover:bg-[#171722] border-[#252538]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${isSelected ? 'bg-[#7C3AED] border-[#8B5CF6] text-white' : 'bg-[#0F0F17] border-[#252538] text-zinc-400'}`}>
                  <GamemodeIcon gamemode={gm.id} size={20} />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{gm.name}</h3>
                  <span className="text-[11px] text-zinc-400 font-mono">15 Calibrated Tiers</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search Filter */}
      <div className="p-4 rounded-2xl bg-[#171722] border border-[#252538]">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder={`Filter ${selectedGamemode} players in tierlist...`}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0F0F17] border border-[#252538] focus:border-[#7C3AED] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
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
              className="rounded-2xl bg-[#171722] border border-[#252538] overflow-hidden flex flex-col md:flex-row shadow-lg"
            >
              {/* Tier Left Header */}
              <div className={`p-4 md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-[#252538] flex items-center justify-between md:justify-center md:flex-col gap-1 ${details.style}`}>
                <span className="font-mono font-black text-sm">{details.label}</span>
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
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0F0F17] hover:bg-[#1F1F2E] border border-[#252538] hover:border-[#7C3AED]/50 cursor-pointer transition-all group"
                    >
                      <GamerAvatar name={player.ign} size="sm" rank={player.rank} />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white group-hover:text-purple-300 text-xs block">
                            {player.ign}
                          </span>
                          {player.rank && <RankBadge rank={player.rank} size="sm" />}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {player.region} &bull; {player.points} PTS
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-zinc-600 italic">No competitors currently registered in {tier}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
