import React, { useState } from 'react';
import { FolderArchive, Trophy, Heart, Download, Plus, Search, Filter, Play, CheckCircle2, Music2 } from 'lucide-react';
import { Track } from '../../types';
import { GENEROS_RD } from '../../data/genres';
import { audioEngine } from '../../utils/audioEngine';

interface CatalogModuleProps {
  catalog: Track[];
  onAddTrack: (track: {
    titulo: string;
    genero: string;
    protagonista: string;
    lugar: string;
    bpm: string;
    reproducciones: number;
  }) => void;
  onLikeTrack: (id: string) => void;
  onToggleDistribute: (id: string) => void;
}

export const CatalogModule: React.FC<CatalogModuleProps> = ({
  catalog,
  onAddTrack,
  onLikeTrack,
  onToggleDistribute,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState('Dembow Dominicano');
  const [protagonista, setProtagonista] = useState('Lic. Pedro Baldera x El Forense');
  const [lugar, setLugar] = useState('Los Frailes, RD');
  const [reproducciones, setReproducciones] = useState(15000);
  const [formSuccess, setFormSuccess] = useState(false);

  const filteredCatalog = catalog
    .filter((track) => {
      const matchesSearch =
        track.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.protagonista.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.genero.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = genreFilter === 'all' || track.genero === genreFilter;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => b.reproducciones - a.reproducciones);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    const genreInfo = GENEROS_RD[genero] || { bpm: '128 BPM' };

    onAddTrack({
      titulo: titulo.trim().toUpperCase(),
      genero,
      protagonista: protagonista.trim(),
      lugar: lugar.trim(),
      bpm: genreInfo.bpm,
      reproducciones: Number(reproducciones) || 0,
    });

    setTitulo('');
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowAddForm(false);
    }, 1500);
  };

  const exportCsv = () => {
    const headers = ['Ranking', 'Titulo', 'Genero', 'Protagonista', 'Lugar', 'BPM', 'Reproducciones', 'Likes', 'Estado', 'Distribuido', 'Fecha'];
    const rows = catalog.map((t, index) => [
      index + 1,
      `"${t.titulo}"`,
      `"${t.genero}"`,
      `"${t.protagonista}"`,
      `"${t.lugar}"`,
      `"${t.bpm}"`,
      t.reproducciones,
      t.likes,
      `"${t.estado}"`,
      t.distribuido ? 'Sí' : 'No',
      `"${t.fecha}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'catalogo_basa.csv';
    link.click();
  };

  const playBeatPreview = () => {
    audioEngine.playKick();
    setTimeout(() => audioEngine.playGuira(undefined, true), 100);
    setTimeout(() => audioEngine.playTambora(undefined, true), 200);
    setTimeout(() => audioEngine.playSnare(), 300);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="bg-[#121212] border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#FFD700] text-black">
              CATÁLOGO MASTER
            </span>
            <span className="text-xs text-zinc-400 font-mono">Los Frailes, Santo Domingo Este</span>
          </div>
          <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#FFD700]" />
            Catálogo BASA + 🏆 Ranking En Vivo
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Métricas de streaming en tiempo real, reproducciones en plataformas y ranking oficial de éxitos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 bg-[#FFD700] hover:bg-[#FFE566] text-black rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,215,0,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Tema al Catálogo</span>
          </button>

          <button
            onClick={exportCsv}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Exportar archivo CSV con todo el catálogo"
          >
            <Download className="w-4 h-4 text-[#FFD700]" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Add New Track Inline Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#181818] border border-[#FFD700]/40 rounded-xl p-5 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#FFD700]" />
              ➕ Registrar Nuevo Lanzamiento en el Catálogo
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
                TÍTULO DE LA CANCIÓN:
              </label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: LA FREIDORA DE DICIEMBRE"
                className="w-full bg-[#101010] border border-zinc-700 rounded p-2 text-xs text-white uppercase focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
                GÉNERO DOMINICANO:
              </label>
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                className="w-full bg-[#101010] border border-zinc-700 rounded p-2 text-xs text-[#FFD700] focus:outline-none focus:border-[#FFD700]"
              >
                {Object.keys(GENEROS_RD).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
                ARTISTA / PROTAGONISTA:
              </label>
              <input
                type="text"
                value={protagonista}
                onChange={(e) => setProtagonista(e.target.value)}
                placeholder="Ej: Lic. Pedro Baldera"
                className="w-full bg-[#101010] border border-zinc-700 rounded p-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 mb-1">
                REPRODUCCIONES INICIALES:
              </label>
              <input
                type="number"
                min="0"
                max="10000000"
                value={reproducciones}
                onChange={(e) => setReproducciones(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#101010] border border-zinc-700 rounded p-2 text-xs text-white font-mono focus:outline-none focus:border-[#FFD700]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {formSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                ¡Tema guardado exitosamente en el catálogo!
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="px-4 py-2 bg-[#FFD700] hover:bg-[#FFE566] text-black font-bold text-xs rounded transition-colors"
              >
                Guardar en Catálogo BASA
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121212] border border-zinc-800 p-3 rounded-xl">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, artista o género..."
            className="w-full bg-[#181818] border border-zinc-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD700]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="bg-[#181818] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-[#FFD700]"
          >
            <option value="all">Todos los Géneros ({catalog.length})</option>
            {Array.from(new Set(catalog.map((t) => t.genero))).map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-zinc-400 border-b border-zinc-800 bg-zinc-900/60 font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Título del Track</th>
                <th className="py-3 px-4">Género Dominicano</th>
                <th className="py-3 px-4">Artista</th>
                <th className="py-3 px-4 text-right">Reproducciones</th>
                <th className="py-3 px-4 text-center">Likes</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {filteredCatalog.map((track, index) => {
                const rankNum = index + 1;
                const isTop1 = rankNum === 1;

                return (
                  <tr
                    key={track.id}
                    className={`transition-colors hover:bg-zinc-900/60 ${
                      isTop1 ? 'bg-[#FFD700]/5 font-semibold' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 font-mono">
                      {isTop1 ? (
                        <span className="w-6 h-6 rounded-full bg-[#FFD700] text-black font-black inline-flex items-center justify-center text-xs shadow-[0_0_8px_#FFD700]">
                          1
                        </span>
                      ) : rankNum <= 3 ? (
                        <span className="w-6 h-6 rounded-full bg-zinc-800 text-[#FFD700] font-bold inline-flex items-center justify-center text-xs border border-zinc-700">
                          {rankNum}
                        </span>
                      ) : (
                        <span className="text-zinc-500 pl-2">{rankNum}</span>
                      )}
                    </td>

                    {/* Titulo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={playBeatPreview}
                          className="w-6 h-6 rounded bg-zinc-800 hover:bg-[#FFD700] hover:text-black text-zinc-300 flex items-center justify-center transition-colors shrink-0"
                          title="Reproducir golpe de beat de prueba"
                        >
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </button>
                        <span className="font-bold text-white tracking-wide">{track.titulo}</span>
                      </div>
                    </td>

                    {/* Genero */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-zinc-300 text-[11px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        {track.genero}
                      </span>
                    </td>

                    {/* Protagonista */}
                    <td className="py-3 px-4 text-zinc-300">{track.protagonista}</td>

                    {/* Reproducciones */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-zinc-200">
                      {track.reproducciones.toLocaleString()}
                    </td>

                    {/* Likes */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onLikeTrack(track.id)}
                        className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors font-mono tabular-nums px-2 py-0.5 rounded hover:bg-rose-950/40"
                        title="Dar Like al tema"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                        <span>{track.likes.toLocaleString()}</span>
                      </button>
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                          track.estado.includes('ÉXITO')
                            ? 'text-[#FFD700] bg-[#FFD700]/15 border border-[#FFD700]/30'
                            : 'text-emerald-400 bg-emerald-950/50 border border-emerald-800/50'
                        }`}
                      >
                        {track.estado}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onToggleDistribute(track.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                          track.distribuido
                            ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-800/60'
                            : 'text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700'
                        }`}
                      >
                        {track.distribuido ? '✓ Distribuido' : 'Distribuir'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCatalog.length === 0 && (
          <div className="p-8 text-center text-zinc-500 text-xs">
            No se encontraron temas coincidentes con el filtro actual.
          </div>
        )}
      </div>
    </div>
  );
};
