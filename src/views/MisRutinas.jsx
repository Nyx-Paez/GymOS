import React, { useState, useEffect } from 'react';
import PostIt from '../components/PostIt';

export default function MisRutinas({ cambiarVista }) {
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
  const [etapas, setEtapas] = useState([]);
  const [baseDeDatosRutinas, setBaseDeDatosRutinas] = useState([]);

  // --- NUEVOS ESTADOS PARA EL MODO REPRODUCTOR ---
  const [modoReproduccion, setModoReproduccion] = useState(false);
  const [indiceEtapa, setIndiceEtapa] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [timerCorriendo, setTimerCorriendo] = useState(false);

  useEffect(() => {
    const rutinasGuardadas = JSON.parse(localStorage.getItem('gymos_rutinas')) || [];
    setBaseDeDatosRutinas(rutinasGuardadas);
  }, []);

  // --- LÓGICA DEL RELOJ DEL REPRODUCTOR ---
  useEffect(() => {
    let intervalo = null;
    if (timerCorriendo && tiempoRestante > 0) {
      intervalo = setInterval(() => setTiempoRestante(prev => prev - 1), 1000);
    } else if (tiempoRestante === 0 && timerCorriendo) {
      setTimerCorriendo(false);
      // ¡Acá a futuro conectaremos el sonido de FIN DE ETAPA!
    }
    return () => clearInterval(intervalo);
  }, [timerCorriendo, tiempoRestante]);

  // --- FUNCIONES DE NAVEGACIÓN DEL REPRODUCTOR ---
  const iniciarReproduccion = (indice = 0) => {
    setIndiceEtapa(indice);
    setTiempoRestante((etapas[indice]?.duracionMinutos || 0) * 60);
    setModoReproduccion(true);
    setTimerCorriendo(false);
  };

  const cambiarEtapa = (nuevoIndice) => {
    if(nuevoIndice >= 0 && nuevoIndice < etapas.length) {
      setIndiceEtapa(nuevoIndice);
      setTiempoRestante((etapas[nuevoIndice]?.duracionMinutos || 0) * 60);
      setTimerCorriendo(false);
    }
  };

  // --- FUNCIONES DE EDICIÓN Y BORRADO ---
  const editarRutina = (e, rutina) => {
    if (e) e.stopPropagation();
    localStorage.setItem('gymos_rutina_a_editar', JSON.stringify(rutina));
    localStorage.setItem('gymos_retorno', 'rutinas'); 
    cambiarVista('creadorRutina'); 
  };

  const eliminarRutina = (e, idRutina) => {
    if (e) e.stopPropagation(); 
    if (window.confirm("¿Estás seguro de que querés eliminar esta rutina para siempre?")) {
      const nuevasRutinas = baseDeDatosRutinas.filter(rutina => rutina.id !== idRutina);
      setBaseDeDatosRutinas(nuevasRutinas);
      localStorage.setItem('gymos_rutinas', JSON.stringify(nuevasRutinas));
      if (rutinaSeleccionada && rutinaSeleccionada.id === idRutina) setRutinaSeleccionada(null);
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
  // VISTA 3: MODO REPRODUCTOR (PANTALLA COMPLETA)
  // ==========================================
  if (modoReproduccion) {
    const etapaActual = etapas[indiceEtapa];
    const min = Math.floor(tiempoRestante / 60);
    const seg = tiempoRestante % 60;
    const tiempoFormat = `${String(min).padStart(2,'0')}:${String(seg).padStart(2,'0')}`;
    const progreso = ((indiceEtapa + 1) / etapas.length) * 100;

    return (
      <div className="fixed inset-0 z-50 bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black text-white flex flex-col overflow-hidden">
        {/* BARRA DE PROGRESO DE LA CLASE */}
        <div className="w-full h-2 md:h-3 bg-gray-800 shrink-0">
          <div className="h-full bg-cyan-500 transition-all duration-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]" style={{ width: `${progreso}%` }}></div>
        </div>

        {/* HEADER DEL REPRODUCTOR */}
        <header className="flex justify-between items-center p-4 md:p-6 border-b border-white/10 shrink-0 bg-black/20 backdrop-blur-md">
          <button onClick={() => { setModoReproduccion(false); setTimerCorriendo(false); }} className="p-3 bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-500 rounded-xl transition-all border border-white/5">
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="text-center">
            <h2 className="text-xl md:text-3xl font-bold text-cyan-400 truncate max-w-[200px] md:max-w-md">{rutinaSeleccionada.nombre}</h2>
            <p className="text-xs md:text-sm text-gray-400 uppercase tracking-widest mt-1">Etapa {indiceEtapa + 1} de {etapas.length}</p>
          </div>
          <div className="w-12 md:w-14"></div> {/* Spacer para centrar el título */}
        </header>

        {/* CONTENIDO DIVIDIDO */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* MITAD IZQUIERDA: TIMER Y CONTROLES */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/10 relative">
            
            <h3 className="text-3xl md:text-5xl font-bold text-fuchsia-400 mb-2">{etapaActual.modalidad}</h3>
            {etapaActual.audioPista !== "Sin Audio" && (
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full mb-8 md:mb-12 border border-white/10">
                <span className="text-cyan-400">🎵</span>
                <span className="text-sm font-medium text-gray-300">{etapaActual.audioPista}</span>
              </div>
            )}

            {/* RELOJ GIGANTE */}
            <div className="relative flex justify-center items-center mb-8 md:mb-12 w-full">
               <div className={`absolute w-[50vw] h-[50vw] md:w-[25rem] md:h-[25rem] rounded-full blur-[80px] md:blur-[100px] transition-all duration-1000 ${timerCorriendo ? 'bg-cyan-600/20 scale-110' : 'bg-gray-700/10 scale-90'}`}></div>
               <h1 className="text-[25vw] md:text-[8rem] font-black tabular-nums tracking-tighter leading-none z-10 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                 {tiempoFormat}
               </h1>
            </div>

            {/* CONTROLES DE REPRODUCCIÓN */}
            <div className="flex items-center gap-4 md:gap-8 z-10">
              <button onClick={() => cambiarEtapa(indiceEtapa - 1)} disabled={indiceEtapa === 0} className="p-4 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/5 transition-all">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>

              <button onClick={() => setTimerCorriendo(!timerCorriendo)} className={`p-6 md:p-8 rounded-full border-4 shadow-lg transition-all ${timerCorriendo ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_40px_rgba(244,63,94,0.4)] hover:scale-105' : 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-105'}`}>
                {timerCorriendo ? (
                  <svg className="w-10 h-10 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"></path></svg>
                ) : (
                  <svg className="w-10 h-10 md:w-12 md:h-12 translate-x-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                )}
              </button>

              <button onClick={() => cambiarEtapa(indiceEtapa + 1)} disabled={indiceEtapa === etapas.length - 1} className="p-4 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/5 transition-all">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* MITAD DERECHA: LISTA DE EJERCICIOS */}
          <div className="w-full md:w-1/2 bg-black/40 overflow-y-auto p-6 md:p-8 no-scrollbar">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Ejercicios de la Etapa</h3>
            <div className="flex flex-col gap-4">
              {etapaActual.listaEjercicios.map((bloque, index) => (
                <div key={index} className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-2xl shadow-lg">
                  {bloque.tipo === "simple" ? (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <span className="text-xl md:text-2xl font-bold text-white capitalize">{bloque.ejercicio.nombre}</span>
                      <span className="text-xl font-mono text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-xl self-start sm:self-auto text-center">{bloque.ejercicio.cantidad}</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-col gap-3 mb-4">
                        {bloque.ejercicios.map((ej, i) => (
                          <div key={i} className="flex items-center gap-3">
                            {i > 0 && <span className="text-fuchsia-500 font-bold text-xl">+</span>}
                            <span className="text-lg md:text-xl font-bold text-gray-200 capitalize">{ej}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-white/10 pt-4 text-left sm:text-right">
                        <span className="inline-block text-xl font-mono text-fuchsia-400 font-bold bg-fuchsia-500/10 border border-fuchsia-500/20 px-4 py-2 rounded-xl">{bloque.cantidad}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // VISTA 1: LISTA DE RUTINAS
  // ==========================================
  if (!rutinaSeleccionada) {
    return (
      <div className="min-h-screen w-full bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white p-4 md:p-8 overflow-x-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-white/10 pb-6 gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 md:gap-6 w-full overflow-hidden">
            <button onClick={() => cambiarVista('lanzador')} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent truncate">Mis Rutinas</h1>
          </div>
          <button onClick={() => cambiarVista('creadorRutina')} className="px-5 py-2 md:px-6 md:py-3 border border-fuchsia-500/50 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(217,70,239,0.1)] text-sm md:text-base shrink-0 self-start">
            + Crear Nueva
          </button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {baseDeDatosRutinas.length === 0 ? (
            <p className="text-gray-500 italic col-span-full text-center py-10 border-2 border-dashed border-white/10 rounded-2xl">No hay rutinas guardadas. ¡Creá la primera!</p>
          ) : (
            baseDeDatosRutinas.map(rutina => (
              <div key={rutina.id} onClick={() => setRutinaSeleccionada(rutina)} className="relative group p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition-all hover:border-fuchsia-500/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] flex flex-col justify-between min-h-[160px]">

                <h2 className="text-xl font-bold text-gray-100 group-hover:text-fuchsia-300 transition-colors pr-20">{rutina.nombre}</h2>

                <div className="flex justify-between items-center text-sm text-gray-400 mt-2">
                  <span>{rutina.etapas?.length || 0} etapas</span>
                  <span className="font-mono bg-black/40 px-2 py-1 rounded text-fuchsia-400 font-bold">
                    {(rutina.etapas || []).reduce((total, etapa) => total + (etapa.duracionMinutos || 0), 0)} min
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all">
                  <button onClick={(e) => editarRutina(e, rutina)} className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 rounded-lg transition-colors border border-cyan-500/20 backdrop-blur-md" title="Editar">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={(e) => eliminarRutina(e, rutina.id)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors border border-rose-500/20 backdrop-blur-md" title="Eliminar">
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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 border-b border-white/10 pb-6 gap-4 max-w-7xl mx-auto">
        
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
          <button onClick={() => setRutinaSeleccionada(null)} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-md transition-colors border border-white/10 shrink-0">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent truncate pr-4">
            {rutinaSeleccionada.nombre}
          </h1>
        </div>

        <div className="flex gap-4 w-full md:w-auto shrink-0">
          <div className="flex gap-2">
            <button onClick={() => editarRutina(null, rutinaSeleccionada)} className="p-2 md:p-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 rounded-xl transition-colors border border-cyan-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button onClick={() => eliminarRutina(null, rutinaSeleccionada.id)} className="p-2 md:p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-colors border border-rose-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
          
          {/* EL NUEVO BOTÓN GIGANTE PARA INICIAR CLASE */}
          <button 
            onClick={() => iniciarReproduccion(0)} 
            className="flex-1 md:flex-none px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
            Iniciar Clase
          </button>
        </div>

      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 max-w-7xl mx-auto">
        {etapas.map((etapa, index) => (
          <div key={etapa.id} draggable onDragStart={(e) => dragStart(e, index)} onDragOver={dragEnter} onDrop={(e) => dragEnd(e, index)} className="cursor-grab active:cursor-grabbing relative group">
            <PostIt etapa={etapa} />
            
            {/* BOTÓN RÁPIDO PARA INICIAR DESDE ESTA ETAPA ESPECÍFICA */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center">
              <button onClick={() => iniciarReproduccion(index)} className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)] flex items-center gap-2 hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                Empezar de acá
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}