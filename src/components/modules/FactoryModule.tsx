import React, { useState, useEffect, useRef } from 'react';
import { Cog, Play, Pause, RotateCcw, Download, Copy, Check, Flame, Sparkles } from 'lucide-react';
import { GENEROS_RD } from '../../data/genres';

interface FactoryItem {
  id: string;
  batchNum: number;
  genero: string;
  bpm: string;
  tonalidad: string;
  temaBase: string;
  hook: string;
  promptSuno: string;
  timestamp: string;
}

export const FactoryModule: React.FC = () => {
  const [generoAuto, setGeneroAuto] = useState('Dembow Navidad + Perico Ripiao');
  const [temaBase, setTemaBase] = useState('Los Frailes no duerme, diciembre rulay, freidora encendía');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [batchCount, setBatchCount] = useState(0);
  const [producedQueue, setProducedQueue] = useState<FactoryItem[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  const hooksDominicanos = [
    '¡Prendan la freidora, llegó la bendición! El Forense en la acera con este vacilón.',
    'Doble sueldo en el bolsillo, lechón en la caja, el bajo de Los Frailes nunca se rebaja.',
    'Goma pinchá, piquete de un millón, baila la vecina con el corazón.',
    'Acordeón picante, tambora sin frenar, en Quisqueya la fiesta nunca va a acabar.',
    'Baldera en los controles, la pampara prendía, de noche o de mañana la calle ta encendía.',
  ];

  const produceOne = () => {
    const genreInfo = GENEROS_RD[generoAuto] || GENEROS_RD['Dembow Dominicano'];
    const currentNum = batchCount + 1;
    const randomHook = hooksDominicanos[Math.floor(Math.random() * hooksDominicanos.length)];

    const newItem: FactoryItem = {
      id: `factory-${Date.now()}`,
      batchNum: currentNum,
      genero: generoAuto,
      bpm: genreInfo.bpm,
      tonalidad: genreInfo.key,
      temaBase,
      hook: randomHook,
      promptSuno: `${genreInfo.prompt}, Tema: ${temaBase}, Lote #${currentNum}, Hook pegajoso: "${randomHook}", ${genreInfo.bpm} BPM, studio radio master`,
      timestamp: new Date().toLocaleTimeString('es-DO', { hour12: false }),
    };

    setProducedQueue((prev) => [newItem, ...prev.slice(0, 49)]); // Keep last 50
    setBatchCount(currentNum);
  };

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          produceOne();
          return 0;
        }
        return prev + 25;
      });
    }, 500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, batchCount, generoAuto, temaBase]);

  const toggleFactory = () => {
    setIsRunning(!isRunning);
  };

  const copyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const exportBatchTxt = () => {
    const content = producedQueue
      .map(
        (item) => `[LOTE #${item.batchNum} - ${item.genero} - ${item.timestamp}]
TEMPO: ${item.bpm} | TONALIDAD: ${item.tonalidad}
HOOK: ${item.hook}
PROMPT SUNO/UDIO:
${item.promptSuno}
\n----------------------------------------------------\n`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `basa_fabrica_produccion_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-[#FFD700]/30 rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#FFD700] text-black">
              MODO FÁBRICA CONTINUA
            </span>
            <span className="text-xs text-zinc-400 font-mono">Lic. Pedro Baldera x El Forense</span>
          </div>
          <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
            <Cog className="w-6 h-6 text-[#FFD700] animate-spin" />
            Producción Ininterrumpida 24/7 · Modo Fábrica
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Cadena de montaje musical automática. Genera prompts y conceptos rítmicos en loop continuo sin detener la emisión.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleFactory}
            className={`px-5 py-2.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'
                : 'bg-[#FFD700] hover:bg-[#FFE566] text-black shadow-[#FFD700]/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>PAUSAR FÁBRICA</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black ml-0.5" />
                <span>INICIAR FÁBRICA ININTERRUMPIDA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#121212] border border-zinc-800 rounded-xl p-5 shadow-xl">
        <div className="md:col-span-5 space-y-1.5">
          <label className="block text-xs font-mono font-bold text-zinc-300">
            GÉNERO EN LOOP CONTINUO:
          </label>
          <select
            value={generoAuto}
            onChange={(e) => setGeneroAuto(e.target.value)}
            className="w-full bg-[#181818] border border-zinc-700 text-[#FFD700] rounded-lg p-2.5 text-xs font-bold focus:outline-none focus:border-[#FFD700]"
          >
            {Object.keys(GENEROS_RD).map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-7 space-y-1.5">
          <label className="block text-xs font-mono font-bold text-zinc-300">
            TEMA / FRASE BASE DE PRODUCCIÓN:
          </label>
          <input
            type="text"
            value={temaBase}
            onChange={(e) => setTemaBase(e.target.value)}
            className="w-full bg-[#181818] border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FFD700]"
            placeholder="Ej: Los Frailes no duerme, diciembre rulay"
          />
        </div>

        {/* Progress & Live Counter */}
        <div className="md:col-span-12 pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">
              Estado: <strong className={isRunning ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                {isRunning ? '● Produciendo en cadena 24/7' : 'En pausa'}
              </strong>
            </span>
            <span className="text-[#FFD700] font-bold">
              {batchCount} Temas Generados en este Turno
            </span>
          </div>

          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#FFD700] h-full transition-all duration-200 shadow-[0_0_10px_#FFD700]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Production Output Log */}
      <div className="bg-[#121212] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FFD700]" />
              Cola de Producción Activa ({producedQueue.length} Temas Listos)
            </h3>
            <p className="text-xs text-zinc-400">
              Cada tema sale con BPM sincronizado, gancho caribeño y prompt de audio optimizado
            </p>
          </div>

          {producedQueue.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={exportBatchTxt}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-bold border border-zinc-700 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>Exportar Lote (.TXT)</span>
              </button>
              <button
                onClick={() => setProducedQueue([])}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded text-xs border border-zinc-800"
              >
                Limpiar
              </button>
            </div>
          )}
        </div>

        {producedQueue.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs font-mono space-y-2">
            <div>Presiona &quot;INICIAR FÁBRICA ININTERRUMPIDA&quot; para arrancar el ciclo de producción.</div>
            <div className="text-zinc-600">El sistema irá depositando cada tema en esta cola en tiempo real.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {producedQueue.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-[#181818] border border-zinc-800 hover:border-zinc-700 rounded-lg space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FFD700] text-black font-black flex items-center justify-center font-mono text-[10px]">
                      #{item.batchNum}
                    </span>
                    <strong className="text-white text-sm">{item.genero}</strong>
                    <span className="text-zinc-500">·</span>
                    <span className="text-[#FFD700] font-mono">{item.bpm} BPM</span>
                    <span className="text-zinc-500">·</span>
                    <span className="text-emerald-400 font-mono">{item.tonalidad}</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[11px]">{item.timestamp}</span>
                </div>

                <div className="text-zinc-300 font-medium">
                  <span className="text-zinc-500 font-mono text-[11px] mr-1">Coro / Hook:</span>
                  &ldquo;{item.hook}&rdquo;
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <code className="text-[11px] font-mono text-zinc-400 truncate max-w-[80%] bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                    {item.promptSuno}
                  </code>
                  <button
                    onClick={() => copyPrompt(item.promptSuno, item.id)}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-[#FFD700] hover:text-black text-zinc-300 rounded text-[11px] font-bold flex items-center gap-1 transition-colors shrink-0"
                  >
                    {copiedKey === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
