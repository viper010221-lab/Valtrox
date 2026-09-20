import React from 'react';
import { useData } from '../context/DataContext';
import { Sparkles, ExternalLink } from 'lucide-react';
import { INITIAL_GAMEMODES } from '../data/initialData';

export const Footer: React.FC = () => {
  const { navigateTo, setSelectedGamemode, serverConfig } = useData();

  return (
    <footer className="mt-24 border-t border-white/20 bg-[#0B3C70]/70 text-sky-200 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img
                src="/bedrock-union-bu.svg"
                alt="Bedrock Union"
                className="w-11 h-11 object-contain drop-shadow-[0_4px_6px_rgba(4,18,42,0.55)]"
              />
              <span className="font-extrabold text-lg font-minecraft tracking-normal whitespace-nowrap">
                <span className="heading-gold">BEDROCK</span>&nbsp;<span className="heading-blue">UNION</span>
              </span>
            </div>
            <p className="text-sky-200 text-xs leading-relaxed">
              The premier SaaS competitive tier testing & ranking platform for Minecraft Bedrock Edition.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-sky-200">
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
                    className="hover:text-sky-200 transition-colors cursor-pointer"
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
                <button onClick={() => navigateTo('leaderboards')} className="hover:text-sky-200 transition-colors cursor-pointer">
                  Leaderboards
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('players')} className="hover:text-sky-200 transition-colors cursor-pointer">
                  Player Registry
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('results')} className="hover:text-sky-200 transition-colors cursor-pointer">
                  Public Results Feed
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('testing')} className="hover:text-sky-200 transition-colors cursor-pointer">
                  Tier Testing Guide
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('staff')} className="hover:text-sky-200 transition-colors cursor-pointer">
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
            <p className="text-sky-200 text-xs leading-relaxed">
              Join our active community with verified tier queues, automated scrims, and announcements.
            </p>
            <a
              href={serverConfig.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#6975F5] text-white font-bold transition-all shadow-glow-blue-sm cursor-pointer"
            >
              <span>Join Discord</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-sky-200 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Bedrock Union. Not affiliated with Mojang Studios or Microsoft.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('admin')} className="hover:text-sky-300 transition-colors cursor-pointer font-mono">
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};