import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Bell, Trash2 } from 'lucide-react';

export const AdminAnnouncements: React.FC<{ onFeedback: (msg: string) => void }> = ({ onFeedback }) => {
  const { announcements, addAnnouncement, deleteAnnouncement } = useData();

  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<'Update' | 'Tournament' | 'Testing Openings' | 'Rule Changes' | 'General'>('Update');
  const [newAnnSummary, setNewAnnSummary] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnPinned, setNewAnnPinned] = useState(false);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;

    addAnnouncement({
      title: newAnnTitle.trim(),
      category: newAnnCategory,
      summary: newAnnSummary || newAnnTitle,
      content: newAnnContent,
      author: 'Staff Management',
      authorRole: 'Admin',
      date: new Date().toISOString().split('T')[0],
      pinned: newAnnPinned,
      views: 1,
      tags: ['Official', newAnnCategory]
    });

    setNewAnnTitle('');
    setNewAnnSummary('');
    setNewAnnContent('');
    setNewAnnPinned(false);
    onFeedback('Announcement published to public news feed!');
  };

  return (
    <div className="space-y-6">
      {/* Create Form */}
      <div className="p-6 rounded-2xl bg-[#171722] border border-[#252538] space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Bell size={16} className="text-[#8B5CF6]" />
          <span>Create Community Announcement</span>
        </h3>

        <form onSubmit={handleCreateAnnouncement} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Headline Title</label>
              <input
                type="text"
                placeholder="e.g. Valtrox $1,000 Bedrock Scrim Championship"
                value={newAnnTitle}
                onChange={(e) => setNewAnnTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Category</label>
              <select
                value={newAnnCategory}
                onChange={(e) => setNewAnnCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-[#7C3AED]"
              >
                <option value="Update">Update</option>
                <option value="Tournament">Tournament</option>
                <option value="Testing Openings">Testing Openings</option>
                <option value="Rule Changes">Rule Changes</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Summary (1-2 sentences)</label>
            <input
              type="text"
              placeholder="Quick summary shown on previews..."
              value={newAnnSummary}
              onChange={(e) => setNewAnnSummary(e.target.value)}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Full Announcement Body</label>
            <textarea
              rows={4}
              placeholder="Write announcement body (supports markdown)..."
              value={newAnnContent}
              onChange={(e) => setNewAnnContent(e.target.value)}
              className="w-full px-3 py-2 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED]"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={newAnnPinned}
                onChange={(e) => setNewAnnPinned(e.target.checked)}
                className="accent-[#7C3AED]"
              />
              <span>Pin to top of news feed</span>
            </label>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold shadow-glow-purple-sm transition-all cursor-pointer"
          >
            Publish Announcement
          </button>
        </form>
      </div>

      {/* List */}
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div key={ann.id} className="p-4 rounded-xl bg-[#171722] border border-[#252538] flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{ann.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#7C3AED]/20 text-purple-300">
                  {ann.category}
                </span>
              </div>
              <span className="text-xs text-zinc-400">{ann.date} &bull; {ann.summary}</span>
            </div>
            <button
              onClick={() => {
                deleteAnnouncement(ann.id);
                onFeedback('Announcement deleted.');
              }}
              className="p-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
