import React, { useState, useEffect } from 'react';

export default function Agenda({ cambiarVista }) {
  // Leemos la memoria ANTES de que se dibuje la pantalla por primera vez
  const recuperarFecha = () => {
    const guardada = localStorage.getItem('gymos_agenda_fecha');
    return guardada ? new Date(guardada) : new Date();
  };

  const [fechaActual, setFechaActual] = useState(recuperarFecha);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(recuperarFecha);
  
  // Bases de datos
  const [rutinas, setRutinas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [historial, setHistorial] = useState([]);

  // Estados del Modal (lee la memoria directamente para no parpadear)
  const [modalAbierto, setModalAbierto] = useState(() => localStorage.getItem('gymos_agenda_abierto') === 'true');
  const [modoEdicion, setModoEdicion] = useState(false); // NUEVO: Para saber si estamos editando
  const [claseEnEdicion, setClaseEnEdicion] = useState({ id: null, rutinaId: '', sedeId: '' }); // NUEVO: Datos temporales

  // Cargar bases de datos al iniciar
  useEffect(() => {
    setRutinas(JSON.parse(localStorage.getItem('gymos_rutinas')) || []);
    setSedes(JSON.parse(localStorage.getItem('gymos_sedes')) || []);
    setHistorial(JSON.parse(localStorage.getItem('gymos_historial')) || []);

    // Limpiamos la memoria para la próxima vez
    localStorage.removeItem('gymos_agenda_fecha');
    localStorage.removeItem('gymos_agenda_abierto');
  }, []);

  // --- Helpers del Calendario ---
  const diasMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();
  const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay();
  
  const formatearFecha = (fecha) => {
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
  };

  const cambiarMes = (direccion) => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + direccion, 1));
  };

  const fechaStringSeleccionada = formatearFecha(fechaSeleccionada);
  const clasesDelDia = historial.filter(h => h.fecha === fechaStringSeleccionada);

  // --- Funciones de Guardado, Edición y Borrado ---
  const abrirParaAgendar = () => {
    setModoEdicion(false);
    setClaseEnEdicion({ id: null, rutinaId: '', sedeId: '' });
    setModalAbierto(true);
  };

  const abrirParaEditar = (clase) => {
    setModoEdicion(true);
    setClaseEnEdicion(clase);
    setModalAbierto(true);
  };

  const guardarClase = (e) => {
    e.preventDefault();
    if (!claseEnEdicion.rutinaId || !claseEnEdicion.sedeId) return alert("Seleccioná una rutina y un lugar");

    let nuevoHistorial;

    if (modoEdicion) {
      // Si estamos editando, buscamos la clase por ID y la pisamos
      nuevoHistorial = historial.map(h => 
        h.id === claseEnEdicion.id 
          ? { ...h, rutinaId: claseEnEdicion.rutinaId, sedeId: claseEnEdicion.sedeId } 
          : h
      );
    } else {
      // Si es nueva, la creamos
      const claseAGuardar = {
        id: `clase_${Date.now()}`,
        fecha: fechaStringSeleccionada,
        rutinaId: claseEnEdicion.rutinaId,
        sedeId: claseEnEdicion.sedeId
      };
      nuevoHistorial = [...historial, claseAGuardar];
    }

    setHistorial(nuevoHistorial);
    localStorage.setItem('gymos_historial', JSON.stringify(nuevoHistorial));
    
    setModalAbierto(false);
    setClaseEnEdicion({ id: null, rutinaId: '', sedeId: '' });
  };

  const eliminarClase = (idClase) => {
    if (window.confirm("¿Seguro que querés cancelar y borrar esta clase de la agenda?")) {
      const nuevoHistorial = historial.filter(h => h.id !== idClase);
      setHistorial(nuevoHistorial);
      localStorage.setItem('gymos_historial', JSON.stringify(nuevoHistorial));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black overflow-x-hidden p-4 md:p-8">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 border-b border-white/10 pb-4 md:pb-6 gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 md:gap-6 w-full">
          <button onClick={() => cambiarVista('lanzador')} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 shrink-0">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Mi Agenda</h1>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto">
        
        {/* PANEL IZQUIERDO: CALENDARIO */}
        <div className="w-full lg:w-2/3 bg-white/5 border border-white/10 rounded-[2rem] p-4 md:p-8 backdrop-blur-sm">
          
          <div className="flex justify-between items-center mb-8 bg-black/40 rounded-xl p-2 border border-white/5">
            <button onClick={() => cambiarMes(-1)} className="p-2 md:p-3 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="text-lg md:text-2xl font-bold text-white capitalize">
              {fechaActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={() => cambiarMes(1)} className="p-2 md:p-3 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center">
            {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(dia => (
              <div key={dia} className="text-[10px] md:text-xs font-bold text-gray-500">{dia}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {Array.from({ length: primerDiaMes }).map((_, i) => <div key={`empty-${i}`} />)}
            
            {Array.from({ length: diasMes }).map((_, i) => {
              const dia = i + 1;
              const fechaIterada = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), dia);
              const fechaString = formatearFecha(fechaIterada);
              const esHoy = formatearFecha(new Date()) === fechaString;
              const estaSeleccionado = fechaStringSeleccionada === fechaString;
              
              const clasesHoy = historial.filter(h => h.fecha === fechaString);

              return (
                <div 
                  key={dia} 
                  onClick={() => setFechaSeleccionada(fechaIterada)}
                  className={`aspect-square rounded-xl md:rounded-2xl flex flex-col p-1 md:p-2 cursor-pointer transition-all border relative
                    ${estaSeleccionado ? 'bg-cyan-500/10 border-cyan-500' : 'bg-black/40 border-white/5 hover:border-white/20'}
                  `}
                >
                  <span className={`text-xs md:text-sm font-bold ${esHoy ? 'text-cyan-400' : (estaSeleccionado ? 'text-white' : 'text-gray-400')}`}>
                    {dia}
                  </span>
                  
                  <div className="flex-1 flex items-end justify-center gap-1 pb-1">
                    {clasesHoy.slice(0,3).map(clase => {
                      const sede = sedes.find(s => s.id === clase.sedeId);
                      return sede ? (
                         <div key={clase.id} className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${sede.color}`} title={sede.nombre}></div>
                      ) : null;
                    })}
                    {clasesHoy.length > 3 && <span className="text-[8px] text-gray-400 font-bold">+{clasesHoy.length - 3}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL DERECHO: RESUMEN DEL DÍA */}
        <div className="w-full lg:w-1/3 bg-black/20 border border-white/5 rounded-[2rem] p-6 backdrop-blur-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Resumen: {fechaSeleccionada.getDate()} {fechaSeleccionada.toLocaleDateString('es-ES', { month: 'long' })}
            </h3>
            {formatearFecha(new Date()) === fechaStringSeleccionada && (
              <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-2 py-1 rounded uppercase">Hoy</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 no-scrollbar flex flex-col gap-3">
            {clasesDelDia.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/5 rounded-2xl p-6 text-center">
                <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-sm">Día libre.<br/>No hay clases agendadas.</p>
              </div>
            ) : (
              clasesDelDia.map(clase => {
                const rutinaAsociada = rutinas.find(r => r.id === clase.rutinaId);
                const sedeAsociada = sedes.find(s => s.id === clase.sedeId);
                
                return (
                  <div key={clase.id} className="bg-white/5 border border-white/10 rounded-xl p-4 relative group hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${sedeAsociada ? sedeAsociada.color : 'bg-gray-800'}`}>
                        {sedeAsociada ? sedeAsociada.icono : '❓'}
                      </div>
                      <div className="flex-1 min-w-0 pr-12">
                        <p className="text-sm text-cyan-400 font-bold truncate">
                          {sedeAsociada ? sedeAsociada.nombre : 'Lugar desconocido'}
                        </p>
                        <p className="text-white font-bold truncate">
                          {rutinaAsociada ? rutinaAsociada.nombre : 'Rutina eliminada'}
                        </p>
                      </div>
                    </div>

                    {/* BOTONERA FLOTANTE: Editar y Eliminar */}
                    <div className="absolute top-4 right-4 flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => abrirParaEditar(clase)}
                        className="text-gray-400 hover:text-cyan-400 bg-black/40 p-1.5 rounded-lg border border-transparent hover:border-cyan-500/30"
                        title="Modificar clase"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button 
                        onClick={() => eliminarClase(clase.id)}
                        className="text-gray-400 hover:text-rose-500 bg-black/40 p-1.5 rounded-lg border border-transparent hover:border-rose-500/30"
                        title="Cancelar clase"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button 
              onClick={abrirParaAgendar}
              className="w-full py-4 border border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)]"
            >
              + Agendar Clase
            </button>
            <button 
              onClick={() => { localStorage.setItem('gymos_retorno', 'agenda'); cambiarVista('gestorSedes'); }}
              className="w-full py-3 border border-white/5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              Gestionar Lugares y Clientes
            </button>
          </div>
        </div>
      </div>

      {/* MODAL PARA AGENDAR / EDITAR */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form onSubmit={guardarClase} className="bg-gray-900 border border-cyan-500/30 rounded-[2rem] p-6 md:p-8 w-full max-w-md flex flex-col shadow-[0_0_50px_rgba(34,211,238,0.1)] relative">
            <button type="button" onClick={() => setModalAbierto(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <h2 className="text-xl md:text-2xl font-bold text-cyan-400 mb-6">
              {modoEdicion ? 'Modificar Clase' : `Agendar para el ${fechaSeleccionada.getDate()}`}
            </h2>

            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">1. Elegir Rutina</label>
                {/* BOTÓN INTELIGENTE: Memoriza y va al creador */}
                <button type="button" onClick={() => { localStorage.setItem('gymos_retorno', 'agenda'); localStorage.setItem('gymos_agenda_fecha', fechaSeleccionada.toISOString()); localStorage.setItem('gymos_agenda_abierto', 'true'); cambiarVista('creadorRutina'); }} className="text-xs text-fuchsia-400 font-bold hover:underline bg-fuchsia-500/10 px-2 py-1 rounded">
                  + Crear Nueva
                </button>
              </div>
              <select 
                required 
                value={claseEnEdicion.rutinaId} 
                onChange={e => setClaseEnEdicion({...claseEnEdicion, rutinaId: e.target.value})} 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="" disabled>Seleccionar de biblioteca...</option>
                {rutinas.map(rutina => (
                  <option key={rutina.id} value={rutina.id}>{rutina.nombre}</option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">2. Lugar / Cliente</label>
                {/* BOTÓN INTELIGENTE: Memoriza y va al gestor */}
                <button type="button" onClick={() => { localStorage.setItem('gymos_retorno', 'agenda'); localStorage.setItem('gymos_agenda_fecha', fechaSeleccionada.toISOString()); localStorage.setItem('gymos_agenda_abierto', 'true'); cambiarVista('gestorSedes'); }} className="text-xs text-cyan-400 font-bold hover:underline bg-cyan-500/10 px-2 py-1 rounded">
                  + Crear Nuevo
                </button>
              </div>
              <select 
                required 
                value={claseEnEdicion.sedeId} 
                onChange={e => setClaseEnEdicion({...claseEnEdicion, sedeId: e.target.value})} 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="" disabled>Seleccionar de contactos...</option>
                {sedes.map(sede => (
                  <option key={sede.id} value={sede.id}>{sede.icono} {sede.nombre}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              disabled={!claseEnEdicion.rutinaId || !claseEnEdicion.sedeId}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] disabled:shadow-none"
            >
              {modoEdicion ? 'Actualizar Clase' : 'Confirmar en Agenda'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}