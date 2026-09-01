import React from 'react';
import { useData } from '../context/DataContext';
import { Monitor, Smartphone } from 'lucide-react';

export const PerformanceToggle: React.FC = () => {
  const { perfMode, setPerfMode } = useData();

  return (
    <div
      className="flex items-center gap-0.5 p-0.5 rounded-xl bg-[#0F0F17] border border-[#252538] shadow-sm shrink-0"
      title="Performance mode: PC = full graphics, Phone = fast & low-end friendly"
    >
      {/* PC mode button */}
      <button
        onClick={() => setPerfMode('pc')}
        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
          perfMode === 'pc'
            ? 'bg-[#7C3AED]/30 text-white border border-[#7C3AED]/60 shadow-glow-purple-sm'
            : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#171722] border border-transparent'
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
            : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#171722] border border-transparent'
        }`}
        title="Phone mode (fast, fewer animations, lower memory)"
      >
        <Smartphone size={15} className="stroke-[2.2]" />
      </button>
    </div>
  );
};