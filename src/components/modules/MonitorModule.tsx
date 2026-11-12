import React from 'react';
import { Activity, Users, PlayCircle, TrendingUp, DollarSign, Radio, ShieldCheck, RefreshCw } from 'lucide-react';
import { MonitorStats } from '../../types';

interface MonitorModuleProps {
  stats: MonitorStats;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
  countdown: number;
  onRefreshNow: () => void;
}

export const MonitorModule: React.FC<MonitorModuleProps> = ({
  stats,
  autoRefresh,
  setAutoRefresh,
  countdown,
  onRefreshNow,
}) => {
  // 24h Hourly Data Points for the responsive SVG Chart
  const hourlyData = [
    { hour: '00:00', listeners: 320, plays: 1200 },
    { hour: '03:00', listeners: 210, plays: 1800 },
    { hour: '06:00', listeners: 450, plays: 3200 },
    { hour: '09:00', listeners: 680, plays: 6400 },
    { hour: '12:00', listeners: 820, plays: 9800 },
    { hour: '15:00', listeners: 740, plays: 13200 },
    { hour: '18:00', listeners: 910, plays: 16800 },
    { hour: '21:00', listeners: stats.listenersNow, plays: stats.playsToday },
  ];

  const maxListeners = 1000;
  const chartHeight = 160;
  const chartWidth = 700;

  // Calculate SVG Polyline points
  const points = hourlyData
    .map((d, i) => {
      const x = (i / (hourlyData.length - 1)) * chartWidth;
      const y = chartHeight - (d.listeners / maxListeners) * (chartHeight - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  return (
    <div className="space-y-6">
      {/* Header and Auto-Refresh Banner */}
      <div className="bg-[#121212] border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-emerald-400">
              TELEMETRÍA EN TIEMPO REAL
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs font-mono text-zinc-400">Los Frailes, RD</span>
          </div>
          <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#FFD700]" />
            Monitor 5 Min · Operaciones En Vivo
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Supervisión ininterrumpida de audiencia, reproducciones y monetización digital sin recargar la pestaña.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs font-mono hidden sm:block">
            <div className="text-zinc-400">Próxima actualización:</div>
            <div className="text-[#FFD700] font-bold">{autoRefresh ? `${countdown} segundos` : 'Pausado'}</div>
          </div>

          <button
            onClick={onRefreshNow}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 border border-zinc-700"
            title="Refrescar métricas ahora"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Refrescar Ahora</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Oyentes */}
        <div className="bg-[#121212] border border-[#FFD700]/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Oyentes En Vivo</span>
            <Users className="w-4 h-4 text-[#FFD700]" />
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums tracking-tight">
            {stats.listenersNow}
          </div>
          <div className="mt-2 text-xs font-mono text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{stats.listenersDelta}</span>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFD700]/5 rounded-bl-full pointer-events-none" />
        </div>

        {/* Reproducciones Hoy */}
        <div className="bg-[#121212] border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Reproducciones Hoy</span>
            <PlayCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums tracking-tight">
            {stats.playsToday.toLocaleString()}
          </div>
          <div className="mt-2 text-xs font-mono text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{stats.playsDelta}</span>
          </div>
        </div>

        {/* Nuevos Seguidores */}
        <div className="bg-[#121212] border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Nuevos Seguidores</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums tracking-tight">
            +{stats.newFollowers}
          </div>
          <div className="mt-2 text-xs font-mono text-purple-400">
            <span>+18 hoy en Spotify / YouTube</span>
          </div>
        </div>

        {/* Ingresos Estimados */}
        <div className="bg-[#121212] border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Ingresos Est. Hoy</span>
            <DollarSign className="w-4 h-4 text-[#FFD700]" />
          </div>
          <div className="text-3xl font-black text-[#FFD700] font-mono tabular-nums tracking-tight">
            ${stats.estimatedRevenueUsd.toFixed(2)}
          </div>
          <div className="mt-2 text-xs font-mono text-zinc-400">
            <span>RD$ {stats.estimatedRevenueDop.toLocaleString(undefined, { maximumFractionDigits: 0 })} DOP</span>
          </div>
        </div>
      </div>

      {/* Real SVG 24-Hour Listener Chart */}
      <div className="bg-[#121212] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FFD700]" />
              Curva de Audiencia 24 Horas (Oyentes Simultáneos)
            </h3>
            <p className="text-xs text-zinc-400">
              Picos de sintonía en Los Frailes y transmisión internacional
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#FFD700]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700]" />
              Oyentes en Vivo
            </span>
            <span className="text-zinc-500">Pico Hoy: 950 Oyentes</span>
          </div>
        </div>

        {/* Responsive SVG Chart */}
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-44 overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFD700" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((p, idx) => (
              <line
                key={idx}
                x1="0"
                y1={chartHeight * p}
                x2={chartWidth}
                y2={chartHeight * p}
                stroke="#27272a"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            ))}

            {/* Filled area */}
            <polygon points={areaPoints} fill="url(#chartGradient)" />

            {/* Polyline line */}
            <polyline
              fill="none"
              stroke="#FFD700"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />

            {/* Data points dots */}
            {hourlyData.map((d, i) => {
              const cx = (i / (hourlyData.length - 1)) * chartWidth;
              const cy = chartHeight - (d.listeners / maxListeners) * (chartHeight - 20) - 10;
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="4" fill="#0A0A0A" stroke="#FFD700" strokeWidth="2" />
                  <text
                    x={cx}
                    y={chartHeight - 2}
                    textAnchor="middle"
                    fill="#71717a"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {d.hour}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Studio Transmitter Health Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-[#121212] border border-zinc-800 p-4 rounded-xl space-y-1">
          <div className="text-zinc-500 uppercase tracking-wider text-[10px]">Tasa de Transferencia</div>
          <div className="text-sm font-bold text-white">320 kbps High Definition</div>
          <div className="text-emerald-400 text-[11px]">Compresión AAC+ VBR Activa</div>
        </div>
        <div className="bg-[#121212] border border-zinc-800 p-4 rounded-xl space-y-1">
          <div className="text-zinc-500 uppercase tracking-wider text-[10px]">Latencia de Transmisión</div>
          <div className="text-sm font-bold text-white">1.18 Segundos</div>
          <div className="text-emerald-400 text-[11px]">Buffer de Red 100% Óptimo</div>
        </div>
        <div className="bg-[#121212] border border-zinc-800 p-4 rounded-xl space-y-1">
          <div className="text-zinc-500 uppercase tracking-wider text-[10px]">Uptime Emisora 24/7</div>
          <div className="text-sm font-bold text-[#FFD700]">99.98% Ininterrumpido</div>
          <div className="text-zinc-400 text-[11px]">Los Frailes Central Relay</div>
        </div>
      </div>
    </div>
  );
};
