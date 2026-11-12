import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, ChevronUp, ChevronDown, Music2, ExternalLink } from 'lucide-react';
import { STATIONS } from '../data/genres';

interface GlobalPlayerProps {
  currentStationId: string;
  onSelectStation: (id: string) => void;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
}

export const GlobalPlayer: React.FC<GlobalPlayerProps> = ({
  currentStationId,
  onSelectStation,
  isPlaying,
  setIsPlaying,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [streamStatus, setStreamStatus] = useState<string>('En Espera');
  const [hasError, setHasError] = useState<boolean>(false);

  const activeStation = STATIONS.find((s) => s.id === currentStationId) || STATIONS[0];

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    if (!audioRef.current) return;
    setHasError(false);
    if (isPlaying) {
      setStreamStatus('Conectando señal...');
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setStreamStatus('● EN VIVO (320 kbps)');
          })
          .catch((err) => {
            console.warn('Audio stream autoplay blocked or error:', err);
            setStreamStatus('Pausa (Presiona Play)');
            setIsPlaying(false);
          });
      }
    } else {
      audioRef.current.pause();
      setStreamStatus('En Pausa');
    }
  }, [currentStationId, isPlaying, setIsPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleAudioError = () => {
    setHasError(true);
    setStreamStatus('Señal alternativa activa');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E0E0E]/95 border-t border-[#FFD700]/30 backdrop-blur-lg shadow-[0_-5px_25px_rgba(0,0,0,0.8)]">
      <audio
        ref={audioRef}
        src={activeStation.url}
        preload="none"
        onError={handleAudioError}
        onPlaying={() => setStreamStatus('● EN VIVO (320 kbps)')}
        onWaiting={() => setStreamStatus('Buffering...')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Station info + animated VU bars */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#FFD700] hover:bg-[#FFE566] text-black flex items-center justify-center transition-transform active:scale-90 shadow-[0_0_15px_rgba(255,215,0,0.4)] shrink-0"
            title={isPlaying ? 'Pausar Radio' : 'Reproducir Radio 24/7'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white truncate max-w-[150px] sm:max-w-[220px]">
                {activeStation.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded hidden sm:inline">
                {activeStation.genre}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className={`font-mono ${isPlaying ? 'text-emerald-400 font-bold' : 'text-zinc-500'}`}>
                {streamStatus}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="truncate max-w-[140px] sm:max-w-[240px] text-zinc-300">
                {activeStation.featuredTrack}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live dancing VU Equalizer Visualizer */}
        <div className="hidden lg:flex items-center gap-1 h-6 px-3 bg-black/60 rounded border border-zinc-800">
          <span className="text-[10px] font-mono text-zinc-500 mr-1.5 uppercase">Master VU</span>
          {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((height, i) => (
            <div
              key={i}
              className={`w-1 rounded-sm transition-all duration-150 ${
                isPlaying ? 'bg-[#FFD700]' : 'bg-zinc-700'
              }`}
              style={{
                height: isPlaying ? `${Math.max(15, (height * (volume || 0.5)) + (i % 3) * 6)}%` : '20%',
                opacity: isPlaying ? 0.9 : 0.4,
              }}
            />
          ))}
        </div>

        {/* Right: Station Switcher + Volume Control */}
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={currentStationId}
            onChange={(e) => {
              onSelectStation(e.target.value);
              setIsPlaying(true);
            }}
            className="text-xs bg-[#181818] border border-zinc-700 text-[#FFD700] rounded px-2.5 py-1.5 font-medium focus:outline-none focus:border-[#FFD700] cursor-pointer"
          >
            {STATIONS.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
          </select>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-zinc-400 hover:text-[#FFD700] transition-colors"
              title={isMuted ? 'Desmutear' : 'Mutear'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 lg:w-20 accent-[#FFD700] h-1.5 bg-zinc-700 rounded cursor-pointer"
              title={`Volumen: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
            />
          </div>

          <a
            href={activeStation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex text-[11px] font-mono text-zinc-400 hover:text-[#FFD700] items-center gap-1 border border-zinc-800 px-2 py-1 rounded bg-zinc-900"
            title="Abrir transmisión directa de audio"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Stream</span>
          </a>
        </div>
      </div>
    </div>
  );
};
