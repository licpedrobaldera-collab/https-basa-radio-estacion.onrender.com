import React from 'react';
import { Radio, Sparkles, FolderArchive, Activity, Video, Cog, Sliders, RefreshCw, Volume2 } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
  countdown: number;
  onManualRefresh: () => void;
  currentTime: string;
  isPlayingRadio: boolean;
  stationName: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  autoRefresh,
  setAutoRefresh,
  countdown,
  onManualRefresh,
  currentTime,
  isPlayingRadio,
  stationName,
}) => {
  const navItems = [
    { id: 'radio', label: 'Radio 24/7', icon: Radio },
    { id: 'generator', label: 'Crew 4 IA', icon: Sparkles },
    { id: 'ritmo', label: 'Caja de Ritmo RD', icon: Sliders },
    { id: 'catalog', label: 'Catálogo', icon: FolderArchive },
    { id: 'monitor', label: 'Monitor 5 Min', icon: Activity },
    { id: 'youtube', label: 'YouTube & DSPs', icon: Video },
    { id: 'factory', label: 'Modo Fábrica', icon: Cog },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#FFD700]/25">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#radio"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('radio');
            }}
            className="text-lg sm:text-xl font-black tracking-tight text-[#FFD700] hover:text-[#FFE566] transition-colors whitespace-nowrap shrink-0 font-display flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700] animate-pulse" />
            BASA V11 ULTRA
          </a>
          <span className="hidden xl:inline text-xs font-mono text-zinc-400 border-l border-zinc-800 pl-3">
            Los Frailes, RD 🇩🇴
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#FFD700] text-black font-semibold shadow-[0_0_12px_rgba(255,215,0,0.35)]'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-[#FFD700]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action / Quick Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isPlayingRadio && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="max-w-[110px] truncate">{stationName}</span>
            </div>
          )}

          <button
            onClick={() => setActiveTab(activeTab === 'generator' ? 'ritmo' : 'generator')}
            className="px-3.5 py-1.5 text-xs font-bold bg-[#FFD700] text-black rounded-lg hover:bg-[#FFE566] transition-transform active:scale-95 shadow-[0_0_15px_rgba(255,215,0,0.25)] whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Crear Tema RD</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-zinc-900 bg-[#0E0E0E]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap shrink-0 flex items-center gap-1 ${
                isActive ? 'bg-[#FFD700] text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dominican Studio Sub-bar: Producer Credits & Soft Auto-Refresh */}
      <div className="bg-[#121212] border-t border-zinc-900/90 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="text-[#FFD700] font-bold">Lic. Pedro Baldera x El Forense</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400 hidden sm:inline">Los Frailes, Santo Domingo Este</span>
            <span className="text-zinc-600 hidden sm:inline">·</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
              Producción 24/7 En Vivo
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto refresh toggle (soft, no window reload, keeps radio playing) */}
            <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300 select-none hover:text-white">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#FFD700] rounded"
              />
              <span className="text-[11px]">
                Auto-Refresco {autoRefresh ? `(${countdown}s)` : 'Pausado'}
              </span>
            </label>

            <button
              onClick={onManualRefresh}
              title="Refrescar métricas ahora sin recargar página"
              className="p-1 text-zinc-400 hover:text-[#FFD700] transition-colors rounded hover:bg-zinc-800"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <div className="font-mono text-zinc-400 text-[11px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              🕒 {currentTime}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
