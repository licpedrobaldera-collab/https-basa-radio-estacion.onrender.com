export interface GenreInfo {
  bpm: string;
  base: string;
  prompt: string;
  key: string;
  description?: string;
}

export interface Track {
  id: string;
  ranking: number;
  titulo: string;
  genero: string;
  protagonista: string;
  lugar: string;
  bpm: string;
  reproducciones: number;
  likes: number;
  estado: string;
  distribuido: boolean;
  fecha: string;
  letra?: string;
  promptSuno?: string;
}

export interface GeneratedTrack {
  numero: number;
  titulo: string;
  bpm: string;
  tonalidad: string;
  base: string;
  letra: string;
  promptSuno: string;
  estructura: string;
  potencial: string;
  genero: string;
  protagonista: string;
  lugar: string;
}

export interface RadioStation {
  id: string;
  name: string;
  genre: string;
  url: string;
  description: string;
  listeners: number;
  featuredTrack: string;
}

export interface MonitorStats {
  timestamp: string;
  formattedTime: string;
  station: string;
  location: string;
  producers: string;
  listenersNow: number;
  listenersDelta: string;
  playsToday: number;
  playsDelta: string;
  newFollowers: number;
  estimatedRevenueUsd: number;
  estimatedRevenueDop: number;
  queueCount: number;
  activeTransmission: string;
  healthStatus: string;
}
