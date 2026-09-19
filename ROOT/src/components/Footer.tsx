import React from 'react';
import { useData } from '../context/DataContext';
import { Shield, Sparkles, ExternalLink } from 'lucide-react';
import { INITIAL_GAMEMODES } from '../data/initialData';

export const Footer: React.FC = () => {
  const { navigateTo, setSelectedGamemode, serverConfig } = useData();

  return (
    <footer className="mt-24 border-t border-[#252538] bg-[#0A0A10] text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-white shadow-glow-purple-sm">
                <Shield size={18} />
              </div>
              <span className="font-extrabold text-lg text-white tracking-normal whitespace-nowrap">
                BEDROCK&nbsp;<span className="text-[#8B5CF6]">UNION</span>
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              The premier SaaS competitive tier testing & ranking platform for Minecraft Bedrock Edition.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Bedrock Union Network v4.2</span>
            </div>
          </div>

          {/* Gamemodes */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
              Competitive Modes
            </h4>
            <ul className="space-y-2">
              {INITIAL_GAMEMODES.map((gm) => (
                <li key={gm.id}>
                  <button
                    onClick={() => {
                      setSelectedGamemode(gm.id);
                      navigateTo('tierlist');
                    }}
                    className="hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    {gm.name} Tierlist
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('leaderboards')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Leaderboards
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('players')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Player Registry
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('results')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Public Results Feed
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('testing')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Tier Testing Guide
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('staff')} className="hover:text-purple-300 transition-colors cursor-pointer">
                  Staff & Testers
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Discord */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
              Community
            </h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Join our active community with verified tier queues, automated scrims, and announcements.
            </p>
            <a
              href={serverConfig.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#6975F5] text-white font-bold transition-all shadow-glow-purple-sm cursor-pointer"
            >
              <span>Join Discord</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#252538] flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-400 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Bedrock Union. Not affiliated with Mojang Studios or Microsoft.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('admin')} className="hover:text-purple-400 transition-colors cursor-pointer font-mono">
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};