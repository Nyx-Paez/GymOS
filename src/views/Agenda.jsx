import React, { useState } from 'react';

export default function Agenda({ cambiarVista }) {
  const [diaSeleccionado, setDiaSeleccionado] = useState(29);
  
  // ==========================================
  // ESTADOS DEL MODAL
  // ==========================================
  const [modalAbierto, setModalAbierto] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState({
    rutina: 'Cross Training Full Body',
    lugar: 'ON FIT Pilar',
    hora: '18:00'
  });

  // Función para cuando tocamos "Reutilizar"
  const abrirModalReutilizar = (clase) => {
    setDatosFormulario({
      rutina: clase.rutina,
      lugar: clase.lugar,
      hora: clase.hora
    });
    setModalAbierto(true);
  };

  // Función para cuando tocamos "Agendar en Día X"
  const abrirModalAgendar = () => {
    setDatosFormulario({
      rutina: 'Cross Training Full Body', // Por defecto
      lugar: 'ON FIT Pilar',              // Por defecto
      hora: '10:00'
    });
    setModalAbierto(true);
  };

  const guardarClase = (e) => {
    e.preventDefault();
    // Acá en el futuro guardaremos en la base de datos
    console.log("Guardando clase para el día", diaSeleccionado, datosFormulario);
    setModalAbierto(false); // Cerramos el modal
  };

  // ==========================================
  // DATOS DE PRUEBA E ÍCONOS
  // ==========================================
  const iconosLugar = {
    'ON FIT Pilar': (
      <svg className="w-4 h-4 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
    ),
    'Parque (Aire Libre)': (
      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
    )
  };

  const clasesPorDia = {
    27: [{ id: 1, rutina: 'Fuerza Base', lugar: 'ON FIT Pilar', hora: '18:00', completada: true }],
    28: [{ id: 2, rutina: 'Cross Training', lugar: 'Parque (Aire Libre)', hora: '09:00', completada: true }],
    29: [
      { id: 3, rutina: 'Día de Piernas', lugar: 'ON FIT Pilar', hora: '10:00', completada: true },
      { id: 4, rutina: 'Core y Flexibilidad', lugar: 'ON FIT Pilar', hora: '18:00', completada: false }
    ],
    30: [{ id: 5, rutina: 'Metabólico', lugar: 'Parque (Aire Libre)', hora: '19:00', completada: false }]
  };

  const diasDelMes = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <>
      <div className="h-screen w-screen bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white flex overflow-hidden">
        
        {/* SECCIÓN IZQUIERDA: CALENDARIO */}
        <div className="flex-1 flex flex-col p-8 h-full">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-6">
              <button onClick={() => cambiarVista('lanzador')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-md transition-colors border border-white/10">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </button>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Agosto 2026</h1>
            </div>
          </header>

          <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-4">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(dia => (
              <div key={dia} className="text-gray-500 font-bold text-center tracking-widest uppercase text-sm mb-2">{dia}</div>
            ))}
            {[...Array(5)].map((_, i) => <div key={`empty-${i}`} className="opacity-10"></div>)}
            {diasDelMes.map(dia => {
              const tieneClases = clasesPorDia[dia];
              const esSeleccionado = diaSeleccionado === dia;
              return (
                <div key={dia} onClick={() => setDiaSeleccionado(dia)} className={`relative flex flex-col items-center justify-center rounded-2xl cursor-pointer border transition-all duration-300 ${esSeleccionado ? 'bg-amber-500/20 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}`}>
                  <span className={`text-xl font-bold ${esSeleccionado ? 'text-amber-400' : 'text-gray-300'}`}>{dia}</span>
                  {tieneClases && (
                    <div className="absolute bottom-2 flex gap-1">
                      {tieneClases.map(clase => (
                        <div key={clase.id} className="bg-black/50 p-1 rounded-full shadow-lg" title={clase.lugar}>
                          {iconosLugar[clase.lugar] || <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN DERECHA: PANEL DE DETALLES */}
        <div className="w-[450px] bg-black/40 backdrop-blur-2xl border-l border-white/10 p-8 h-full flex flex-col shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Día {diaSeleccionado}</h2>
          <p className="text-amber-400/80 mb-8 font-medium">Detalle de la jornada</p>

          <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
            {!clasesPorDia[diaSeleccionado] ? (
              <div className="flex flex-col items-center justify-center h-40 opacity-50">
                <svg className="w-12 h-12 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                <p>Día libre. No hay rutinas.</p>
              </div>
            ) : (
              clasesPorDia[diaSeleccionado].map((clase) => (
                <div key={clase.id} className="relative p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3 group hover:border-amber-500/30 transition-colors">
                  {clase.completada && (
                    <div className="absolute -top-3 -right-3 bg-emerald-500 text-black p-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-100">{clase.rutina}</h3>
                    <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded">{clase.hora}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    {iconosLugar[clase.lugar]}
                    <span>{clase.lugar}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors">Ver Rutina</button>
                    {/* Al tocar reutilizar, abrimos el modal */}
                    <button onClick={() => abrirModalReutilizar(clase)} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg ${clase.completada ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:bg-white/10'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                      Reutilizar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button onClick={abrirModalAgendar} className="mt-6 w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex justify-center items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Agendar en Día {diaSeleccionado}
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* VENTANA MODAL (Oculta por defecto) */}
      {/* ========================================== */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          {/* Contenedor del formulario */}
          <div className="bg-gray-900 border border-amber-500/30 rounded-3xl p-8 w-full max-w-md shadow-[0_0_50px_rgba(245,158,11,0.15)] relative transform transition-all">
            
            <h3 className="text-2xl font-bold text-white mb-6">Agendar Rutina</h3>
            
            <form onSubmit={guardarClase} className="flex flex-col gap-5">
              
              {/* Selector de Rutina */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Rutina</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none"
                  value={datosFormulario.rutina}
                  onChange={(e) => setDatosFormulario({...datosFormulario, rutina: e.target.value})}
                >
                  <option className="bg-gray-900">Cross Training Full Body</option>
                  <option className="bg-gray-900">Día de Piernas</option>
                  <option className="bg-gray-900">Fuerza Base</option>
                  <option className="bg-gray-900">Metabólico</option>
                </select>
              </div>

              {/* Fila para Lugar y Hora */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Lugar</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none"
                    value={datosFormulario.lugar}
                    onChange={(e) => setDatosFormulario({...datosFormulario, lugar: e.target.value})}
                  >
                    <option className="bg-gray-900">ON FIT Pilar</option>
                    <option className="bg-gray-900">Parque (Aire Libre)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 w-1/3">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Hora</label>
                  <input 
                    type="time" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    value={datosFormulario.hora}
                    onChange={(e) => setDatosFormulario({...datosFormulario, hora: e.target.value})}
                  />
                </div>
              </div>

              {/* Botones de acción del Modal */}
              <div className="flex gap-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setModalAbierto(false)} 
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl text-white font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all"
                >
                  Guardar Clase
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}