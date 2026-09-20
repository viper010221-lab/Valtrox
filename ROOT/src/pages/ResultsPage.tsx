import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Award, Search, Filter, CheckCircle2, Calendar, User, ChevronRight } from 'lucide-react';
import { TierBadge } from '../components/TierBadge';
import { GamemodeIcon } from '../components/GamemodeIcon';
import { GamerAvatar } from '../components/GamerAvatar';
import { Gamemode, TierRank } from '../types';
import { INITIAL_GAMEMODES } from '../data/initialData';

export const ResultsPage: React.FC = () => {
  const { testResults, navigateTo } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGamemode, setSelectedGamemode] = useState<Gamemode | 'All'>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedTester, setSelectedTester] = useState<string>('All');

  const testersList = useMemo(() => {
    const list = new Set<string>();
    testResults.forEach(r => list.add(r.testerName));
    return Array.from(list);
  }, [testResults]);

  const filteredResults = useMemo(() => {
    return testResults.filter((r) => {
      const matchesSearch =
        r.playerIgn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.playerDiscord.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.notes.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGamemode = selectedGamemode === 'All' || r.gamemode === selectedGamemode;
      const matchesTier = selectedTier === 'All' || r.newTier === selectedTier;
      const matchesTester = selectedTester === 'All' || r.testerName === selectedTester;

      return matchesSearch && matchesGamemode && matchesTier && matchesTester;
    });
  }, [testResults, searchTerm, selectedGamemode, selectedTier, selectedTester]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Award size={14} />
            <span>Public Testing Registry</span>
          </div>
          <h1 className="text-3xl font-extrabold heading-gold tracking-tight mt-1">
            Tier Test Results & Audit Log
          </h1>
          <p className="text-sm text-sky-200 mt-1">
            Real-time verified log of official 1v1 tier test evaluations, scorecards, and evaluator remarks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-sky-200">
          <span className="px-3 py-1.5 rounded-lg bg-[#0E4A87]/70 border border-white/20">
            Total Audited: <strong className="text-sky-300">{testResults.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0E4A87]/70 border border-white/20 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300" />
          <input
            type="text"
            placeholder="Search player, discord, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0B3C70]/55 border border-white/20 focus:border-[#1976D2] rounded-xl text-xs text-white placeholder-sky-300 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedGamemode}
            onChange={(e) => setSelectedGamemode(e.target.value as any)}
            className="px-3 py-2 bg-[#0B3C70]/55 border border-white/20 rounded-xl text-xs text-sky-100 focus:outline-none focus:border-[#1976D2] transition-colors cursor-pointer"
          >
            <option value="All">All Gamemodes</option>
            {INITIAL_GAMEMODES.map((gm) => (
              <option key={gm.id} value={gm.id}>{gm.name}</option>
            ))}
          </select>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 bg-[#0B3C70]/55 border border-white/20 rounded-xl text-xs text-sky-100 focus:outline-none focus:border-[#1976D2] transition-colors cursor-pointer"
          >
            <option value="All">All Awarded Tiers</option>
            <option value="HT1">HT1</option>
            <option value="MT1">MT1</option>
            <option value="LT1">LT1</option>
            <option value="HT2">HT2</option>
            <option value="MT2">MT2</option>
            <option value="LT2">LT2</option>
            <option value="HT3">HT3</option>
            <option value="MT3">MT3</option>
            <option value="LT3">LT3</option>
            <option value="HT4">HT4</option>
            <option value="MT4">MT4</option>
            <option value="LT4">LT4</option>
            <option value="HT5">HT5</option>
            <option value="MT5">MT5</option>
            <option value="LT5">LT5</option>
          </select>

          {testersList.length > 0 && (
            <select
              value={selectedTester}
              onChange={(e) => setSelectedTester(e.target.value)}
              className="px-3 py-2 bg-[#0B3C70]/55 border border-white/20 rounded-xl text-xs text-sky-100 focus:outline-none focus:border-[#1976D2] transition-colors cursor-pointer"
            >
              <option value="All">All Testers</option>
              {testersList.map((tester) => (
                <option key={tester} value={tester}>{tester}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Results Feed */}
      {filteredResults.length > 0 ? (
        <div className="space-y-3">
          {filteredResults.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-[#0E4A87]/70 border border-white/20 hover:border-[#1976D2]/40 transition-all space-y-4 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <GamerAvatar name={res.playerIgn} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => navigateTo('player-detail', res.playerId)}
                        className="font-extrabold text-white group-hover:text-sky-200 transition-colors text-base cursor-pointer hover:underline"
                      >
                        {res.playerIgn}
                      </span>
                      {res.verified && (
                        <span title="Audited Result">
                          <CheckCircle2 size={14} className="text-emerald-400" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-sky-200 font-mono">
                      {res.gamemode} Competitive Test &bull; {res.playerDiscord}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <div className="text-xs text-sky-300">
                    Previous: <strong className="text-sky-100">{res.previousTier}</strong>
                  </div>
                  <span className="text-sky-300 font-black text-sm">&rarr;</span>
                  <TierBadge tier={res.newTier} size="lg" pulse />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0B3C70]/55 border border-white/20/80 text-xs">
                <div>
                  <span className="text-sky-300 font-mono uppercase text-[10px] block">Match Score</span>
                  <span className="font-bold text-white font-mono text-sm">{res.score}</span>
                </div>
                <div>
                  <span className="text-sky-300 font-mono uppercase text-[10px] block">Evaluating Tester</span>
                  <span className="font-semibold text-sky-200">{res.testerName}</span>
                </div>
                <div>
                  <span className="text-sky-300 font-mono uppercase text-[10px] block">Date Tested</span>
                  <span className="font-mono text-sky-100">{res.date}</span>
                </div>
              </div>

              {res.notes && (
                <div className="text-xs text-sky-100 leading-relaxed bg-[#0B3C70]/60 p-3 rounded-lg border border-white/15">
                  <span className="font-semibold text-sky-200 mr-1.5">Tester Notes:</span>
                  <span>"{res.notes}"</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0E4A87]/70 rounded-2xl border border-white/20 space-y-2">
          <Award size={36} className="text-sky-300 mx-auto" />
          <h3 className="text-lg font-bold text-white">No results matched your filters</h3>
          <p className="text-xs text-sky-200">Try choosing a different gamemode or clearing the search query.</p>
        </div>
      )}
    </div>
  );
};