import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Sliders, Music } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

export const RhythmBoxModule: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(128);
  const [activePreset, setActivePreset] = useState<'dembow' | 'ripiao' | 'mambo' | 'bachata'>('dembow');
  const [patternState, setPatternState] = useState(audioEngine.pattern);

  useEffect(() => {
    return () => {
      audioEngine.stopSequencer();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.stopSequencer();
      setIsPlaying(false);
      setCurrentStep(0);
    } else {
      audioEngine.startSequencer(bpm, (step) => {
        setCurrentStep(step);
      });
      setIsPlaying(true);
    }
  };

  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    audioEngine.setBpm(newBpm);
    if (isPlaying) {
      audioEngine.stopSequencer();
      audioEngine.startSequencer(newBpm, (step) => setCurrentStep(step));
    }
  };

  const handlePresetChange = (preset: 'dembow' | 'ripiao' | 'mambo' | 'bachata') => {
    setActivePreset(preset);
    audioEngine.setPreset(preset);
    const presetBpms = { dembow: 128, ripiao: 148, mambo: 138, bachata: 126 };
    const pBpm = presetBpms[preset];
    setBpm(pBpm);
    setPatternState({ ...audioEngine.pattern });

    if (isPlaying) {
      audioEngine.stopSequencer();
      audioEngine.startSequencer(pBpm, (step) => setCurrentStep(step));
    }
  };

  const toggleStep = (track: 'kick808' | 'guira' | 'tambora' | 'snare', stepIndex: number) => {
    const updated = { ...patternState };
    updated[track][stepIndex] = updated[track][stepIndex] ? 0 : 1;
    audioEngine.pattern = updated;
    setPatternState({ ...updated });
  };

  const instruments = [
    {
      id: 'kick808' as const,
      name: '808 Sub-Bass',
      sub: 'Bajo Dembow',
      color: 'bg-amber-500',
      activeColor: 'bg-[#FFD700] text-black shadow-[0_0_8px_#FFD700]',
      playSample: () => audioEngine.playKick(),
    },
    {
      id: 'guira' as const,
      name: 'Güira Dominicana',
      sub: 'Chiki-chiki metal',
      color: 'bg-emerald-500',
      activeColor: 'bg-emerald-400 text-black shadow-[0_0_8px_#34d399]',
      playSample: () => audioEngine.playGuira(undefined, true),
    },
    {
      id: 'tambora' as const,
      name: 'Tambora Quisqueyana',
      sub: 'Repique de palo',
      color: 'bg-blue-500',
      activeColor: 'bg-blue-400 text-black shadow-[0_0_8px_#60a5fa]',
      playSample: () => audioEngine.playTambora(undefined, true),
    },
    {
      id: 'snare' as const,
      name: 'Snare / Palito',
      sub: 'Rimshot corte',
      color: 'bg-purple-500',
      activeColor: 'bg-purple-400 text-black shadow-[0_0_8px_#c084fc]',
      playSample: () => audioEngine.playSnare(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] border border-[#FFD700]/30 rounded-xl p-5 sm:p-6 space-y-4 shadow-xl">
        {/* Header & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold bg-[#FFD700] text-black px-2 py-0.5 rounded">
                WEB AUDIO SYNTHESIZER
              </span>
              <span className="text-xs font-mono text-zinc-400">Motor de Ritmo Quisqueyano</span>
            </div>
            <h3 className="text-2xl font-black text-white font-display flex items-center gap-2">
              <Sliders className="w-6 h-6 text-[#FFD700]" />
              Caja de Ritmo RD · Dembow & Perico Ripiao
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Sintetizador Web Audio interactivo con samples procedurales de güira, tambora, snare y 808 dominicano.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'
                  : 'bg-[#FFD700] hover:bg-[#FFE566] text-black shadow-[#FFD700]/30'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Detener Ritmo</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                  <span>Reproducir Ritmo RD</span>
                </>
              )}
            </button>

            {/* BPM control */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
              <span className="text-xs font-mono text-zinc-400">BPM:</span>
              <span className="text-sm font-mono font-black text-[#FFD700] tabular-nums w-8">
                {bpm}
              </span>
              <input
                type="range"
                min="90"
                max="165"
                value={bpm}
                onChange={(e) => handleBpmChange(parseInt(e.target.value, 10))}
                className="w-24 accent-[#FFD700] h-1.5 bg-zinc-700 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Presets Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-mono text-zinc-400 mr-1">Patrón de Ritmo:</span>
          {(['dembow', 'ripiao', 'mambo', 'bachata'] as const).map((pr) => (
            <button
              key={pr}
              onClick={() => handlePresetChange(pr)}
              className={`px-3 py-1 rounded text-xs font-bold capitalize transition-colors ${
                activePreset === pr
                  ? 'bg-[#FFD700] text-black'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {pr === 'dembow'
                ? '🔥 Dembow RD (128 BPM)'
                : pr === 'ripiao'
                ? '🪗 Perico Ripiao (148 BPM)'
                : pr === 'mambo'
                ? '🎺 Mambo de Calle (138 BPM)'
                : '🎸 Bachata Bongó (126 BPM)'}
            </button>
          ))}
        </div>

        {/* 16-Step Sequencer Grid */}
        <div className="space-y-3 pt-3 overflow-x-auto">
          {/* Step header markers */}
          <div className="grid grid-cols-[160px_repeat(16,minmax(28px,1fr))] gap-1.5 min-w-[620px] text-center font-mono text-[10px] text-zinc-500">
            <div className="text-left pl-2">Instrumento</div>
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`py-1 rounded font-bold ${
                  currentStep === i && isPlaying
                    ? 'text-[#FFD700] bg-[#FFD700]/20'
                    : i % 4 === 0
                    ? 'text-zinc-300 bg-zinc-900/60'
                    : 'text-zinc-600'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Instrument rows */}
          {instruments.map((inst) => (
            <div
              key={inst.id}
              className="grid grid-cols-[160px_repeat(16,minmax(28px,1fr))] gap-1.5 min-w-[620px] items-center"
            >
              {/* Drum Pad Trigger */}
              <button
                onClick={inst.playSample}
                className="flex flex-col text-left px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all active:scale-95 group"
                title="Tocar sonido de prueba"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-[#FFD700] truncate">
                    {inst.name}
                  </span>
                  <Volume2 className="w-3 h-3 text-zinc-500 group-hover:text-[#FFD700]" />
                </div>
                <span className="text-[10px] text-zinc-500 font-mono truncate">{inst.sub}</span>
              </button>

              {/* 16 Step Buttons */}
              {patternState[inst.id].map((active, stepIdx) => {
                const isCurrent = currentStep === stepIdx && isPlaying;
                const isDownbeat = stepIdx % 4 === 0;

                return (
                  <button
                    key={stepIdx}
                    onClick={() => toggleStep(inst.id, stepIdx)}
                    className={`h-9 rounded transition-all flex items-center justify-center font-mono text-[10px] ${
                      active
                        ? inst.activeColor
                        : isDownbeat
                        ? 'bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700'
                        : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800'
                    } ${isCurrent ? 'ring-2 ring-white scale-105' : ''}`}
                    title={`Paso ${stepIdx + 1} - ${active ? 'Activo' : 'Inactivo'}`}
                  >
                    {active ? '●' : ''}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
            <span>Haz clic en cualquier celda para activar/desactivar golpes o presiona el pad para probar el sonido.</span>
          </div>
          <span className="font-mono text-zinc-500">
            Sintetizador 100% en vivo · Sin dependencias externas
          </span>
        </div>
      </div>
    </div>
  );
};
