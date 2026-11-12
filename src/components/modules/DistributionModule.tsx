import React, { useState } from 'react';
import { Video, Share2, Check, Copy, ExternalLink, CheckCircle2, Globe, Music } from 'lucide-react';

export const DistributionModule: React.FC = () => {
  const [ytId, setYtId] = useState('dQw4w9WgXcQ');
  const [ytTitle, setYtTitle] = useState(
    'SE ACERCA EL DOBLE 🔥 Dembow Navidad + Perico Ripiao | BASA V11 ULTRA | Los Frailes RD'
  );
  const [ytDescription, setYtDescription] = useState(
    `🔥 BASA AUDIO VISUAL V11 ULTRA — EN VIVO
Lic. Pedro Baldera x El Forense • Los Frailes, Santo Domingo Este, República Dominicana 🇩🇴

🎵 Tema: SE ACERCA EL DOBLE (Fusión Dembow Navideño + Perico Ripiao)
🥁 Producción y Mezcla: Crew 4 IA x Lic. Pedro Baldera
📻 Sintoniza nuestra radio 24/7 ininterrumpida desde Los Frailes.

#Dembow #PericoRipiao #NavidadRD #BASA #LosFrailes #DembowDominicano #MerengueTipico #ElForense #Baldera #RDEnVivo`
  );

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [distributionSuccess, setDistributionSuccess] = useState(false);

  // Distribution checklist state
  const [platforms, setPlatforms] = useState<Record<string, boolean>>({
    distrokid: true,
    tunecore: true,
    spotify: true,
    ytMusic: true,
    tiktok: true,
    appleMusic: true,
    audiomack: true,
    deezer: false,
  });

  const platformLabels: Record<string, { label: string; desc: string }> = {
    distrokid: { label: 'DistroKid Master Relay', desc: 'Distribución global con 100% de regalías' },
    tunecore: { label: 'TuneCore Publishing', desc: 'Recaudación de derechos de autor y sincronización' },
    spotify: { label: 'Spotify for Artists', desc: 'Pitching a playlists editoriales (Dembow Mania, Merengue Hoy)' },
    ytMusic: { label: 'YouTube Music & Content ID', desc: 'Monetización automática en videos de terceros' },
    tiktok: { label: 'TikTok & Instagram Audio Library', desc: 'Fragmentos oficiales de 60s para trends virales' },
    appleMusic: { label: 'Apple Music Lossless', desc: 'Audio espacial Dolby Atmos y masterizado para Apple' },
    audiomack: { label: 'Audiomack Caribbean', desc: 'Plataforma líder para música urbana y mixtape de calle' },
    deezer: { label: 'Deezer Latino', desc: 'Presencia en Europa y el Caribe hispano' },
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const togglePlatform = (key: string) => {
    setPlatforms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const markAllDistributed = () => {
    const allTrue: Record<string, boolean> = {};
    Object.keys(platforms).forEach((k) => {
      allTrue[k] = true;
    });
    setPlatforms(allTrue);
    setDistributionSuccess(true);
    setTimeout(() => setDistributionSuccess(false), 3000);
  };

  const completedCount = Object.values(platforms).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / Object.keys(platforms).length) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#FFD700] text-black">
              DISTRIBUCIÓN DIGITAL
            </span>
            <span className="text-xs text-zinc-400 font-mono">DSPs + YouTube Content ID</span>
          </div>
          <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
            <Video className="w-6 h-6 text-[#FFD700]" />
            YouTube + Distribución Full en Plataformas
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Exportación de metadatos SEO, subida a DSPs mundiales y sincronización de Content ID para Los Frailes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right text-xs font-mono">
            <span className="text-zinc-400">Progreso Global: </span>
            <strong className="text-emerald-400 font-bold">{progressPercent}%</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: YouTube Video & SEO Optimizer */}
        <div className="lg:col-span-7 bg-[#121212] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-[#FFD700]" />
            Video en Vivo / Estreno en YouTube
          </h3>

          {/* YouTube Video ID & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-8">
              <label className="block text-xs font-mono text-zinc-400 mb-1">YouTube Video ID:</label>
              <input
                type="text"
                value={ytId}
                onChange={(e) => setYtId(e.target.value.trim())}
                placeholder="Ej: dQw4w9WgXcQ"
                className="w-full bg-[#181818] border border-zinc-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-[#FFD700]"
              />
            </div>
            <div className="sm:col-span-4 flex items-end">
              <a
                href={`https://www.youtube.com/watch?v=${ytId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-[#FFD700] hover:bg-[#FFE566] text-black text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver en YouTube</span>
              </a>
            </div>
          </div>

          {/* Video Preview Embed */}
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-zinc-800 bg-black">
            {ytId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                title="BASA YouTube Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-600 text-xs font-mono">
                Ingresa un Video ID válido
              </div>
            )}
          </div>

          {/* SEO Title & Description */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono font-bold text-zinc-300">
                  TÍTULO YOUTUBE SEO OPTIMIZADO:
                </label>
                <button
                  onClick={() => handleCopy(ytTitle, 'title')}
                  className="text-xs text-zinc-400 hover:text-[#FFD700] flex items-center gap-1"
                >
                  {copiedField === 'title' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>Copiar Título</span>
                </button>
              </div>
              <input
                type="text"
                value={ytTitle}
                onChange={(e) => setYtTitle(e.target.value)}
                className="w-full bg-[#181818] border border-zinc-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono font-bold text-zinc-300">
                  DESCRIPCIÓN + HASHTAGS OFICIALES:
                </label>
                <button
                  onClick={() => handleCopy(ytDescription, 'desc')}
                  className="text-xs text-zinc-400 hover:text-[#FFD700] flex items-center gap-1"
                >
                  {copiedField === 'desc' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>Copiar Descripción</span>
                </button>
              </div>
              <textarea
                rows={5}
                value={ytDescription}
                onChange={(e) => setYtDescription(e.target.value)}
                className="w-full bg-[#181818] border border-zinc-700 rounded-lg p-2.5 text-xs text-zinc-200 font-mono leading-relaxed focus:outline-none focus:border-[#FFD700]"
              />
            </div>
          </div>
        </div>

        {/* Right: Multi-platform Distribution Checklist */}
        <div className="lg:col-span-5 bg-[#121212] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#FFD700]" />
                🚀 Matriz de Distribución Digital
              </h3>
              <span className="text-xs font-mono text-[#FFD700]">
                {completedCount}/{Object.keys(platforms).length} Activas
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#FFD700] h-full transition-all duration-300 shadow-[0_0_8px_#FFD700]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Platform Checkboxes */}
            <div className="space-y-2.5">
              {Object.entries(platforms).map(([key, active]) => {
                const info = platformLabels[key] || { label: key, desc: '' };
                return (
                  <div
                    key={key}
                    onClick={() => togglePlatform(key)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                      active
                        ? 'bg-zinc-900 border-zinc-700'
                        : 'bg-zinc-950/60 border-zinc-900 opacity-60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => togglePlatform(key)}
                      className="mt-1 w-4 h-4 accent-[#FFD700] cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${active ? 'text-white' : 'text-zinc-400'}`}>
                          {info.label}
                        </span>
                        {active && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                            LISTO
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">{info.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <button
              onClick={markAllDistributed}
              className="w-full py-2.5 px-4 bg-[#FFD700] hover:bg-[#FFE566] text-black font-bold text-xs rounded-lg transition-transform active:scale-98 shadow-[0_0_15px_rgba(255,215,0,0.25)] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Marcar Como Distribuido en Todo</span>
            </button>

            {distributionSuccess && (
              <div className="text-center text-xs font-bold text-emerald-400 font-mono animate-in fade-in">
                ✓ ¡Catálogo sincronizado con todas las plataformas digitales!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
