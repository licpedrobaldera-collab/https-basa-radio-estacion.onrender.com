import React, { useState } from 'react';
import { Sparkles, Copy, Check, Download, Disc, Music, Flame, Database, Plus, RefreshCw } from 'lucide-react';
import { GENEROS_RD } from '../../data/genres';
import { GeneratedTrack } from '../../types';

interface GeneratorCrewModuleProps {
  onSaveToCatalog: (track: {
    titulo: string;
    genero: string;
    protagonista: string;
    lugar: string;
    bpm: string;
    reproducciones: number;
    letra: string;
    promptSuno: string;
  }) => void;
}

export const GeneratorCrewModule: React.FC<GeneratorCrewModuleProps> = ({ onSaveToCatalog }) => {
  const [historia, setHistoria] = useState(
    'Se acerca el doble, carro no prende, goma pinchada, vecina rulay, lechón asado, Los Frailes prendío.'
  );
  const [protagonista, setProtagonista] = useState('El Forense');
  const [lugar, setLugar] = useState('Los Frailes, Santo Domingo Este');
  const [generoSel, setGeneroSel] = useState('Dembow Navidad + Perico Ripiao');
  const [cantidad, setCantidad] = useState(3);
  const [modoProd, setModoProd] = useState<'full' | 'letra' | 'prompt'>('full');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<GeneratedTrack[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});

  // 23 genres mass production state
  const [showAll23, setShowAll23] = useState(false);

  const selectedGenreInfo = GENEROS_RD[generoSel] || GENEROS_RD['Dembow Dominicano'];

  const quickPresets = [
    {
      title: 'El Doble & Aguinaldo',
      hist: 'Llegó el doble sueldo, la freidora encendía, lechón en la caja china, doña Carmen en la acera.',
      prot: 'Lic. Pedro Baldera',
      gen: 'Dembow Navidad + Perico Ripiao',
    },
    {
      title: 'Carro no Prende & Rulay',
      hist: 'Carro no prende, goma pinchada, vecina rulay bailando en chancleta, tiguere en la esquina con la bocina a millón.',
      prot: 'El Forense',
      gen: 'Dembow Rulay / Bellaco',
    },
    {
      title: 'Perico de la Vecina',
      hist: 'Fiesta campestre traída a la capital, acordeón de Guananico, el Cibao entero bajó para Los Frailes.',
      prot: 'Crew 4 IA x Baldera',
      gen: 'Perico Ripiao / Merengue Típico',
    },
    {
      title: 'Bachata de Amargue',
      hist: 'Ella se fue con otro pal Cibao, dejó la deuda en el colmado, pero el requinto suena más dulce con un trago amargo.',
      prot: 'El Forense',
      gen: 'Bachata Tradicional',
    },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/crew-ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          historia,
          protagonista,
          lugar,
          genero: generoSel,
          modoProd,
          cantidad,
        }),
      });

      const data = await response.json();
      if (data.success && data.tracks) {
        setGeneratedTracks(data.tracks);
      }
    } catch (err) {
      console.error('Error generating tracks:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveTrack = (track: GeneratedTrack, index: number) => {
    onSaveToCatalog({
      titulo: track.titulo,
      genero: track.genero,
      protagonista: track.protagonista,
      lugar: track.lugar,
      bpm: track.bpm,
      reproducciones: Math.floor(Math.random() * 5000) + 1000,
      letra: track.letra,
      promptSuno: track.promptSuno,
    });
    setSavedKeys((prev) => ({ ...prev, [index]: true }));
  };

  const exportAllToTxt = () => {
    const textContent = generatedTracks
      .map(
        (t) => `========================================
TÍTULO: ${t.titulo}
GÉNERO: ${t.genero} | BPM: ${t.bpm} | TONALIDAD: ${t.tonalidad}
PROTAGONISTA: ${t.protagonista} | LUGAR: ${t.lugar}
========================================

PROMPT SUNO / UDIO:
${t.promptSuno}

LETRA:
${t.letra}
\n\n`
      )
      .join('\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `basa_produccion_${generoSel.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    link.click();
  };

  const export23GenresCsv = () => {
    const headers = ['Género', 'BPM', 'Tonalidad', 'Base Instrumental', 'Prompt Suno/Udio', 'Estado'];
    const rows = Object.entries(GENEROS_RD).map(([name, info]) => [
      `"${name}"`,
      `"${info.bpm}"`,
      `"${info.key}"`,
      `"${info.base.replace(/"/g, '""')}"`,
      `"${info.prompt.replace(/"/g, '""')}, Story: ${historia.replace(/"/g, '""')}"`,
      `"Listo para Producir"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'basa_23_generos_dominicanos_produccion.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Urban Producer Crew Image */}
      <div className="relative overflow-hidden rounded-xl border border-[#FFD700]/30 bg-zinc-950 p-6 shadow-2xl">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <img
            src="/src/assets/images/urban_producer_crew_1794460218771.jpg"
            alt="Crew 4 IA Studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#FFD700] text-black font-mono">
              CREW 4 IA · MOTOR DE PRODUCCIÓN RD
            </span>
            <span className="text-xs font-mono text-zinc-300">
              Lic. Pedro Baldera x El Forense
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            Generador Musical Full 24/7 (23 Géneros Dominicanos)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Escribe tu historia barrial o idea de fiesta. El motor inteligente redactará la letra completa con versos y coros
            pegajosos en jerga 100% dominicana, además del prompt técnico listo para Suno / Udio / DAW profesional.
          </p>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-zinc-400 font-mono">Inspiración rápida:</span>
            {quickPresets.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setHistoria(qp.hist);
                  setProtagonista(qp.prot);
                  setGeneroSel(qp.gen);
                }}
                className="text-xs bg-zinc-900 hover:bg-[#FFD700] hover:text-black text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded transition-colors"
              >
                {qp.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Production Form Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-8 bg-[#121212] border border-zinc-800 rounded-xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            Parámetros del Tema Dominicano
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 font-mono">
              📝 Historia / Párrafo / Idea del Barrio:
            </label>
            <textarea
              value={historia}
              onChange={(e) => setHistoria(e.target.value)}
              rows={3}
              className="w-full bg-[#181818] border border-zinc-700 rounded-lg p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD700]"
              placeholder="Ej: Se acerca el doble, carro no prende, goma pinchada, vecina rulay..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 font-mono">
                👤 Protagonista / Artista:
              </label>
              <input
                type="text"
                value={protagonista}
                onChange={(e) => setProtagonista(e.target.value)}
                className="w-full bg-[#181818] border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700]"
                placeholder="Ej: El Forense / Lic. Pedro Baldera"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 font-mono">
                📍 Lugar / Barrio / Sector:
              </label>
              <input
                type="text"
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                className="w-full bg-[#181818] border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700]"
                placeholder="Ej: Los Frailes, Santo Domingo Este"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 px-6 rounded-lg font-bold text-black bg-[#FFD700] hover:bg-[#FFE566] transition-transform active:scale-98 shadow-[0_0_20px_rgba(255,215,0,0.3)] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>PRODUCIENDO CON CREW 4 IA...</span>
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5 fill-black" />
                  <span>🔥 GENERAR PRODUCCIÓN FULL - ININTERRUMPIDA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Genre Specifier & Batch Selector */}
        <div className="lg:col-span-4 bg-[#121212] border border-zinc-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-[#FFD700]" />
              Configuración de Género RD
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1 font-mono">
                🎼 Género Dominicano ({Object.keys(GENEROS_RD).length} Disponibles):
              </label>
              <select
                value={generoSel}
                onChange={(e) => setGeneroSel(e.target.value)}
                className="w-full bg-[#181818] border border-zinc-700 text-[#FFD700] rounded-lg p-2.5 text-sm font-semibold focus:outline-none focus:border-[#FFD700]"
              >
                {Object.keys(GENEROS_RD).map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre Technical Info Card */}
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-zinc-400">Tempo / BPM:</span>
                <span className="text-[#FFD700] font-bold">{selectedGenreInfo.bpm} BPM</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-zinc-400">Tonalidad:</span>
                <span className="text-emerald-400 font-bold">{selectedGenreInfo.key}</span>
              </div>
              <div className="text-zinc-300">
                <span className="text-zinc-500 font-mono block mb-0.5">Base Instrumental:</span>
                {selectedGenreInfo.base}
              </div>
              {selectedGenreInfo.description && (
                <div className="text-zinc-400 text-[11px] pt-1 border-t border-zinc-800">
                  {selectedGenreInfo.description}
                </div>
              )}
            </div>

            {/* Batch Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 font-mono font-bold">Lote en cadena:</span>
                <span className="text-[#FFD700] font-mono font-bold">{cantidad} temas simultáneos</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value, 10))}
                className="w-full accent-[#FFD700] h-2 bg-zinc-700 rounded cursor-pointer"
              />
            </div>

            {/* Mode selection */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Modo de Salida:</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['full', 'letra', 'prompt'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setModoProd(m)}
                    className={`py-1.5 px-2 rounded text-center font-medium capitalize transition-colors ${
                      modoProd === m ? 'bg-[#FFD700] text-black font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {m === 'full' ? 'Full' : m === 'letra' ? 'Letra' : 'Suno'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <button
              onClick={() => setShowAll23(!showAll23)}
              className="w-full py-2 px-3 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>{showAll23 ? 'Ocultar Matriz 23 Géneros' : 'Ver Matriz 23 Géneros RD'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 23 Genres Mass Matrix Table */}
      {showAll23 && (
        <div className="bg-[#121212] border border-[#FFD700]/30 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Disc className="w-4 h-4 text-[#FFD700]" />
                🌍 Master de Producción: Los 23 Géneros Dominicanos Completos
              </h3>
              <p className="text-xs text-zinc-400">
                Toda la base rítmica de Quisqueya lista para Suno, Udio y producción en estudio
              </p>
            </div>
            <button
              onClick={export23GenresCsv}
              className="px-3 py-1.5 bg-[#FFD700] hover:bg-[#FFE566] text-black rounded text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar CSV 23 Géneros</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 border-b border-zinc-800 font-mono uppercase text-[11px]">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Género RD</th>
                  <th className="py-2 px-3">BPM</th>
                  <th className="py-2 px-3">Tonalidad</th>
                  <th className="py-2 px-3">Base Instrumental</th>
                  <th className="py-2 px-3">Prompt Suno / Udio</th>
                  <th className="py-2 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium">
                {Object.entries(GENEROS_RD).map(([name, info], idx) => (
                  <tr key={name} className="hover:bg-zinc-900/60 text-zinc-300">
                    <td className="py-2.5 px-3 font-mono text-zinc-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 text-white font-bold whitespace-nowrap">{name}</td>
                    <td className="py-2.5 px-3 font-mono text-[#FFD700] whitespace-nowrap">{info.bpm}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400 whitespace-nowrap">{info.key}</td>
                    <td className="py-2.5 px-3 text-zinc-300 text-xs min-w-[200px]">{info.base}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400 text-[11px] truncate max-w-[280px]">
                      {info.prompt}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setGeneroSel(name);
                          setShowAll23(false);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1 text-xs bg-zinc-800 hover:bg-[#FFD700] hover:text-black rounded text-zinc-200 transition-colors"
                      >
                        Cargar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generated Results Showcase */}
      {generatedTracks.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div>
              <h3 className="text-xl font-black text-white font-display flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#FFD700]" />
                Lote de Producción Generado ({generatedTracks.length} Temas)
              </h3>
              <p className="text-xs text-zinc-400">
                Letras con cadencia callejera dominicana y prompts de estudio listos
              </p>
            </div>
            <button
              onClick={exportAllToTxt}
              className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-bold flex items-center gap-1.5 border border-zinc-700"
            >
              <Download className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Exportar Todo (.TXT)</span>
            </button>
          </div>

          <div className="space-y-6">
            {generatedTracks.map((track, idx) => (
              <div
                key={idx}
                className="bg-[#121212] border border-zinc-800 hover:border-[#FFD700]/50 rounded-xl p-5 space-y-4 shadow-xl transition-colors"
              >
                {/* Track header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#FFD700] text-black font-black flex items-center justify-center font-display text-sm">
                      #{track.numero}
                    </span>
                    <div>
                      <h4 className="text-lg font-black text-white tracking-tight">{track.titulo}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono">
                        <span className="text-[#FFD700]">{track.genero}</span>
                        <span>·</span>
                        <span>{track.protagonista}</span>
                        <span>·</span>
                        <span className="text-emerald-400">{track.bpm} BPM</span>
                        <span>·</span>
                        <span className="text-zinc-500">{track.lugar}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveTrack(track, idx)}
                      disabled={savedKeys[idx]}
                      className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        savedKeys[idx]
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#FFD700] hover:bg-[#FFE566] text-black'
                      }`}
                    >
                      {savedKeys[idx] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Guardado en Catálogo</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Guardar en Catálogo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Lyrics & Suno prompt split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Lyrics Box */}
                  <div className="lg:col-span-7 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-300 font-mono uppercase">
                        🎤 Letra Completa RD (Intro, Coro, Mambo):
                      </span>
                      <button
                        onClick={() => copyToClipboard(track.letra, `letra-${idx}`)}
                        className="text-zinc-400 hover:text-[#FFD700] flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === `letra-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copiada</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar Letra</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="w-full bg-[#0D0D0D] border border-zinc-800 rounded-lg p-3.5 text-xs text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                      {track.letra}
                    </pre>
                  </div>

                  {/* Suno Prompt & Metrics Box */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-300 font-mono uppercase">
                          🎛️ Prompt Suno / Udio / DAW:
                        </span>
                        <button
                          onClick={() => copyToClipboard(track.promptSuno, `suno-${idx}`)}
                          className="text-zinc-400 hover:text-[#FFD700] flex items-center gap-1 text-[11px]"
                        >
                          {copiedKey === `suno-${idx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar Prompt</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-[#0D0D0D] border border-zinc-800 rounded-lg p-3 text-xs font-mono text-[#FFD700] select-all leading-relaxed break-words">
                        {track.promptSuno}
                      </div>
                    </div>

                    {/* Stats metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-2 text-center font-mono text-xs">
                      <div className="bg-zinc-900 border border-zinc-800 p-2 rounded">
                        <span className="text-zinc-500 block text-[10px]">TEMPO</span>
                        <strong className="text-white text-xs">{track.bpm}</strong>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 p-2 rounded">
                        <span className="text-zinc-500 block text-[10px]">DURACIÓN</span>
                        <strong className="text-white text-xs">2:50 - 3:20</strong>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 p-2 rounded">
                        <span className="text-zinc-500 block text-[10px]">POTENCIAL</span>
                        <strong className="text-emerald-400 text-xs">{track.potencial}</strong>
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-400 p-2.5 rounded bg-zinc-900/70 border border-zinc-800/80">
                      <strong className="text-zinc-300 block mb-0.5">Arreglo para Estudio:</strong>
                      {track.estructura}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
