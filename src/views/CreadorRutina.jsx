import React, { useState } from 'react';
import PostIt from '../components/PostIt';
// Importamos la base de datos externa de verdad
import dbEjerciciosExternos from '../data/ejercicios.json'; 

export default function CreadorRutina({ cambiarVista }) {
  const [nombreRutina, setNombreRutina] = useState('');
  const [etapas, setEtapas] = useState([]);
  
  const [etapaEnConstruccion, setEtapaEnConstruccion] = useState({
    id: 'temp', modalidad: 'Fuerza', duracionMinutos: 10, audioPista: 'Sin Audio', tieneAudioPersonalizado: false, listaEjercicios: []
  });

  const [modoIngreso, setModoIngreso] = useState('simple');
  const [nuevoEjercicio, setNuevoEjercicio] = useState({ nombre: '', cantidad: '' });
  
  // UX Mejorada para Combinados: Solo guardamos los nombres, la cantidad se define al final
  const [bloqueCombinadoTemp, setBloqueCombinadoTemp] = useState([]);
  const [cantidadBloqueCombinado, setCantidadBloqueCombinado] = useState('');

  const [modalBibliotecaAbierto, setModalBibliotecaAbierto] = useState(false);
  const pistasAudioBase = ["Sin Audio", "Pitidos Básicos (Beep Test)", "Tabata Song (20/10)", "EMOM Buzzer", "Rock Motivacional"];

  // ==========================================
  // FUNCIONES DE EDICIÓN DE ETAPAS (¡Restauradas!)
  // ==========================================
  const editarEtapa = (id) => {
    const etapaAEditar = etapas.find(e => e.id === id);
    setEtapaEnConstruccion(etapaAEditar);
    setEtapas(etapas.filter(e => e.id !== id));
  };

  const eliminarEtapa = (id) => setEtapas(etapas.filter(e => e.id !== id));

  // ==========================================
  // FUNCIONES DE EJERCICIOS
  // ==========================================
  const seleccionarDesdeBiblioteca = (nombre) => {
    setNuevoEjercicio({ ...nuevoEjercicio, nombre });
    setModalBibliotecaAbierto(false);
  };

  const agregarEjercicioSimple = (e) => {
    e.preventDefault();
    if (!nuevoEjercicio.nombre || !nuevoEjercicio.cantidad) return;
    setEtapaEnConstruccion({
      ...etapaEnConstruccion,
      listaEjercicios: [...etapaEnConstruccion.listaEjercicios, { tipo: 'simple', ejercicio: nuevoEjercicio.nombre, cantidad: nuevoEjercicio.cantidad }]
    });
    setNuevoEjercicio({ nombre: '', cantidad: '' }); 
  };

  const agregarNombreAlBloqueCombinado = (e) => {
    e.preventDefault();
    if (!nuevoEjercicio.nombre) return;
    setBloqueCombinadoTemp([...bloqueCombinadoTemp, nuevoEjercicio.nombre]);
    setNuevoEjercicio({ nombre: '', cantidad: '' }); // Solo limpiamos el nombre
  };

  const confirmarBloqueCombinado = () => {
    if (bloqueCombinadoTemp.length < 2 || !cantidadBloqueCombinado) return;
    setEtapaEnConstruccion({
      ...etapaEnConstruccion,
      listaEjercicios: [...etapaEnConstruccion.listaEjercicios, { tipo: 'combinado', ejercicios: bloqueCombinadoTemp, cantidad: cantidadBloqueCombinado }]
    });
    setBloqueCombinadoTemp([]);
    setCantidadBloqueCombinado('');
  };

  const eliminarBloqueDeEtapa = (index) => {
    const nuevaLista = [...etapaEnConstruccion.listaEjercicios];
    nuevaLista.splice(index, 1);
    setEtapaEnConstruccion({...etapaEnConstruccion, listaEjercicios: nuevaLista});
  };

  const agregarEtapa = () => {
    if (etapaEnConstruccion.listaEjercicios.length === 0) return;
    const etapaFinal = { ...etapaEnConstruccion, tieneAudioPersonalizado: etapaEnConstruccion.audioPista !== 'Sin Audio', id: etapaEnConstruccion.id === 'temp' ? Date.now().toString() : etapaEnConstruccion.id };
    setEtapas([...etapas, etapaFinal]);
    setEtapaEnConstruccion({ id: 'temp', modalidad: 'Fuerza', duracionMinutos: 10, audioPista: 'Sin Audio', tieneAudioPersonalizado: false, listaEjercicios: [] });
  };

  const guardarRutinaDefinitiva = () => {
  const rutinaNueva = { id: `rutina_${Date.now()}`, nombre: nombreRutina, etapas: etapas };
  const rutinasGuardadas = JSON.parse(localStorage.getItem('gymos_rutinas')) || [];
  localStorage.setItem('gymos_rutinas', JSON.stringify([...rutinasGuardadas, rutinaNueva]));

  // Lógica de retorno
  const retorno = localStorage.getItem('gymos_retorno');
  if (retorno) {
    localStorage.removeItem('gymos_retorno'); // Limpiamos la memoria
    cambiarVista(retorno);
  } else {
    cambiarVista('rutinas'); // Comportamiento normal si no venimos de la agenda
  }
};

  return (
    <>
      <div className="min-h-screen w-screen bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white p-8 overflow-x-hidden">
        
        <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <button onClick={() => cambiarVista('rutinas')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-md transition-colors border border-white/10 text-fuchsia-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <input 
              type="text" placeholder="Nombre de la Rutina..." value={nombreRutina} onChange={(e) => setNombreRutina(e.target.value)}
              className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-600 focus:outline-none focus:border-b-2 focus:border-fuchsia-500 transition-colors pb-1"
            />
          </div>
          <button onClick={guardarRutinaDefinitiva} disabled={!nombreRutina || etapas.length === 0} className="px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl font-bold transition-all">
            Guardar Rutina Completa
          </button>
        </header>

        <div className="flex gap-8 max-w-7xl mx-auto h-[calc(100vh-180px)]">
          
          {/* PANEL IZQUIERDO: FORMULARIO */}
          <div className="w-1/2 flex flex-col gap-6 overflow-y-auto pr-4 pb-20">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative">
              
              {etapaEnConstruccion.id !== 'temp' && (
                <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl z-10">MODO EDICIÓN</div>
              )}

              <div className="flex gap-4 mb-4 mt-2">
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Modalidad</label>
                  <select value={etapaEnConstruccion.modalidad} onChange={(e) => setEtapaEnConstruccion({...etapaEnConstruccion, modalidad: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500 appearance-none font-bold">
                    <option value="Fuerza">Fuerza</option><option value="AMRAP">AMRAP</option><option value="EMOM">EMOM</option><option value="Tabata">Tabata</option>
                  </select>
                </div>
                <div className="w-1/3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Minutos</label>
                  <input type="number" min="1" value={etapaEnConstruccion.duracionMinutos} onChange={(e) => setEtapaEnConstruccion({...etapaEnConstruccion, duracionMinutos: parseInt(e.target.value) || 0})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none text-center font-bold font-mono" />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Pista de Audio</label>
                <select value={etapaEnConstruccion.audioPista} onChange={(e) => setEtapaEnConstruccion({...etapaEnConstruccion, audioPista: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-fuchsia-300 focus:outline-none appearance-none font-bold">
                  {pistasAudioBase.map(pista => <option key={pista} value={pista} className="text-white bg-gray-900">{pista}</option>)}
                </select>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex bg-black/40 rounded-xl p-1 mb-6 border border-white/5">
                  <button onClick={() => setModoIngreso('simple')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${modoIngreso === 'simple' ? 'bg-fuchsia-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Ejercicio Simple</button>
                  <button onClick={() => setModoIngreso('combinado')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${modoIngreso === 'combinado' ? 'bg-fuchsia-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Superset / Combinado</button>
                </div>

                {modoIngreso === 'simple' ? (
                  <form onSubmit={agregarEjercicioSimple} className="flex gap-2 mb-4">
                    <button type="button" onClick={() => setModalBibliotecaAbierto(true)} className="p-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/40 rounded-xl transition-colors">📚</button>
                    <input type="text" placeholder="Nombre Ejercicio" value={nuevoEjercicio.nombre} onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, nombre: e.target.value})} className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none text-sm" />
                    <input type="text" placeholder="Reps (Ej: 10)" value={nuevoEjercicio.cantidad} onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, cantidad: e.target.value})} className="w-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none text-sm text-center" />
                    <button type="submit" className="px-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">+</button>
                  </form>
                ) : (
                  <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl p-4 mb-6">
                    <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-4 block">1. Sumar Ejercicios al Combo:</span>
                    
                    <form onSubmit={agregarNombreAlBloqueCombinado} className="flex gap-2 mb-4">
                      <button type="button" onClick={() => setModalBibliotecaAbierto(true)} className="p-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/40 rounded-xl transition-colors">📚</button>
                      <input type="text" placeholder="Ej: Sentadilla" value={nuevoEjercicio.nombre} onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, nombre: e.target.value})} className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none text-sm" />
                      <button type="submit" className="px-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors text-sm">+ Sumar</button>
                    </form>

                    {bloqueCombinadoTemp.length > 0 && (
                      <div className="flex flex-col gap-1 mb-6 border-l-2 border-fuchsia-500 pl-3">
                        {bloqueCombinadoTemp.map((ej, i) => (
                          <span key={i} className="text-gray-300 text-sm">{i > 0 ? <span className="text-fuchsia-400 mr-2 font-bold">+</span> : ''}{ej}</span>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-fuchsia-500/30 pt-4">
                      <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-2 block">2. Repeticiones Totales del Combo:</span>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Ej: 10x10x8" value={cantidadBloqueCombinado} onChange={(e) => setCantidadBloqueCombinado(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none text-sm" />
                        <button onClick={confirmarBloqueCombinado} disabled={bloqueCombinadoTemp.length < 2 || !cantidadBloqueCombinado} className="px-4 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-gray-800 disabled:text-gray-600 rounded-xl text-white font-bold text-sm transition-colors">✓ Guardar Bloque</button>
                      </div>
                    </div>
                  </div>
                )}

                {etapaEnConstruccion.listaEjercicios.length > 0 && (
                  <div className="bg-black/30 rounded-xl p-4 border border-white/5 flex flex-col gap-2 mt-4">
                    <span className="text-xs text-gray-500 uppercase font-bold">Bloques listos en la tarjeta:</span>
                    {etapaEnConstruccion.listaEjercicios.map((bloque, index) => (
                      <div key={index} className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex flex-col">
                          {bloque.tipo === 'simple' && <span>{bloque.ejercicio} <span className="text-gray-500">({bloque.cantidad})</span></span>}
                          {bloque.tipo === 'combinado' && (
                            <span className="text-gray-300">
                              {bloque.ejercicios.map((ej, i) => (
                                <React.Fragment key={i}>{i > 0 && <span className="text-fuchsia-400 font-bold mx-1">+</span>}{ej}</React.Fragment>
                              ))}
                              <span className="text-gray-500 ml-2">({bloque.cantidad})</span>
                            </span>
                          )}
                        </div>
                        <button onClick={() => eliminarBloqueDeEtapa(index)} className="text-rose-500 hover:bg-rose-500/20 p-2 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={agregarEtapa} className={`mt-8 w-full py-4 rounded-xl font-bold text-white transition-colors border-dashed border-2 ${etapaEnConstruccion.id !== 'temp' ? 'bg-amber-600 hover:bg-amber-500 border-amber-400/50' : 'bg-white/10 hover:bg-fuchsia-500/20 border-white/20'}`}>
                {etapaEnConstruccion.id !== 'temp' ? 'Guardar Cambios de la Etapa' : 'Confirmar y Agregar Etapa a la Rutina'}
              </button>
            </div>
          </div>

          {/* PANEL DERECHO: LIVE PREVIEW & ETAPAS GUARDADAS */}
          <div className="w-1/2 bg-black/20 border border-white/5 rounded-3xl p-6 backdrop-blur-sm overflow-y-auto">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Vista Previa</h2>
            <div className="mb-8 opacity-90 scale-95 origin-top-left transition-all min-h-[150px]">
              <PostIt etapa={etapaEnConstruccion} />
            </div>
            
            {etapas.length > 0 && (
              <>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-t border-white/10 pt-6">Etapas Listas</h2>
                <div className="grid grid-cols-2 gap-4">
                  {etapas.map((etapa) => (
                    <div key={etapa.id} className="scale-90 origin-top relative group">
                      <PostIt etapa={etapa} />
                      
                      {/* CRISTAL DE EDICIÓN RESTAURADO */}
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10 border border-white/20">
                        <button onClick={() => editarEtapa(etapa.id)} className="p-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-transform hover:scale-110" title="Editar Etapa">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button onClick={() => eliminarEtapa(etapa.id)} className="p-4 bg-rose-500 hover:bg-rose-400 text-white rounded-full shadow-[0_0_20px_rgba(244,63,94,0.5)] transition-transform hover:scale-110" title="Eliminar Etapa">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: BIBLIOTECA DE EJERCICIOS */}
      {modalBibliotecaAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-3xl p-8 w-full max-w-4xl max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(34,211,238,0.15)] relative">
            <button onClick={() => setModalBibliotecaAbierto(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white/5 p-2 rounded-full"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">Biblioteca de Ejercicios</h2>
            <p className="text-gray-400 mb-8">Seleccioná un ejercicio de la lista externa para cargarlo en el formulario.</p>
            <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-8 pr-4">
              {Object.entries(dbEjerciciosExternos).map(([categoria, ejercicios]) => (
                <div key={categoria} className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-gray-100 border-b border-white/10 pb-2">{categoria}</h3>
                  <div className="flex flex-col gap-2">
                    {ejercicios.map(ej => (
                      <button key={ej} onClick={() => seleccionarDesdeBiblioteca(ej)} className="text-left px-4 py-2 bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 rounded-lg text-sm transition-colors">{ej}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}