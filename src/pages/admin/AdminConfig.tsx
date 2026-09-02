import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Download, Upload, RefreshCw, Cloud, CloudUpload } from 'lucide-react';

export const AdminConfig: React.FC<{ onFeedback: (msg: string) => void }> = ({ onFeedback }) => {
  const { serverConfig, updateServerConfig, resetToDefaults, exportDataJSON, importDataJSON, syncWithCloud, pushFullSnapshotToCloud, cloudSyncStatus, lastCloudSync } = useData();
  const [jsonInput, setJsonInput] = useState('');

  const handleExport = () => {
    const data = exportDataJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valtrox_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    onFeedback('Database exported to JSON file!');
  };

  const handleImport = () => {
    if (!jsonInput.trim()) return;
    const success = importDataJSON(jsonInput);
    if (success) {
      onFeedback('Database successfully restored from JSON!');
      setJsonInput('');
    } else {
      alert('Invalid JSON structure.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Server Configuration */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#171722] border border-[#252538] space-y-6">
        <h3 className="text-lg font-extrabold text-white">Live Server Configuration</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Tier Testing Queue Status</label>
            <select
              value={serverConfig.testingStatus}
              onChange={(e) => updateServerConfig({ testingStatus: e.target.value as any })}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
            >
              <option value="Open">🟢 Open (Normal Queues Active)</option>
              <option value="Priority Only">🟡 Priority Only (Donors / High Tiers)</option>
              <option value="Closed">🔴 Closed (Maintenance / Season Reset)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Active Season Title</label>
            <input
              type="text"
              value={serverConfig.activeSeason}
              onChange={(e) => updateServerConfig({ activeSeason: e.target.value })}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Server Name (shown in result embeds)</label>
            <input
              type="text"
              value={serverConfig.serverName}
              onChange={(e) => updateServerConfig({ serverName: e.target.value })}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Discord Members Metric</label>
            <input
              type="number"
              value={serverConfig.discordMembers}
              onChange={(e) => updateServerConfig({ discordMembers: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Online Members Metric</label>
            <input
              type="number"
              value={serverConfig.onlineMembers}
              onChange={(e) => updateServerConfig({ onlineMembers: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
            />
          </div>
        </div>
      </div>

      {/* Backup & Recovery */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#171722] border border-[#252538] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-white">Database Backup & Recovery</h3>
            <p className="text-xs text-zinc-400">Export or restore full JSON snapshot of all players, tier results, and staff.</p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold flex items-center gap-2 shadow-glow-purple-sm transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Export JSON Backup</span>
          </button>
        </div>

        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-zinc-400 block">Restore Database from JSON String</label>
          <textarea
            rows={3}
            placeholder="Paste exported JSON payload here to restore..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-[#7C3AED]"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleImport}
              className="px-4 py-2 rounded-xl bg-[#171722] hover:bg-[#1F1F2E] border border-[#252538] text-zinc-200 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Upload size={14} />
              <span>Import & Restore</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all data back to factory seed defaults?')) {
                  resetToDefaults();
                  onFeedback('Database reset to defaults.');
                }
              }}
              className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-400 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Reset to Factory Seed Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cloud Database Sync */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#171722] border border-[#252538] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Cloud size={20} className="text-[#7C3AED]" />
              Cloud Database Sync
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Sync your database across all admins and testers. Everyone sees the same players, rosters, and results.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${
              cloudSyncStatus === 'synced' ? 'bg-green-500' : 
              cloudSyncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' : 
              'bg-red-500'
            }`} />
            <span className="text-xs text-zinc-400">
              {cloudSyncStatus === 'synced' ? '● Synced' : 
               cloudSyncStatus === 'syncing' ? '● Syncing...' : 
               '● Sync Error'}
            </span>
          </div>
        </div>

        {lastCloudSync && (
          <p className="text-[10px] text-zinc-500">
            Last synced: {lastCloudSync.toLocaleTimeString()} ({lastCloudSync.toLocaleDateString()})
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={async () => {
              const result = await syncWithCloud();
              onFeedback(result.message);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold flex items-center gap-2 shadow-glow-purple-sm transition-all cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Pull from Cloud</span>
          </button>

          <button
            onClick={async () => {
              if (confirm('This will OVERWRITE the cloud database with YOUR current local data. All other admins will receive this data on their next sync. Continue?')) {
                const result = await pushFullSnapshotToCloud();
                onFeedback(result.message);
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <CloudUpload size={14} />
            <span>Push My Data to Cloud</span>
          </button>
        </div>

        <p className="text-[10px] text-zinc-500 leading-relaxed">
          ⚡ Auto-sync runs every 15 seconds. Changes you make are automatically pushed within ~2 seconds.<br/>
          🟢 <strong>Pull</strong> = Download latest cloud data to this browser. <strong>Push</strong> = Upload your local data as the master copy.
        </p>
      </div>
    </div>
  );
};