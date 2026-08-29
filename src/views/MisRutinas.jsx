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

  // --- NUEVA FUNCIÓN: ELIMINAR RUTINA COMPLETA ---
  const eliminarRutina = (e, idRutina) => {
    e.stopPropagation(); // Evita que al hacer clic en el botón, también se abra la rutina
    
    const confirmacion = window.confirm("¿Estás seguro de que querés eliminar esta rutina para siempre?");
    if (confirmacion) {
      // Filtramos para quedarnos con todas menos la que queremos borrar
      const nuevasRutinas = baseDeDatosRutinas.filter(rutina => rutina.id !== idRutina);
      
      // Actualizamos la pantalla y el LocalStorage
      setBaseDeDatosRutinas(nuevasRutinas);
      localStorage.setItem('gymos_rutinas', JSON.stringify(nuevasRutinas));
      
      // Si la rutina que borramos era la que estábamos viendo abierta, cerramos la vista
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
      <div className="min-h-screen w-screen bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white p-8 overflow-x-hidden">
        <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center gap-6">
            <button onClick={() => cambiarVista('lanzador')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-md transition-colors border border-white/10">
              <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent">Mis Rutinas</h1>
          </div>
          <button onClick={() => cambiarVista('creadorRutina')} className="flex items-center gap-2 px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Crear Nueva
          </button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {baseDeDatosRutinas.length === 0 ? (
            <p className="text-gray-500 italic col-span-full">No hay rutinas guardadas. ¡Crea la primera!</p>
          ) : (
            baseDeDatosRutinas.map(rutina => (
              <div key={rutina.id} onClick={() => setRutinaSeleccionada(rutina)} className="relative group p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition-all hover:border-fuchsia-500/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] flex flex-col justify-between h-32">
                
                <h2 className="text-xl font-bold text-gray-100 group-hover:text-fuchsia-300 transition-colors pr-10">{rutina.nombre}</h2>
                
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>{rutina.etapas.length} etapas</span>
                  <span className="font-mono bg-black/40 px-2 py-1 rounded text-fuchsia-400">
                    {rutina.etapas.reduce((total, etapa) => total + (etapa.duracionMinutos || 0), 0)} min
                  </span>
                </div>

                {/* BOTÓN ELIMINAR (Visible al hacer hover) */}
                <button 
                  onClick={(e) => eliminarRutina(e, rutina.id)}
                  className="absolute top-4 right-4 p-2 bg-black/40 text-gray-400 hover:text-rose-500 hover:bg-rose-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-rose-500/30"
                  title="Eliminar Rutina"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>

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
    <div className="min-h-screen w-screen bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white p-8 overflow-x-hidden">
      <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
        
        <div className="flex items-center gap-6">
          <button onClick={() => setRutinaSeleccionada(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-md transition-colors border border-white/10">
            <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
            {rutinaSeleccionada.nombre}
          </h1>
        </div>

        {/* BOTÓN ELIMINAR DESDE ADENTRO */}
        <button 
          onClick={(e) => eliminarRutina(e, rutinaSeleccionada.id)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500 rounded-xl font-bold transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          Eliminar Rutina
        </button>

      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
        {etapas.map((etapa, index) => (
          <div key={etapa.id} draggable onDragStart={(e) => dragStart(e, index)} onDragOver={dragEnter} onDrop={(e) => dragEnd(e, index)} className="cursor-grab active:cursor-grabbing">
            <PostIt etapa={etapa} />
          </div>
        ))}
      </main>
    </div>
  );
}