import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Shield, Award, UserPlus } from 'lucide-react';
import { GamemodeIcon } from '../components/GamemodeIcon';
import { GamerAvatar } from '../components/GamerAvatar';
import { RankBadge } from '../components/RankBadge';

export const StaffPage: React.FC = () => {
  const { staff, testers, serverConfig } = useData();
  const [activeTab, setActiveTab] = useState<'all' | 'staff' | 'testers'>('all');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252538] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
            <Shield size={14} />
            <span>Valtrox Platform Administration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Leadership, Staff & Evaluators
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Official administration team, tier test evaluators, and competitive community directors.
          </p>
        </div>

        <a
          href={serverConfig.discordUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold shadow-lg transition-all"
        >
          <UserPlus size={14} />
          <span>Apply for Tester Team &rarr;</span>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm'
              : 'bg-[#171722] text-zinc-400 hover:text-white border border-[#252538]'
          }`}
        >
          All Members ({staff.length + testers.length})
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm'
              : 'bg-[#171722] text-zinc-400 hover:text-white border border-[#252538]'
          }`}
        >
          Administration Staff ({staff.length})
        </button>
        <button
          onClick={() => setActiveTab('testers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'testers'
              ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm'
              : 'bg-[#171722] text-zinc-400 hover:text-white border border-[#252538]'
          }`}
        >
          Official Testers ({testers.length})
        </button>
      </div>

      {/* Staff Section */}
      {(activeTab === 'all' || activeTab === 'staff') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-purple-400">
            <Shield size={16} />
            <span>Executive Staff & Leadership</span>
          </div>

          {staff.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="p-6 rounded-2xl bg-[#171722] border border-[#252538] hover:border-[#7C3AED]/40 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <GamerAvatar name={member.name} size="lg" rank={member.role} />
                      <div>
                        <h3 className="font-extrabold text-white text-base">{member.name}</h3>
                        <RankBadge rank={member.role} size="sm" className="mt-1" />
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#252538] flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span className="text-purple-300">{member.discordTag}</span>
                    <span className="text-[11px]">Since {member.joinedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#171722] border border-[#252538] text-center space-y-2">
              <p className="text-sm font-bold text-white">Staff Roster is Currently Being Calibrated</p>
              <p className="text-xs text-zinc-400">Join our Discord community to view staff openings and team roles.</p>
            </div>
          )}
        </div>
      )}

      {/* Verified Testers Section */}
      {(activeTab === 'all' || activeTab === 'testers') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-400">
            <Award size={16} />
            <span>Official Gamemode Evaluators</span>
          </div>

          {testers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testers.map((tester) => (
                <div
                  key={tester.id}
                  className="p-6 rounded-2xl bg-[#171722] border border-[#252538] hover:border-[#7C3AED]/40 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3.5">
                        <GamerAvatar name={tester.name} size="md" rank="Tier Tester" />
                        <div>
                          <h3 className="font-extrabold text-white text-base">{tester.name}</h3>
                          <RankBadge rank="Tier Tester" size="sm" className="mt-1" />
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-[#0F0F17] text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{tester.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Gamemodes Tested */}
                    <div>
                      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                        Testing Specialties:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tester.gamemodes.map((gm) => (
                          <div
                            key={gm}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0F0F17] border border-[#252538] text-[11px] font-mono text-zinc-300"
                          >
                            <GamemodeIcon gamemode={gm} size={12} />
                            <span>{gm}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#252538] flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span className="text-purple-300">{tester.discordTag}</span>
                    <span>{tester.testsConducted} Tests Conducted</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#171722] border border-[#252538] text-center space-y-2">
              <p className="text-sm font-bold text-white">Tester Applications are Open</p>
              <p className="text-xs text-zinc-400">Apply on our Discord server in #tester-apply to evaluate Bedfight, Skywars, Mace, and Fireball Fight!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
