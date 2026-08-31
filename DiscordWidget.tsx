import React from 'react';
import { useData } from '../context/DataContext';
import { MessageSquare, Users, ShieldCheck, ExternalLink, Activity } from 'lucide-react';

export const DiscordWidget: React.FC = () => {
  const { serverConfig } = useData();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#171722] via-[#1A1A28] to-[#12121E] border border-[#5865F2]/40 p-8 sm:p-10 shadow-[0_10px_35px_rgba(88,101,242,0.2)]">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#5865F2]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/40 text-xs font-semibold text-purple-300">
            <MessageSquare size={14} className="text-[#5865F2]" />
            <span>Official Valtrox™ Bedrock Hub</span>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-3.5">
            <img
              src="https://cdn.discordapp.com/icons/1539146604794224671/a5cbe47cd560c7ffd600ac3794ec53de.png"
              alt="Valtrox Server Icon"
              className="w-14 h-14 rounded-2xl border-2 border-[#5865F2]/50 shadow-glow-purple-sm object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Valtrox™ | MCPE Competitive
              </h3>
              <p className="text-xs text-purple-300 font-mono">
                discord.gg/tV9vrAeJHH &bull; Live Bedrock Community
              </p>
            </div>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed">
            The main Valtrox Minecraft community where players participate in scrims, tier testing, competitive events, and Minecraft PvP activities.
          </p>

          {/* Live Metrics */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-mono text-zinc-300">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F0F17]/80 border border-[#252538]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span><strong>{serverConfig.onlineMembers.toLocaleString()}</strong> Online Now</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F0F17]/80 border border-[#252538]">
              <Users size={14} className="text-purple-400" />
              <span><strong>{serverConfig.discordMembers.toLocaleString()}</strong> Total Members</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F0F17]/80 border border-[#252538]">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Live Synced</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
          <a
            href={serverConfig.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#5865F2] to-[#7C3AED] hover:from-[#6975F5] hover:to-[#8B5CF6] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(88,101,242,0.45)] transition-all transform hover:-translate-y-0.5"
          >
            <span>Join Discord Server</span>
            <ExternalLink size={16} />
          </a>
          <div className="text-center text-[11px] text-zinc-400">
            Instant automatic tier test ticket bot & role sync
          </div>
        </div>
      </div>
    </div>
  );
};