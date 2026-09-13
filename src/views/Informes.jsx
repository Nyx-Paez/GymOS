import React, { useState, useEffect } from 'react';

export default function Informes({ cambiarVista }) {
  const [rutinas, setRutinas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [sedes, setSedes] = useState([]);

  useEffect(() => {
    setRutinas(JSON.parse(localStorage.getItem('gymos_rutinas')) || []);
    setHistorial(JSON.parse(localStorage.getItem('gymos_historial')) || []);
    setSedes(JSON.parse(localStorage.getItem('gymos_sedes')) || []);
  }, []);

  // Calcular estadísticas por rutina
  const obtenerEstadisticasRutina = (rutinaId) => {
    const usos = historial.filter(h => h.rutinaId === rutinaId);
    if (usos.length === 0) return { veces: 0, ultimoUso: 'Nunca utilizada', lugarUltimo: '---', diasDesdeUltimo: 999 };

    // Ordenar por fecha más reciente
    usos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    const ultimo = usos[0];
    
    const sedeUltimo = sedes.find(s => s.id === ultimo.sedeId);
    
    // Calcular días de diferencia con hoy
    const fechaUltimoUso = new Date(ultimo.fecha);
    const hoy = new Date();
    const diferenciaDias = Math.floor((hoy - fechaUltimoUso) / (1000 * 60 * 60 * 24));

    let mensajeFrescura = `Usada hace ${diferenciaDias} días`;
    let colorFrescura = 'text-amber-400 bg-amber-500/10 border-amber-500/30';

    if (diferenciaDias === 0) {
      mensajeFrescura = '¡Usada hoy mismo!';
      colorFrescura = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    } else if (diferenciaDias > 10 || diferenciaDias < 0) {
      mensajeFrescura = 'Fresca (Ideal para repetir)';
      colorFrescura = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }

    return {
      veces: usos.length,
      ultimoUso: ultimo.fecha,
      lugarUltimo: sedeUltimo ? `${sedeUltimo.icono} ${sedeUltimo.nombre}` : 'Lugar desconocido',
      mensajeFrescura,
      colorFrescura
    };
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black p-4 md:p-8 text-white">
      
      {/* HEADER */}
      <header className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6 max-w-6xl mx-auto">
        <button onClick={() => cambiarVista('lanzador')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 shrink-0">
          <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="overflow-hidden">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent truncate">Informes y Estadísticas</h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1 truncate">Controla la rotación de tus clases.</p>
        </div>
      </header>

      {/* RESUMEN GENERAL */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Rutinas Creadas</p>
            <p className="text-3xl font-extrabold text-white mt-1">{rutinas.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center text-2xl">📋</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Clases Dictadas (Historial)</p>
            <p className="text-3xl font-extrabold text-white mt-1">{historial.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl">📅</div>
        </div>
      </div>

      {/* LISTADO DE ROTACIÓN DE RUTINAS */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg font-bold text-gray-300 mb-4 uppercase tracking-wider text-xs">Rotación y Frescura de Rutinas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rutinas.length === 0 ? (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-white/10 rounded-2xl text-gray-500">
              No hay rutinas creadas todavía.
            </div>
          ) : (
            rutinas.map(rutina => {
              const stats = obtenerEstadisticasRutina(rutina.id);
              return (
                <div key={rutina.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative group hover:border-cyan-500/40 transition-all">
                  
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white truncate pr-2">{rutina.nombre}</h3>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${stats.colorFrescura}`}>
                        {stats.mensajeFrescura}
                      </span>
                    </div>

                    <div className="text-sm text-gray-400 space-y-1 mb-4">
                      <p>🔢 Veces dictada: <span className="text-white font-mono font-bold">{stats.veces}</span></p>
                      <p>🗓️ Último uso: <span className="text-white font-mono">{stats.ultimoUso}</span></p>
                      <p>📍 Lugar: <span className="text-cyan-400 font-medium">{stats.lugarUltimo}</span></p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <span>{rutina.etapas?.length || 0} etapas</span>
                    <span className="font-mono">{rutina.etapas?.reduce((t, e) => t + (e.duracionMinutos || 0), 0)} min</span>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}