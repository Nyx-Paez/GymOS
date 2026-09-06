import React, { useState, useEffect } from 'react';
import PostIt from '../components/PostIt';

export default function MisRutinas({ cambiarVista }) {
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
  const [etapas, setEtapas] = useState([]);
  const [baseDeDatosRutinas, setBaseDeDatosRutinas] = useState([]);

  useEffect(() => {
    const rutinasGuardadas = JSON.parse(localStorage.getItem('gymos_rutinas')) || [];
    setBaseDeDatosRutinas(rutinasGuardadas);
  }, []);

  // --- NUEVA FUNCIÓN: EDITAR RUTINA ---
  const editarRutina = (e, rutina) => {
    if (e) e.stopPropagation(); // Evita que se abra la rutina si tocamos el botón desde la grilla
    // Guardamos la rutina en un estado temporal
    localStorage.setItem('gymos_rutina_a_editar', JSON.stringify(rutina));
    localStorage.setItem('gymos_retorno', 'rutinas'); 
    // Le avisamos a la app que cambie a la pantalla del Creador
    cambiarVista('creadorRutina'); 
  };

  // --- NUEVA FUNCIÓN: ELIMINAR RUTINA COMPLETA ---
  const eliminarRutina = (e, idRutina) => {
    if (e) e.stopPropagation(); 
    
    const confirmacion = window.confirm("¿Estás seguro de que querés eliminar esta rutina para siempre?");
    if (confirmacion) {
      const nuevasRutinas = baseDeDatosRutinas.filter(rutina => rutina.id !== idRutina);
      setBaseDeDatosRutinas(nuevasRutinas);
      localStorage.setItem('gymos_rutinas', JSON.stringify(nuevasRutinas));
      
      if (rutinaSeleccionada && rutinaSeleccionada.id === idRutina) {
        setRutinaSeleccionada(null);
      }
    }
  };

  // --- LÓGICA DE DRAG & DROP ---
  const dragStart = (e, index) => { e.currentTarget.style.opacity = '0.5'; e.dataTransfer.setData('index', index); };
  const dragEnter = (e) => e.preventDefault();
  const dragEnd = (e, indexDestino) => {
    e.currentTarget.style.opacity = '1';
    const indexOrigen = e.dataTransfer.getData('index');
    if(indexOrigen === "") return;
    const copiaEtapas = [...etapas];
    const contenidoArrastrado = copiaEtapas.splice(indexOrigen, 1)[0];
    copiaEtapas.splice(indexDestino, 0, contenidoArrastrado);
    setEtapas(copiaEtapas);
  };

  useEffect(() => { if (rutinaSeleccionada) setEtapas(rutinaSeleccionada.etapas); }, [rutinaSeleccionada]);

  // ==========================================
  // VISTA 1: LISTA DE RUTINAS
  // ==========================================
  if (!rutinaSeleccionada) {
    return (
      <div className="min-h-screen w-full bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white p-4 md:p-8 overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 border-b border-white/10 pb-6 gap-4">
          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={() => cambiarVista('lanzador')} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-md transition-colors border border-white/10 shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent">Mis Rutinas</h1>
          </div>
          <button onClick={() => cambiarVista('creadorRutina')} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Crear Nueva
          </button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {baseDeDatosRutinas.length === 0 ? (
            <p className="text-gray-500 italic col-span-full text-center py-10 border-2 border-dashed border-white/10 rounded-2xl">No hay rutinas guardadas. ¡Creá la primera!</p>
          ) : (
            baseDeDatosRutinas.map(rutina => (
              <div key={rutina.id} onClick={() => setRutinaSeleccionada(rutina)} className="relative group p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition-all hover:border-fuchsia-500/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] flex flex-col justify-between min-h-[160px]">

                <h2 className="text-xl font-bold text-gray-100 group-hover:text-fuchsia-300 transition-colors pr-16">{rutina.nombre}</h2>

                <div className="flex justify-between items-center text-sm text-gray-400 mt-2">
                  <span>{rutina.etapas.length} etapas</span>
                  <span className="font-mono bg-black/40 px-2 py-1 rounded text-fuchsia-400 font-bold">
                    {rutina.etapas.reduce((total, etapa) => total + (etapa.duracionMinutos || 0), 0)} min
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  {(() => {
                    const historial = JSON.parse(localStorage.getItem('gymos_historial')) || [];
                    const sedes = JSON.parse(localStorage.getItem('gymos_sedes')) || [];

                    const usos = historial.filter(h => h.rutinaId === rutina.id);
                    const ultimoUso = usos[usos.length - 1];

                    if (!ultimoUso) return <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">No agendada aún</span>;

                    const sede = sedes.find(s => s.id === ultimoUso.sedeId);
                    if (!sede) return null;

                    return (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Último uso:</span>
                        <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                          {sede.tipo === 'internet' ? (
                            <img src={sede.logo} className="w-4 h-4 rounded-full object-cover bg-white" alt="logo" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(sede.nombre)}&background=22d3ee&color=fff&rounded=true&bold=true`; }} />
                          ) : (
                            <span className={`w-4 h-4 ${sede.color}`}>
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </span>
                          )}
                          <span className="text-xs text-cyan-400 font-medium truncate max-w-[120px]" title={sede.nombre}>{sede.nombre}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* BOTONERA FLOTANTE (Visible al hacer hover o siempre en mobile) */}
                <div className="absolute top-4 right-4 flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all">
                  <button
                    onClick={(e) => editarRutina(e, rutina)}
                    className="p-2 bg-black/60 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded-lg border border-transparent hover:border-cyan-500/30 backdrop-blur-md"
                    title="Editar Rutina"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button
                    onClick={(e) => eliminarRutina(e, rutina.id)}
                    className="p-2 bg-black/60 text-gray-400 hover:text-rose-500 hover:bg-rose-500/20 rounded-lg border border-transparent hover:border-rose-500/30 backdrop-blur-md"
                    title="Eliminar Rutina"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>

              </div>
            ))
          )}
        </main>
      </div>
    );
  }

  // ==========================================
  // VISTA 2: DETALLE DE LA RUTINA (POST-ITS)
  // ==========================================
  return (
    <div className="min-h-screen w-full bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white p-4 md:p-8 overflow-x-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 border-b border-white/10 pb-6 gap-4">
        
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
          <button onClick={() => setRutinaSeleccionada(null)} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-md transition-colors border border-white/10 shrink-0">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent truncate pr-4">
            {rutinaSeleccionada.nombre}
          </h1>
        </div>

        {/* BOTONES DE EDICIÓN Y BORRADO DESDE ADENTRO */}
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={(e) => editarRutina(e, rutinaSeleccionada)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500 rounded-xl font-bold transition-all text-sm md:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Editar
          </button>
          <button 
            onClick={(e) => eliminarRutina(e, rutinaSeleccionada.id)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500 rounded-xl font-bold transition-all text-sm md:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Eliminar
          </button>
        </div>

      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 max-w-7xl mx-auto">
        {etapas.map((etapa, index) => (
          <div key={etapa.id} draggable onDragStart={(e) => dragStart(e, index)} onDragOver={dragEnter} onDrop={(e) => dragEnd(e, index)} className="cursor-grab active:cursor-grabbing">
            <PostIt etapa={etapa} />
          </div>
        ))}
      </main>
    </div>
  );
}