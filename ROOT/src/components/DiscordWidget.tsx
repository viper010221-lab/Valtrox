import React from 'react';
import { useData } from '../context/DataContext';
import { MessageSquare, Users, ShieldCheck, ExternalLink, Activity } from 'lucide-react';

export const DiscordWidget: React.FC = () => {
  const { serverConfig } = useData();

  return (
    <div className="relative overflow-hidden rounded-3xl card-3d bg-gradient-to-br from-[#0E4A87]/85 via-[#1257A0] to-[#0E4A87] border border-[#5865F2]/40 p-8 sm:p-10">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#5865F2]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/40 text-xs font-semibold text-sky-200">
            <MessageSquare size={14} className="text-[#5865F2]" />
            <span>Official Bedrock Union™ Bedrock Hub</span>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-3.5">
            <img
              src="https://cdn.discordapp.com/icons/1539146604794224671/24a72cd160f47dc58f85ab1261b60170.png"
              alt="Bedrock Union Server Icon"
              className="w-14 h-14 rounded-2xl border-2 border-[#5865F2]/50 shadow-glow-blue-sm object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <h3 className="text-2xl sm:text-3xl font-black heading-gold tracking-tight">
                Bedrock Union™ | MCPE Competitive
              </h3>
              <p className="text-xs text-sky-200 font-mono">
                {serverConfig.discordUrl.replace(/^https?:\/\//, '')} &bull; Live Bedrock Community
              </p>
            </div>
          </div>

          <p className="text-sm text-sky-200 leading-relaxed">
            The main Bedrock Union Minecraft community where players participate in scrims, tier testing, competitive events, and Minecraft PvP activities.
          </p>

          {/* Live Metrics */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-mono text-sky-100">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B3C70]/65 border border-white/20">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span><strong>{serverConfig.onlineMembers.toLocaleString()}</strong> Online Now</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B3C70]/65 border border-white/20">
              <Users size={14} className="text-sky-300" />
              <span><strong>{serverConfig.discordMembers.toLocaleString()}</strong> Total Members</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B3C70]/65 border border-white/20">
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
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#5865F2] to-[#1976D2] hover:from-[#6975F5] hover:to-[#42A5F5] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(88,101,242,0.45)] transition-all transform hover:-translate-y-0.5"
          >
            <span>Join Discord Server</span>
            <ExternalLink size={16} />
          </a>
          <div className="text-center text-[11px] text-sky-200">
            Instant automatic tier test ticket bot & role sync
          </div>
        </div>
      </div>
    </div>
  );
};