import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Bell, Tag, Calendar, User, Eye, Pin, ChevronRight, X, Sparkles } from 'lucide-react';
import { Announcement } from '../types';

export const AnnouncementsPage: React.FC = () => {
  const { announcements } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalAnn, setActiveModalAnn] = useState<Announcement | null>(null);

  const categories = ['All', 'Testing Openings', 'Tournament', 'Update', 'Rule Changes'];

  const filtered = announcements.filter((a) => {
    if (selectedCategory === 'All') return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252538] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
            <Bell size={14} />
            <span>Bedrock Union News & Bulletins</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Announcements & Competitive Events
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Official platform updates, tournament registrations, rules recalibrations, and testing schedule announcements.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm'
                  : 'bg-[#171722] text-zinc-400 hover:text-white border border-[#252538]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-6">
        {filtered.map((ann) => (
          <div
            key={ann.id}
            onClick={() => setActiveModalAnn(ann)}
            className={`p-6 sm:p-8 rounded-3xl bg-[#171722] border transition-all cursor-pointer group space-y-4 ${
              ann.pinned ? 'border-[#7C3AED]/50 shadow-[0_0_20px_rgba(124,58,237,0.15)]' : 'border-[#252538] hover:border-zinc-700'
            }`}
          >
            {/* Top Bar: Category, Pinned, Date */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {ann.pinned && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                    <Pin size={12} className="rotate-45" />
                    <span>PINNED</span>
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-[#7C3AED]/20 text-purple-300 border border-[#7C3AED]/30 text-xs font-semibold">
                  {ann.category}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  <span>{ann.date}</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Eye size={13} />
                  <span>{ann.views.toLocaleString()} reads</span>
                </span>
              </div>
            </div>

            {/* Title & Summary */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-purple-300 transition-colors">
                {ann.title}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {ann.summary}
              </p>
            </div>

            {/* Tags & Author Footer */}
            <div className="pt-4 border-t border-[#252538] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {ann.tags?.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-[#0F0F17] text-zinc-400 border border-[#252538] font-mono text-[11px]">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-zinc-400">
                <span>Posted by <strong className="text-white">{ann.author}</strong> ({ann.authorRole})</span>
                <span className="text-purple-400 font-bold ml-2 group-hover:translate-x-1 transition-transform">Read full announcement &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {activeModalAnn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-3xl bg-[#171722] border border-[#7C3AED]/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[85vh] overflow-y-auto space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalAnn(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-[#0F0F17] text-zinc-400 hover:text-white border border-[#252538]"
            >
              <X size={18} />
            </button>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#7C3AED]/20 text-purple-300 border border-[#7C3AED]/30 text-xs font-semibold">
                  {activeModalAnn.category}
                </span>
                <span className="text-xs text-zinc-400 font-mono">{activeModalAnn.date}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeModalAnn.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>Author: <strong className="text-white">{activeModalAnn.author}</strong> ({activeModalAnn.authorRole})</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-sm text-zinc-300 leading-relaxed space-y-4 whitespace-pre-line border-t border-b border-[#252538] py-6">
              {activeModalAnn.content}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {activeModalAnn.tags?.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-[#0F0F17] text-zinc-400 text-xs font-mono">
                    #{t}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setActiveModalAnn(null)}
                className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};