import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { McBlock } from './McBlock';
import { ExternalLink, Trophy, Layers, Users, Activity, Sparkles } from 'lucide-react';

/**
 * HeroBanner
 * ----------
 * Full-width 3D banner pinned to the top of the landing page. Pairs the
 * extruded BEDROCK UNION wordmark with the blocky BU monogram, live server
 * stats and the two primary calls to action.
 *
 * Depth is entirely CSS driven via the shared helpers in index.css:
 *   .scene-3d      — sets up the shared perspective
 *   .panel-3d      — chunky slab edge + cast shadow for the backing plate
 *   .wordmark-3d   — MinecraftTen face with a stacked text-shadow extrude
 *   .block-float   — isometric idle bob for the monogram
 *   .mc-block      — drawn isometric cubes used as loose floating decoration
 * Expensive blurs and idle motion are skipped unless perfMode is 'pc'.
 */
export const HeroBanner: React.FC = () => {
  const { serverConfig, navigateTo, perfMode } = useData();
  const isPc = perfMode === 'pc';

  const stats = [
    { label: 'Tracked Players', value: serverConfig.totalRegisteredPlayers.toLocaleString(), Icon: Users },
    { label: 'Tests Logged', value: serverConfig.totalTestsConducted.toLocaleString(), Icon: Activity },
    { label: 'Gamemodes', value: '4', Icon: Layers },
    { label: 'Scrims Hosted', value: serverConfig.scrimsHosted.toLocaleString(), Icon: Trophy },
  ];

  return (
    <section className="scene-3d relative">
      {/* Loose isometric blocks drifting around the banner.
          z-20 keeps them in FRONT of the backing plate — behind it they get
          sliced by the panel edge and read as a rendering glitch. */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden sm:block">
        <McBlock tone="gold" size={44} float={isPc} className="absolute -top-4 left-6" />
        <McBlock
          tone="cyan"
          size={34}
          float={isPc}
          className="absolute -right-4 top-[28%]"
          style={{ animationDelay: '1.6s' }}
        />
        <McBlock
          tone="blue"
          size={40}
          float={isPc}
          className="absolute -bottom-4 left-[26%]"
          style={{ animationDelay: '3.1s' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Backing plate — clipped so the rays and grid respect the radius */}
        <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-[#FBBF24]/40 slab-3d sheen-3d bg-gradient-to-b from-[#1565C0]/92 via-[#0E4A87]/92 to-[#0B3C70]/96">
          <div className="absolute inset-0 bg-sky-rays opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.12]" />
          {isPc && (
            <>
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] h-[340px] bg-[#FBBF24]/20 blur-[120px] rounded-full" />
              <div className="absolute -bottom-28 -right-16 w-80 h-80 bg-[#42A5F5]/25 blur-[100px] rounded-full" />
            </>
          )}
        </div>

        {/* Content sits outside the clipped plate so the 3D extrude can spill */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-14 pt-10 sm:pt-14 pb-14">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            {/* Blocky BU monogram */}
            <img
              src="/bedrock-union-bu.svg"
              alt="Bedrock Union monogram"
              className={`w-40 sm:w-52 lg:w-60 h-auto shrink-0 drop-shadow-[0_20px_30px_rgba(4,18,42,0.55)] ${
                isPc ? 'block-float' : ''
              }`}
            />

            {/* Wordmark, tagline, stats and CTAs */}
            <div className="flex-1 text-center lg:text-left">
              {/* Live status pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0B3C70]/80 border border-[#FBBF24]/45 text-[11px] font-semibold text-sky-100 mb-6">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#42A5F5] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1976D2]" />
                </span>
                <span>Season 1 · Minecraft Bedrock Competitive</span>
              </div>

              <h1 className={`mb-5 ${isPc ? 'wordmark-3d-tilt' : ''}`}>
                <span className="wordmark-3d wordmark-3d--gold block text-5xl sm:text-6xl lg:text-7xl">
                  Bedrock
                </span>
                <span className="wordmark-3d wordmark-3d--blue block text-4xl sm:text-5xl lg:text-6xl">
                  Union
                </span>
              </h1>

              <p className="heading-gold font-minecraft text-base sm:text-lg">
                The Standard for Bedrock Tier Testing
              </p>

              <p className="mt-3 max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base text-sky-100 leading-relaxed">
                The official competitive platform for Minecraft Bedrock — standardized 15-tier PvP
                calibration, verified testers, live leaderboards and season-long rankings.
              </p>

              {/* Live stat slabs */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map(({ label, value, Icon }) => (
                  <div
                    key={label}
                    className="card-3d tilt-3d rounded-2xl bg-[#0B3C70]/70 px-3 py-3 flex flex-col items-center lg:items-start gap-1"
                  >
                    <Icon size={15} className="text-[#FBBF24]" />
                    <span className="text-lg font-black text-white leading-none extrude-3d">{value}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-200">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calls to action */}
              <div className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href={serverConfig.discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-3d px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#1976D2] to-[#42A5F5] text-white font-bold text-sm flex items-center gap-2"
                >
                  <Sparkles size={16} className="text-[#FBBF24]" />
                  <span>Join Official Discord</span>
                  <ExternalLink size={15} />
                </a>

                <button
                  onClick={() => navigateTo('tierlist')}
                  className="btn-3d px-6 py-3.5 rounded-xl bg-[#0E4A87]/85 text-white font-semibold text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Layers size={16} className="text-[#42A5F5]" />
                  <span>Browse Tierlists</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
