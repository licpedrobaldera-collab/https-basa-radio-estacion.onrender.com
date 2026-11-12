import React, { useState, useEffect, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { GlobalPlayer } from './components/GlobalPlayer';
import { RadioModule } from './components/modules/RadioModule';
import { GeneratorCrewModule } from './components/modules/GeneratorCrewModule';
import { RhythmBoxModule } from './components/modules/RhythmBoxModule';
import { CatalogModule } from './components/modules/CatalogModule';
import { MonitorModule } from './components/modules/MonitorModule';
import { DistributionModule } from './components/modules/DistributionModule';
import { FactoryModule } from './components/modules/FactoryModule';
import { Track, MonitorStats } from './types';
import { STATIONS } from './data/genres';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('radio');
  const [currentStationId, setCurrentStationId] = useState<string>('dembow');
  const [isPlayingRadio, setIsPlayingRadio] = useState<boolean>(false);

  // Soft Auto-refresh (45s) preserving audio playback
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(45);
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString('es-DO', { hour12: false })
  );

  // Station & telemetry statistics
  const [stats, setStats] = useState<MonitorStats>({
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString('es-DO', { hour12: false }),
    station: 'BASA AUDIO VISUAL V11 ULTRA',
    location: 'Los Frailes, Santo Domingo Este, RD 🇩🇴',
    producers: 'Lic. Pedro Baldera x El Forense',
    listenersNow: 485,
    listenersDelta: '+18% vs hora previa',
    playsToday: 18450,
    playsDelta: '+24% tendencia alta',
    newFollowers: 94,
    estimatedRevenueUsd: 148.5,
    estimatedRevenueDop: 148.5 * 60.5,
    queueCount: 6,
    activeTransmission: '24/7 EN VIVO ININTERRUMPIDO',
    healthStatus: '100% OPERACIONAL - TASA DE BIT: 320 KBPS AAC+',
  });

  // Master Catalog with user's core tracks
  const [catalog, setCatalog] = useState<Track[]>([
    {
      id: 'track-1',
      ranking: 1,
      titulo: 'SE ACERCA EL DOBLE',
      genero: 'Dembow Navidad + Perico Ripiao',
      protagonista: 'Lic. Pedro Baldera x El Forense',
      lugar: 'Los Frailes, Santo Domingo Este',
      bpm: '132 BPM',
      reproducciones: 128400,
      likes: 15900,
      estado: 'ÉXITO 🔥 #1',
      distribuido: true,
      fecha: '2026-11-01',
    },
    {
      id: 'track-2',
      ranking: 2,
      titulo: 'DICIEMBRE RULAY',
      genero: 'Dembow Rulay / Bellaco',
      protagonista: 'El Forense',
      lugar: 'Los Frailes',
      bpm: '136 BPM',
      reproducciones: 24500,
      likes: 4100,
      estado: 'ÉXITO 🔥',
      distribuido: true,
      fecha: '2026-11-04',
    },
    {
      id: 'track-3',
      ranking: 3,
      titulo: 'CÓGELO AHÍ',
      genero: 'Dembow Dominicano',
      protagonista: 'Lic. Pedro Baldera',
      lugar: 'Los Frailes',
      bpm: '128 BPM',
      reproducciones: 11200,
      likes: 2200,
      estado: 'ÉXITO 🔥',
      distribuido: true,
      fecha: '2026-11-06',
    },
    {
      id: 'track-4',
      ranking: 4,
      titulo: 'BACHATA AMARGUE EN LA VECINA',
      genero: 'Bachata Tradicional',
      protagonista: 'El Forense',
      lugar: 'Santo Domingo Este',
      bpm: '126 BPM',
      reproducciones: 8900,
      likes: 1800,
      estado: 'Subiendo 📈',
      distribuido: false,
      fecha: '2026-11-08',
    },
    {
      id: 'track-5',
      ranking: 5,
      titulo: 'PERICO DE LOS FRAILES',
      genero: 'Perico Ripiao / Merengue Típico',
      protagonista: 'Crew 4 IA x Baldera',
      lugar: 'Los Frailes',
      bpm: '148 BPM',
      reproducciones: 6700,
      likes: 1400,
      estado: 'Subiendo 📈',
      distribuido: true,
      fecha: '2026-11-10',
    },
  ]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Clock tick
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('es-DO', { hour12: false }));
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Fetch or simulate live server telemetry
  const refreshTelemetry = useCallback(async () => {
    try {
      const res = await fetch('/api/monitor');
      if (res.ok) {
        const data = await res.json();
        setStats((prev) => ({
          ...prev,
          listenersNow: data.listenersNow || prev.listenersNow,
          playsToday: data.playsToday || prev.playsToday,
          newFollowers: data.newFollowers || prev.newFollowers,
          estimatedRevenueUsd: data.estimatedRevenueUsd || prev.estimatedRevenueUsd,
          estimatedRevenueDop: data.estimatedRevenueDop || prev.estimatedRevenueDop,
        }));
      }
    } catch {
      // Soft client-side jitter if offline
      setStats((prev) => {
        const jitter = Math.floor(Math.random() * 20 - 10);
        const newListeners = Math.max(200, prev.listenersNow + jitter);
        return {
          ...prev,
          listenersNow: newListeners,
          playsToday: prev.playsToday + Math.floor(Math.random() * 15 + 5),
          estimatedRevenueUsd: prev.estimatedRevenueUsd + 0.45,
          estimatedRevenueDop: (prev.estimatedRevenueUsd + 0.45) * 60.5,
        };
      });
    }
  }, []);

  // 45s soft timer cycle (keeps radio playing uninterrupted!)
  useEffect(() => {
    if (!autoRefresh) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refreshTelemetry();
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefresh, refreshTelemetry]);

  // Load server catalog on mount
  useEffect(() => {
    fetch('/api/catalog')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.catalog) && data.catalog.length > 0) {
          setCatalog(data.catalog);
        }
      })
      .catch((err) => console.log('Using local catalog seed:', err));
  }, []);

  const handleManualRefresh = () => {
    refreshTelemetry();
    setCountdown(45);
    showToast('✓ Métricas de cabina actualizadas en tiempo real');
  };

  const handleAddTrack = (newTrackData: {
    titulo: string;
    genero: string;
    protagonista: string;
    lugar: string;
    bpm: string;
    reproducciones: number;
    letra?: string;
    promptSuno?: string;
  }) => {
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      ranking: catalog.length + 1,
      titulo: newTrackData.titulo,
      genero: newTrackData.genero,
      protagonista: newTrackData.protagonista,
      lugar: newTrackData.lugar,
      bpm: newTrackData.bpm,
      reproducciones: newTrackData.reproducciones,
      likes: Math.floor(Math.random() * 500) + 100,
      estado: 'Nuevo 🆕',
      distribuido: false,
      fecha: new Date().toISOString().split('T')[0],
      letra: newTrackData.letra,
      promptSuno: newTrackData.promptSuno,
    };

    setCatalog((prev) => [newTrack, ...prev]);
    showToast(`✓ "${newTrack.titulo}" guardado en el Catálogo BASA`);

    // Persist to server
    fetch('/api/catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrackData),
    }).catch((e) => console.warn('Server persist note:', e));
  };

  const handleLikeTrack = (id: string) => {
    setCatalog((prev) =>
      prev.map((t) => (t.id === id ? { ...t, likes: t.likes + 1 } : t))
    );
    fetch(`/api/catalog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ like: true }),
    }).catch(() => {});
  };

  const handleToggleDistribute = (id: string) => {
    setCatalog((prev) =>
      prev.map((t) => (t.id === id ? { ...t, distribuido: !t.distribuido } : t))
    );
    showToast('✓ Estado de distribución actualizado');
  };

  const activeStation = STATIONS.find((s) => s.id === currentStationId) || STATIONS[0];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex flex-col font-body pb-24">
      {/* Top Bar with 3-Zone Contract */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        countdown={countdown}
        onManualRefresh={handleManualRefresh}
        currentTime={currentTime}
        isPlayingRadio={isPlayingRadio}
        stationName={activeStation.name}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'radio' && (
          <RadioModule
            currentStationId={currentStationId}
            onSelectStation={setCurrentStationId}
            isPlaying={isPlayingRadio}
            setIsPlaying={setIsPlayingRadio}
            listenersCount={stats.listenersNow}
          />
        )}

        {activeTab === 'generator' && (
          <GeneratorCrewModule onSaveToCatalog={handleAddTrack} />
        )}

        {activeTab === 'ritmo' && <RhythmBoxModule />}

        {activeTab === 'catalog' && (
          <CatalogModule
            catalog={catalog}
            onAddTrack={handleAddTrack}
            onLikeTrack={handleLikeTrack}
            onToggleDistribute={handleToggleDistribute}
          />
        )}

        {activeTab === 'monitor' && (
          <MonitorModule
            stats={stats}
            autoRefresh={autoRefresh}
            setAutoRefresh={setAutoRefresh}
            countdown={countdown}
            onRefreshNow={handleManualRefresh}
          />
        )}

        {activeTab === 'youtube' && <DistributionModule />}

        {activeTab === 'factory' && <FactoryModule />}
      </main>

      {/* Persistent 24/7 Global Audio Player (Radio & Audio Engine never cut on tab switch) */}
      <GlobalPlayer
        currentStationId={currentStationId}
        onSelectStation={setCurrentStationId}
        isPlaying={isPlayingRadio}
        setIsPlaying={setIsPlayingRadio}
      />

      {/* Global Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#161616] text-[#FFD700] border border-[#FFD700]/50 px-4 py-2 rounded-lg shadow-2xl font-mono text-xs animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Footer Notice */}
      <footer className="border-t border-zinc-900 bg-[#080808] py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            BASA AUDIO VISUAL V11 ULTRA · <strong className="text-zinc-400">Lic. Pedro Baldera x El Forense</strong>
          </span>
          <span>Los Frailes, Santo Domingo Este, RD 🇩🇴 · Producción Ininterrumpida 24/7</span>
        </div>
      </footer>
    </div>
  );
}
