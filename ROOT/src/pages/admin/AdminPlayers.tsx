import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Trash2 } from 'lucide-react';
import { TierBadge } from '../../components/TierBadge';
import { GamerAvatar } from '../../components/GamerAvatar';
import { RankBadge } from '../../components/RankBadge';
import { getPlayerPoints } from '../../data/initialData';

export const AdminPlayers: React.FC<{ onFeedback: (msg: string) => void }> = ({ onFeedback }) => {
  const { players, addPlayer, deletePlayer } = useData();

  const [newPlayerIgn, setNewPlayerIgn] = useState('');
  const [newPlayerDiscord, setNewPlayerDiscord] = useState('');
  const [newPlayerRegion, setNewPlayerRegion] = useState<'NA' | 'EU' | 'AS' | 'SA' | 'OC'>('NA');
  const [newPlayerDevice, setNewPlayerDevice] = useState<'Touch' | 'KBM' | 'Controller'>('KBM');
  const [newPlayerPoints, setNewPlayerPoints] = useState(1500);

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerIgn.trim() || !newPlayerDiscord.trim()) return;

    addPlayer({
      ign: newPlayerIgn.trim(),
      discordTag: newPlayerDiscord.trim(),
      points: Number(newPlayerPoints) || 1500,
      region: newPlayerRegion,
      device: newPlayerDevice,
      joinDate: new Date().toISOString().split('T')[0],
      bio: 'Competitive Minecraft Bedrock player on Bedrock Union.',
      verified: true,
      status: 'Active',
      tiers: {
        Bedfight: 'Untested',
        Skywars: 'Untested',
        Mace: 'Untested',
        'Fireball Fight': 'Untested',
      },
      tierHistory: [],
      matchesPlayed: 0,
      winRate: 50.0,
      scrimWins: 0,
      tourneyTrophies: 0,
    });

    setNewPlayerIgn('');
    setNewPlayerDiscord('');
    onFeedback(`Player ${newPlayerIgn} successfully added!`);
  };

  return (
    <div className="space-y-6">
      {/* Create Player Form */}
      <div className="p-6 rounded-2xl bg-[#0E4A87]/70 border border-white/20 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Plus size={16} className="text-[#42A5F5]" />
          <span>Register New Competitive Player</span>
        </h3>

        <form onSubmit={handleCreatePlayer} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-sky-200 block mb-1">Minecraft IGN</label>
            <input
              type="text"
              placeholder="e.g. Vx_Apex"
              value={newPlayerIgn}
              onChange={(e) => setNewPlayerIgn(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B3C70]/55 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#1976D2]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-sky-200 block mb-1">Discord Tag</label>
            <input
              type="text"
              placeholder="e.g. apex#1234"
              value={newPlayerDiscord}
              onChange={(e) => setNewPlayerDiscord(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B3C70]/55 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#1976D2]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-sky-200 block mb-1">Region</label>
            <select
              value={newPlayerRegion}
              onChange={(e) => setNewPlayerRegion(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#0B3C70]/55 border border-white/20 rounded-xl text-xs text-sky-100 focus:outline-none focus:border-[#1976D2]"
            >
              <option value="NA">North America (NA)</option>
              <option value="EU">Europe (EU)</option>
              <option value="AS">Asia (AS)</option>
              <option value="SA">South America (SA)</option>
              <option value="OC">Oceania (OC)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-sky-200 block mb-1">Device</label>
            <select
              value={newPlayerDevice}
              onChange={(e) => setNewPlayerDevice(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#0B3C70]/55 border border-white/20 rounded-xl text-xs text-sky-100 focus:outline-none focus:border-[#1976D2]"
            >
              <option value="KBM">Keyboard & Mouse</option>
              <option value="Touch">Touch / Mobile</option>
              <option value="Controller">Controller</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-[#1976D2] hover:bg-[#42A5F5] text-white text-xs font-bold rounded-xl shadow-glow-blue-sm transition-all cursor-pointer"
            >
              + Add Player
            </button>
          </div>
        </form>
      </div>

      {/* Players Table */}
      <div className="rounded-2xl bg-[#0E4A87]/70 border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B3C70]/55 text-sky-200 uppercase font-mono tracking-wider border-b border-white/20">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Player IGN</th>
                <th className="py-3 px-4">Discord</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Points</th>
                <th className="py-3 px-4">Bedfight</th>
                <th className="py-3 px-4">Skywars</th>
                <th className="py-3 px-4">Mace</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/15">
              {players.map((p) => (
                <tr key={p.id} className="hover:bg-[#1565C0]/60/50">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">#{p.globalRank}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <GamerAvatar name={p.ign} size="sm" rank={p.rank} />
                      <div>
                        <span className="font-bold text-white block">{p.ign}</span>
                        {p.rank && <RankBadge rank={p.rank} size="sm" />}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-sky-200">{p.discordTag}</td>
                  <td className="py-3 px-4 text-sky-100">{p.region}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#42A5F5]">{getPlayerPoints(p)} PTS</td>
                  <td className="py-3 px-4"><TierBadge tier={p.tiers.Bedfight || 'Untested'} size="sm" /></td>
                  <td className="py-3 px-4"><TierBadge tier={p.tiers.Skywars || 'Untested'} size="sm" /></td>
                  <td className="py-3 px-4"><TierBadge tier={p.tiers.Mace || 'Untested'} size="sm" /></td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove ${p.ign}?`)) {
                          deletePlayer(p.id);
                          onFeedback(`Removed ${p.ign} from registry.`);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 cursor-pointer"
                      title="Delete player"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};