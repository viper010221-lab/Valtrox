import React from 'react';
import { useData } from '../context/DataContext';
import { Monitor, Smartphone } from 'lucide-react';

export const PerformanceToggle: React.FC = () => {
  const { perfMode, setPerfMode } = useData();

  return (
    <div
      className="flex items-center gap-0.5 p-0.5 rounded-xl bg-[#0B3C70]/55 border border-white/20 shadow-sm shrink-0"
      title="Performance mode: PC = full graphics, Phone = fast & low-end friendly"
    >
      {/* PC mode button */}
      <button
        onClick={() => setPerfMode('pc')}
        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
          perfMode === 'pc'
            ? 'bg-[#1976D2]/30 text-white border border-[#1976D2]/60 shadow-glow-blue-sm'
            : 'text-sky-300 hover:text-sky-100 hover:bg-[#0E4A87]/70 border border-transparent'
        }`}
        title="PC mode (full graphics & animations)"
      >
        <Monitor size={15} className="stroke-[2.2]" />
      </button>

      {/* Phone mode button */}
      <button
        onClick={() => setPerfMode('phone')}
        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
          perfMode === 'phone'
            ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
            : 'text-sky-300 hover:text-sky-100 hover:bg-[#0E4A87]/70 border border-transparent'
        }`}
        title="Phone mode (fast, fewer animations, lower memory)"
      >
        <Smartphone size={15} className="stroke-[2.2]" />
      </button>
    </div>
  );
};