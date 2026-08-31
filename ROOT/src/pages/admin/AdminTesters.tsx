import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Shield, Trash2 } from 'lucide-react';
import { GamerAvatar } from '../../components/GamerAvatar';
import { RankBadge } from '../../components/RankBadge';

export const AdminTesters: React.FC<{ onFeedback: (msg: string) => void }> = ({ onFeedback }) => {
  const { testers, addTester, deleteTester } = useData();

  const [newTesterName, setNewTesterName] = useState('');
  const [newTesterDiscord, setNewTesterDiscord] = useState('');
  const [newTesterRole, setNewTesterRole] = useState<'Head Tester' | 'Senior Tester' | 'Gamemode Tester' | 'Trial Tester'>('Gamemode Tester');

  const handleCreateTester = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTesterName.trim() || !newTesterDiscord.trim()) return;

    addTester({
      name: newTesterName.trim(),
      discordTag: newTesterDiscord.trim(),
      role: newTesterRole,
      gamemodes: ['Bedfight', 'Skywars', 'Mace'],
      testsConducted: 0,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      verifiedPassRate: 35.0
    });

    setNewTesterName('');
    setNewTesterDiscord('');
    onFeedback(`Added ${newTesterName} to the Tester Team!`);
  };

  return (
    <div className="space-y-6">
      {/* Create Tester */}
      <div className="p-6 rounded-2xl bg-[#171722] border border-[#252538] space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Shield size={16} className="text-emerald-400" />
          <span>Recruit New Gamemode Tester</span>
        </h3>

        <form onSubmit={handleCreateTester} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Tester Name</label>
            <input
              type="text"
              placeholder="e.g. ApexTester"
              value={newTesterName}
              onChange={(e) => setNewTesterName(e.target.value)}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Discord Tag</label>
            <input
              type="text"
              placeholder="e.g. tester#0001"
              value={newTesterDiscord}
              onChange={(e) => setNewTesterDiscord(e.target.value)}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Tester Role</label>
            <select
              value={newTesterRole}
              onChange={(e) => setNewTesterRole(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-[#7C3AED]"
            >
              <option value="Head Tester">Head Tester</option>
              <option value="Senior Tester">Senior Tester</option>
              <option value="Gamemode Tester">Gamemode Tester</option>
              <option value="Trial Tester">Trial Tester</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold transition-all cursor-pointer"
            >
              + Add Tester to Council
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#171722] border border-[#252538] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0F0F17] text-zinc-400 uppercase font-mono tracking-wider border-b border-[#252538]">
              <tr>
                <th className="py-3 px-4">Tester</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Discord</th>
                <th className="py-3 px-4">Specialties</th>
                <th className="py-3 px-4">Tests Conducted</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252538]/60">
              {testers.map((t) => (
                <tr key={t.id} className="hover:bg-[#1F1F2E]/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <GamerAvatar name={t.name} size="sm" rank="Tier Tester" />
                      <span className="font-bold text-white">{t.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <RankBadge rank="Tier Tester" size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-400">{t.discordTag}</td>
                  <td className="py-3 px-4 text-zinc-300">{t.gamemodes.join(', ')}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{t.testsConducted}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        if (confirm(`Remove tester ${t.name}?`)) {
                          deleteTester(t.id);
                          onFeedback(`Removed ${t.name}.`);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 cursor-pointer"
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