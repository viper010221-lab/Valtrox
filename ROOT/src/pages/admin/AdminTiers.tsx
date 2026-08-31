import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Gamemode, TierRank } from '../../types';
import { INITIAL_GAMEMODES } from '../../data/initialData';

export const AdminTiers: React.FC<{ onFeedback: (msg: string) => void }> = ({ onFeedback }) => {
  const { players, testers, updatePlayerTier } = useData();

  const [tierPlayerId, setTierPlayerId] = useState<string>(players[0]?.id || '');
  const [tierGamemode, setTierGamemode] = useState<Gamemode>('Bedfight');
  const [tierNewRank, setTierNewRank] = useState<TierRank>('HT2');
  const [tierTesterName, setTierTesterName] = useState<string>(testers[0]?.name || 'Admin');
  const [tierScore, setTierScore] = useState<string>('10 - 4');
  const [tierNotes, setTierNotes] = useState<string>('Staff manual tier adjustment');

  const handleAssignTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tierPlayerId) return;

    updatePlayerTier(tierPlayerId, tierGamemode, tierNewRank, tierTesterName, tierScore, tierNotes);
    const targetPlayer = players.find(p => p.id === tierPlayerId);
    onFeedback(`Updated ${targetPlayer?.ign || 'Player'} to ${tierNewRank} in ${tierGamemode}!`);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#171722] border border-[#252538] space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">Manual Adjustment</span>
        <h2 className="text-2xl font-extrabold text-white">Direct Player Tier Calibration</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Directly assign or promote/demote a player's tier rank in Bedfight, Skywars, or Mace.
        </p>
      </div>

      <form onSubmit={handleAssignTier} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Select Player</label>
          <select
            value={tierPlayerId}
            onChange={(e) => setTierPlayerId(e.target.value)}
            className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>{p.ign}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Gamemode</label>
          <select
            value={tierGamemode}
            onChange={(e) => setTierGamemode(e.target.value as Gamemode)}
            className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
          >
            {INITIAL_GAMEMODES.map((gm) => (
              <option key={gm.id} value={gm.id}>{gm.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Assign Tier</label>
          <select
            value={tierNewRank}
            onChange={(e) => setTierNewRank(e.target.value as TierRank)}
            className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
          >
            <option value="HT1">HT1 — High S Tier</option>
            <option value="MT1">MT1 — Mid S Tier</option>
            <option value="LT1">LT1 — Low S Tier</option>
            <option value="HT2">HT2 — High A Tier</option>
            <option value="MT2">MT2 — Mid A Tier</option>
            <option value="LT2">LT2 — Low A Tier</option>
            <option value="HT3">HT3 — High B Tier</option>
            <option value="MT3">MT3 — Mid B Tier</option>
            <option value="LT3">LT3 — Low B Tier</option>
            <option value="HT4">HT4 — High C Tier</option>
            <option value="MT4">MT4 — Mid C Tier</option>
            <option value="LT4">LT4 — Low C Tier</option>
            <option value="HT5">HT5 — High D Tier</option>
            <option value="MT5">MT5 — Mid D Tier</option>
            <option value="LT5">LT5 — Low D Tier</option>
            <option value="Untested">Untested</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold shadow-glow-purple-sm transition-all cursor-pointer"
          >
            Apply Tier Update
          </button>
          <button
            type="button"
            onClick={() => {
              if (tierPlayerId) {
                updatePlayerTier(tierPlayerId, tierGamemode, 'Untested', 'Admin', 'N/A', 'Removed from tierlist by Administrator');
                const targetPlayer = players.find(p => p.id === tierPlayerId);
                onFeedback(`Removed ${targetPlayer?.ign || 'Player'} from ${tierGamemode} tierlist.`);
              }
            }}
            className="px-3 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-bold transition-all cursor-pointer"
            title="Remove player from this tierlist"
          >
            Remove
          </button>
        </div>
      </form>
    </div>
  );
};