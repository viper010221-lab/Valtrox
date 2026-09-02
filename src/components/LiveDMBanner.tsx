import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { RankBadge } from './RankBadge';
import { Bell, X, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LiveDMBanner: React.FC = () => {
  const { activeLiveDM, dismissLiveDM } = useData();

  return (
    <AnimatePresence>
      {activeLiveDM && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: -80 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="fixed top-8 inset-x-0 mx-auto z-[9999] w-[92%] max-w-xl pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-3xl bg-[#171722]/98 border-2 border-red-500/80 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(239,68,68,0.45)] backdrop-blur-2xl p-5 text-white">
            {/* Ambient Pulsing Glow */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-24 bg-gradient-to-r from-red-500/30 via-amber-500/20 to-purple-500/30 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse">
                <MessageSquare size={22} className="stroke-[2.5]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-red-400 font-mono flex items-center gap-1 bg-red-950/60 px-2 py-0.5 rounded-md border border-red-500/30">
                    <Sparkles size={12} className="text-amber-400" />
                    <span>Live DM Broadcast</span>
                  </span>
                  <RankBadge rank={activeLiveDM.senderRank} size="sm" />
                  <span className="text-xs font-bold text-zinc-300 font-mono">@{activeLiveDM.sender}</span>
                </div>

                <p className="text-sm font-semibold text-white leading-relaxed break-words pr-2">
                  {activeLiveDM.message}
                </p>
              </div>

              <button
                onClick={dismissLiveDM}
                className="p-2 rounded-xl bg-[#0F0F17] hover:bg-red-950/60 hover:text-red-300 border border-[#252538] hover:border-red-500/40 text-zinc-400 transition-all cursor-pointer shrink-0"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>

            {/* 10-Second Countdown Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-red-950/80 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-shimmer" style={{ width: '100%' }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
