import React from 'react';
import { Radio, Play, Pause, Volume2, Clock, Users, Disc3, ShieldCheck, Zap } from 'lucide-react';
import { STATIONS, PARRILLA_SCHEDULE } from '../../data/genres';

interface RadioModuleProps {
  currentStationId: string;
  onSelectStation: (id: string) => void;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  listenersCount: number;
}

export const RadioModule: React.FC<RadioModuleProps> = ({
  currentStationId,
  onSelectStation,
  isPlaying,
  setIsPlaying,
  listenersCount,
}) => {
  const activeStation = STATIONS.find((s) => s.id === currentStationId) || STATIONS[0];
  const currentHour = new Date().getHours();

  return (
    <div className="space-y-6">
      {/* Studio Header Banner with Console Visual */}
      <div className="relative overflow-hidden rounded-xl border border-[#FFD700]/30 bg-zinc-950 p-6 shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/basa_studio_console_1794460217001.jpg"
            alt="BASA Studio Console"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-red-600 text-white animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                TRANSMITIENDO 24/7 EN VIVO
              </span>
              <span className="text-xs font-mono text-[#FFD700] border border-[#FFD700]/40 px-2 py-0.5 rounded">
                Master 320 kbps AAC+
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display tracking-tight">
              Cabina Principal BASA V11 ULTRA
            </h2>

            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Programación ininterrumpida de música dominicana producida y curada por{' '}
              <strong className="text-[#FFD700]">Lic. Pedro Baldera x El Forense</strong> desde Los Frailes,
              Santo Domingo Este. La señal no se corta aunque navegues por los módulos.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded border border-zinc-800">
                <Users className="w-4 h-4 text-[#FFD700]" />
                <span>
                  <strong className="text-white tabular-nums font-mono">{listenersCount}</strong> oyentes sintonizados ahora
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded border border-zinc-800">
                <Disc3 className="w-4 h-4 text-[#FFD700] animate-spin" />
                <span>Sonando: <strong className="text-white">{activeStation.name}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded border border-zinc-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Latencia: 1.1s (Buffer 100% OK)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center bg-black/75 p-5 rounded-xl border border-zinc-800 backdrop-blur-md">
            <div className="text-center mb-3">
              <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono">Control de Cabina</div>
              <div className="text-base font-bold text-[#FFD700] mt-0.5">{activeStation.name}</div>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-[#FFD700] hover:bg-[#FFE566] text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,215,0,0.5)] mb-3"
            >
              {isPlaying ? <Pause className="w-8 h-8 fill-black" /> : <Play className="w-8 h-8 fill-black ml-1" />}
            </button>

            <span className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
              {isPlaying ? 'Emisión Activa' : 'Emisión en Pausa'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Stations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#FFD700]" />
            Estaciones En Vivo (Zeno FM & Relay RD)
          </h3>
          <span className="text-xs text-zinc-400">Selecciona para sintonizar al instante</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATIONS.map((station) => {
            const isSelected = station.id === currentStationId;
            return (
              <div
                key={station.id}
                onClick={() => {
                  onSelectStation(station.id);
                  setIsPlaying(true);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#181818] border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                    : 'bg-[#121212] border-zinc-800 hover:border-zinc-700 hover:bg-[#161616]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {station.genre}
                    </span>
                    {isSelected && isPlaying && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ACTIVO
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white mb-1">{station.name}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-2">{station.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-500">
                    <strong className="text-zinc-300">{station.listeners}</strong> oyentes
                  </span>
                  <button
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                      isSelected && isPlaying
                        ? 'bg-[#FFD700] text-black'
                        : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    {isSelected && isPlaying ? 'Sonando' : 'Sintonizar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: 24/7 Parrilla de Programación & Radio Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Schedule */}
        <div className="lg:col-span-8 bg-[#121212] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FFD700]" />
                Parrilla de Programación 24/7 (Ininterrumpida)
              </h3>
              <p className="text-xs text-zinc-400">Horarios oficiales de emisión desde Los Frailes</p>
            </div>
            <span className="text-xs font-mono text-[#FFD700] bg-[#FFD700]/10 px-2.5 py-1 rounded border border-[#FFD700]/30">
              Hora Los Frailes: {new Date().toLocaleTimeString('es-DO', { hour12: false })}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 border-b border-zinc-800 font-mono uppercase text-[11px]">
                  <th className="py-2.5 px-3">Horario</th>
                  <th className="py-2.5 px-3">Bloque Musical</th>
                  <th className="py-2.5 px-3">Conducción / DJ</th>
                  <th className="py-2.5 px-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium">
                {PARRILLA_SCHEDULE.map((item, idx) => {
                  const isCurrentSlot = idx === 5; // Dembow Navidad + Perico Ripiao Fusión prime slot
                  return (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        isCurrentSlot
                          ? 'bg-[#FFD700]/10 text-white font-semibold'
                          : 'hover:bg-zinc-900/50 text-zinc-300'
                      }`}
                    >
                      <td className="py-3 px-3 font-mono text-zinc-300 whitespace-nowrap">
                        {item.hora}
                      </td>
                      <td className="py-3 px-3 flex items-center gap-2">
                        {isCurrentSlot && (
                          <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-ping" />
                        )}
                        <span>{item.bloque}</span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">{item.dj}</td>
                      <td className="py-3 px-3 text-right font-mono">
                        {isCurrentSlot ? (
                          <span className="text-xs font-bold text-[#FFD700] bg-[#FFD700]/20 px-2 py-0.5 rounded">
                            EN EL AIRE 🔴
                          </span>
                        ) : (
                          <span className="text-zinc-500">{item.estado}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Studio Transmission Specs & Shoutouts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#121212] border border-zinc-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FFD700]" />
              Ficha Técnica de Transmisión
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Servidor Master:</span>
                <span className="text-zinc-200">Zeno Relay Santo Domingo</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Formato / Códec:</span>
                <span className="text-zinc-200">AAC+ 320 kbps Dual Stereo</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Estudio:</span>
                <span className="text-[#FFD700]">Los Frailes, SDE</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Productores Ejecutivos:</span>
                <span className="text-zinc-200">Pedro Baldera & El Forense</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Tiempo al Aire:</span>
                <span className="text-emerald-400">99.98% Ininterrumpido</span>
              </div>
            </div>
          </div>

          <div className="bg-[#121212] border border-zinc-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-xs">📢</span>
              Saludos del Barrio (Cabina Los Frailes)
            </h3>
            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <strong className="text-[#FFD700]">DJ Kiko (La 4ta):</strong> &quot;Manda el saludo a la freidora de Doña Carmen, estamos en sintonía con Baldera y El Forense&quot;
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <strong className="text-[#FFD700]">Tigueraje Rulay:</strong> &quot;Suban el bajo de ese dembow navideño que el carro ya prendió 🔥&quot;
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <strong className="text-[#FFD700]">Lic. Pedro Baldera:</strong> &quot;Seguimos 24/7 en vivo, produciendo sin parar para todo Quisqueya&quot;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
