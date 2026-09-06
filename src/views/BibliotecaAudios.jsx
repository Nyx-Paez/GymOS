import React, { useState, useEffect } from 'react';
import localforage from 'localforage';

// Configuramos la base de datos pesada para los audios
localforage.config({
  name: 'GymOS_AudioDB',
  storeName: 'audios_guardados'
});

export default function BibliotecaAudios({ cambiarVista }) {
  const [audios, setAudios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [filtroCategoria, setFiltroCategoria] = useState('Todos');

  // Estado del nuevo audio a subir
  const [nuevoAudio, setNuevoAudio] = useState({
    nombre: '',
    categoria: 'Tabata',
    duracion: '00:00',
    archivoRaw: null
  });

  useEffect(() => {
    // 1. Cargar las categorías que creaste en el Creador de Rutinas
    const catGuardadas = JSON.parse(localStorage.getItem('gymos_modalidades')) || ['Fuerza', 'AMRAP', 'EMOM', 'Tabata'];
    setCategorias(catGuardadas);
    if (catGuardadas.length > 0) setNuevoAudio(prev => ({ ...prev, categoria: catGuardadas[0] }));

    // 2. Cargar los audios desde IndexedDB
    cargarAudios();
  }, []);

  const cargarAudios = async () => {
    try {
      const audiosDB = await localforage.getItem('pistas_mp3') || [];
      setAudios(audiosDB);
    } catch (err) {
      console.error("Error cargando audios:", err);
    }
  };

  // Función mágica para leer el MP3 y calcular cuánto dura antes de guardarlo
  const manejarSubida = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const nombreLimpio = file.name.replace(/\.[^/.]+$/, "");
    
    // Calcular duración usando una etiqueta de audio invisible
    const objectUrl = URL.createObjectURL(file);
    const audioElement = new Audio(objectUrl);
    
    audioElement.addEventListener('loadedmetadata', () => {
      const minutos = Math.floor(audioElement.duration / 60);
      const segundos = Math.floor(audioElement.duration % 60);
      const duracionFormateada = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
      
      setNuevoAudio({
        nombre: nombreLimpio,
        categoria: nuevoAudio.categoria,
        duracion: duracionFormateada,
        archivoRaw: file // Guardamos el archivo real
      });
    });
  };

  const guardarAudioEnDB = async (e) => {
    e.preventDefault();
    if (!nuevoAudio.archivoRaw || !nuevoAudio.nombre) return;
    setCargando(true);

    try {
      const audiosActuales = await localforage.getItem('pistas_mp3') || [];
      
      const nuevoRegistro = {
        id: `audio_${Date.now()}`,
        nombre: nuevoAudio.nombre,
        categoria: nuevoAudio.categoria,
        duracion: nuevoAudio.duracion,
        archivo: nuevoAudio.archivoRaw // IndexedDB permite guardar archivos Blob enteros
      };

      const nuevaLista = [nuevoRegistro, ...audiosActuales];
      await localforage.setItem('pistas_mp3', nuevaLista);
      
      setAudios(nuevaLista);
      setModalAbierto(false);
      setNuevoAudio({ nombre: '', categoria: categorias[0] || 'Tabata', duracion: '00:00', archivoRaw: null });
    } catch (err) {
      alert("Error al guardar el archivo pesado.");
    } finally {
      setCargando(false);
    }
  };

  const eliminarAudio = async (id) => {
    if (window.confirm("¿Borrar este audio definitivamente?")) {
      const nuevaLista = audios.filter(a => a.id !== id);
      await localforage.setItem('pistas_mp3', nuevaLista);
      setAudios(nuevaLista);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black p-4 md:p-8">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <button onClick={() => cambiarVista('dashboard')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
            <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Discoteca <span className="text-cyan-400">Gym-OS</span></h1>
        </div>
        <button onClick={() => setModalAbierto(true)} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          + Subir Pista
        </button>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* FILTROS */}
        <div className="flex gap-4 mb-8">
          <select 
            value={filtroCategoria} 
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 min-w-[200px]"
          >
            <option value="Todos">Todas las Categorías</option>
            {categorias.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* GRILLA DE AUDIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audios.filter(a => filtroCategoria === 'Todos' || a.categoria === filtroCategoria).map(audio => (
            <div key={audio.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 relative group hover:border-cyan-500/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-2 py-1 rounded uppercase">{audio.categoria}</span>
                <button onClick={() => eliminarAudio(audio.id)} className="text-gray-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 truncate pr-4">{audio.nombre}</h3>
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-mono text-sm">{audio.duracion} min</span>
              </div>
            </div>
          ))}
          {audios.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
              <p className="text-gray-500 text-lg">No tenés pistas guardadas todavía.</p>
              <button onClick={() => setModalAbierto(true)} className="mt-4 text-cyan-400 font-bold hover:underline">Subir mi primer track</button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE SUBIDA */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <form onSubmit={guardarAudioEnDB} className="bg-gray-900 border border-cyan-500/30 rounded-[2rem] p-8 w-full max-w-md flex flex-col shadow-[0_0_50px_rgba(34,211,238,0.1)] relative">
            <button type="button" onClick={() => setModalAbierto(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">Subir Track</h2>

            <div className="relative mb-6">
              <input type="file" accept="audio/mp3, audio/wav" onChange={manejarSubida} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className={`p-6 border-2 border-dashed rounded-2xl text-center transition-colors ${nuevoAudio.archivoRaw ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-black/40 border-white/20 hover:border-cyan-500/50'}`}>
                {nuevoAudio.archivoRaw ? (
                  <div>
                    <p className="text-cyan-300 font-bold mb-1 truncate">{nuevoAudio.archivoRaw.name}</p>
                    <p className="text-gray-400 text-sm font-mono">Duración: {nuevoAudio.duracion}</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm font-bold">Arrastrá un MP3 o hacé clic acá</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Nombre Personalizado</label>
              <input type="text" required value={nuevoAudio.nombre} onChange={e => setNuevoAudio({...nuevoAudio, nombre: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500" />
            </div>

            <div className="mb-8">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Clasificación</label>
              <select value={nuevoAudio.categoria} onChange={e => setNuevoAudio({...nuevoAudio, categoria: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500">
                {categorias.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
              </select>
            </div>

            <button type="submit" disabled={!nuevoAudio.archivoRaw || cargando} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl font-bold text-white transition-all">
              {cargando ? 'Guardando en la bóveda...' : 'Guardar en la Discoteca'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}