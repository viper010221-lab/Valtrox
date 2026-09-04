import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Award, CheckCircle2, Trash2 } from 'lucide-react';
import { Gamemode, TierRank } from '../../types';
import { INITIAL_GAMEMODES } from '../../data/initialData';

export const AdminPublishResult: React.FC<{ onFeedback: (msg: string) => void }> = ({ onFeedback }) => {
  const { players, testers, addTestResult, testResults, deleteTestResult, serverConfig } = useData();

  const [pubPlayerId, setPubPlayerId] = useState<string>(players[0]?.id || '');
  const [pubGamemode, setPubGamemode] = useState<Gamemode>('Bedfight');
  const [pubOldTier, setPubOldTier] = useState<TierRank>('LT2');
  const [pubNewTier, setPubNewTier] = useState<TierRank>('HT1');
  const [pubScore, setPubScore] = useState<string>('10 - 3');
  const [pubTesterName, setPubTesterName] = useState<string>(testers[0]?.name || 'Zephyr_MC');
  const [pubNotes, setPubNotes] = useState<string>('Exceptional hit spacing and sprint-resets. Approved for promotion.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetPlayer = players.find(p => p.id === pubPlayerId);
    if (!targetPlayer) return;

    addTestResult({
      playerId: targetPlayer.id,
      playerIgn: targetPlayer.ign,
      playerDiscord: targetPlayer.discordTag,
      gamemode: pubGamemode,
      previousTier: pubOldTier,
      newTier: pubNewTier,
      score: pubScore,
      testerId: 't-admin',
      testerName: pubTesterName,
      notes: pubNotes,
      date: new Date().toISOString().split('T')[0],
      verified: true
    });

    onFeedback(`Published official tier test result for ${targetPlayer.ign}! Result is now live on the website.`);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#171722] border border-[#7C3AED]/40 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">Audited Entry</span>
        <h2 className="text-2xl font-extrabold text-white">Publish Official Tier Test Result</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Submitting this form immediately publishes the result to the Public Results feed and auto-updates the player's profile and tierlist rank!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Select Player</label>
            <select
              value={pubPlayerId}
              onChange={(e) => setPubPlayerId(e.target.value)}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
              required
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>{p.ign} ({p.discordTag})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Gamemode</label>
            <select
              value={pubGamemode}
              onChange={(e) => setPubGamemode(e.target.value as Gamemode)}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
            >
              {INITIAL_GAMEMODES.map((gm) => (
                <option key={gm.id} value={gm.id}>{gm.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Match Score (e.g. 10 - 4)</label>
            <input
              type="text"
              value={pubScore}
              onChange={(e) => setPubScore(e.target.value)}
              placeholder="10 - 4"
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Previous Tier</label>
            <select
              value={pubOldTier}
              onChange={(e) => setPubOldTier(e.target.value as TierRank)}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
            >
              <option value="Untested">Untested / Unranked</option>
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
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">New Awarded Tier</label>
            <select
              value={pubNewTier}
              onChange={(e) => setPubNewTier(e.target.value as TierRank)}
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
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Evaluating Tester</label>
            <select
              value={pubTesterName}
              onChange={(e) => setPubTesterName(e.target.value)}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
            >
              {testers.map((t) => (
                <option key={t.id} value={t.name}>{t.name} ({t.role})</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Evaluator Notes & Feedback</label>
          <textarea
            value={pubNotes}
            onChange={(e) => setPubNotes(e.target.value)}
            rows={3}
            placeholder="Detail match performance, sprint-reset consistency, hit tracking..."
            className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold shadow-glow-purple transition-all font-semibold flex items-center gap-2"
        >
          <Award size={16} />
          <span>Publish Official Result</span>
        </button>
      </form>

      {/* Recent Test Results Management */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Results Moderation</span>
            <h3 className="text-lg font-extrabold text-white">Delete Recent Tier Test Results</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Nuke any of the latest audited test results below. This permanently removes them from the Public Results feed and player history.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-[#171722] border border-[#252538] text-xs font-mono text-zinc-400 shrink-0">
            Showing latest {Math.min(testResults.length, 12)} of {testResults.length}
          </span>
        </div>

        {testResults.length === 0 ? (
          <div className="text-center py-10 rounded-xl bg-[#171722] border border-[#252538] space-y-2">
            <Award size={28} className="text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No test results have been published yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {testResults.slice(0, 12).map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#171722] border border-[#252538]/80"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-[#0F0F17] border border-[#252538]">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-white text-sm truncate">
                      {res.playerIgn} <span className="text-zinc-500">&middot; {res.gamemode}</span>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono truncate block">
                      {res.previousTier} &rarr; {res.newTier} &middot; {res.score} &middot; {res.testerName} &middot; {res.date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete tier test result for ${res.playerIgn} (${res.gamemode}, ${res.newTier}, ${res.date})? This will also remove it from the player's history.`)) {
                      deleteTestResult(res.id);
                      onFeedback(`Deleted tier test result for ${res.playerIgn}!`);
                    }
                  }}
                  className="px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-bold transition-all cursor-pointer shrink-0"
                  title={`Delete result for ${res.playerIgn}`}
                >
                  <Trash2 size={13} className="mr-1" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};