import React, { useState, useEffect } from 'react';

// Diccionario de íconos disponibles
const IconosNeon = {
  Dumbbell: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 14h2M3 10h2M19 14h2M19 10h2M5 14v2a2 2 0 002 2h2V6H7a2 2 0 00-2 2v2M19 14v2a2 2 0 01-2 2h-2V6h2a2 2 0 012 2v2M9 12h6" /></svg>,
  MapPin: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
};
const nombresIconos = ['Dumbbell', 'MapPin', 'User', 'Home'];
const paletaColores = ['text-fuchsia-400', 'text-cyan-400', 'text-emerald-400', 'text-rose-400', 'text-amber-400'];

export default function Agenda({ cambiarVista }) {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [rutinas, setRutinas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [historial, setHistorial] = useState([]);
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date().getDate());
  const [rutinaElegida, setRutinaElegida] = useState('');
  const [sedeElegida, setSedeElegida] = useState('');

  // Estados para crear sede en el momento
  const [creandoSede, setCreandoSede] = useState(false);
  const [nuevaSede, setNuevaSede] = useState({ nombre: '', icono: 'Dumbbell', color: 'text-cyan-400' });

  useEffect(() => {
    setRutinas(JSON.parse(localStorage.getItem('gymos_rutinas')) || []);
    
    // Limpiamos los datos de internet viejos si quedaron, forzando a que usen el mapa
    const sedesGuardadas = JSON.parse(localStorage.getItem('gymos_sedes')) || [];
    const sedesLimpias = sedesGuardadas.map(s => s.tipo === 'internet' ? { ...s, tipo: 'manual', icono: 'MapPin', color: 'text-cyan-400' } : s);
    setSedes(sedesLimpias);
    
    setHistorial(JSON.parse(localStorage.getItem('gymos_historial')) || []);

    // 🧠 MEMORIA DE ESTADO: Restaurar si volvemos de crear una rutina
    const diaGuardado = localStorage.getItem('gymos_agenda_dia');
    if (diaGuardado) {
      const m = parseInt(localStorage.getItem('gymos_agenda_mes'));
      const y = parseInt(localStorage.getItem('gymos_agenda_anio'));
      setFechaActual(new Date(y, m, 1));
      setDiaSeleccionado(parseInt(diaGuardado));
      setModalAbierto(true); // Abrir el modal donde lo dejamos
      
      // Limpiar memoria
      localStorage.removeItem('gymos_agenda_dia');
      localStorage.removeItem('gymos_agenda_mes');
      localStorage.removeItem('gymos_agenda_anio');
    }
  }, []);

  const mesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const cambiarMes = (incremento) => setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + incremento, 1));
  const irAHoy = () => { setFechaActual(new Date()); setDiaSeleccionado(new Date().getDate()); };

  // Buscador de fechas nativo (responsivo)
  const manejarBuscadorNativo = (e) => {
    if (!e.target.value) return;
    const [y, m, d] = e.target.value.split('-');
    setFechaActual(new Date(y, m - 1, 1));
    setDiaSeleccionado(parseInt(d));
  };

  const primerDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay();
  const diasEnElMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();
  const dias = Array(primerDiaDelMes).fill(null).concat([...Array(diasEnElMes).keys()].map(i => i + 1));

  const fechaStringFormato = (dia) => `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
  const obtenerEventosDelDia = (dia) => dia ? historial.filter(h => h.fecha === fechaStringFormato(dia)) : [];

  // Función para guardar el lugar in-situ sin salir del modal
  const guardarSedeInSitu = () => {
    if (!nuevaSede.nombre) return;
    const sedeFinal = { id: `sede_${Date.now()}`, nombre: nuevaSede.nombre, icono: nuevaSede.icono, color: nuevaSede.color, tipo: 'manual' };
    const nuevasSedes = [...sedes, sedeFinal];
    setSedes(nuevasSedes);
    localStorage.setItem('gymos_sedes', JSON.stringify(nuevasSedes));
    
    setSedeElegida(sedeFinal.id); // La deja seleccionada
    setCreandoSede(false); // Cierra el mini-creador
    setNuevaSede({ nombre: '', icono: 'Dumbbell', color: 'text-cyan-400' });
  };

  const confirmarAgendamiento = (e) => {
    e.preventDefault();
    if (!rutinaElegida || !sedeElegida) return;
    const nuevoHistorial = [...historial, { id: `evento_${Date.now()}`, fecha: fechaStringFormato(diaSeleccionado), rutinaId: rutinaElegida, sedeId: sedeElegida }];
    setHistorial(nuevoHistorial);
    localStorage.setItem('gymos_historial', JSON.stringify(nuevoHistorial));
    setModalAbierto(false);
  };

  const eliminarEvento = (id) => {
    const nuevoHistorial = historial.filter(h => h.id !== id);
    setHistorial(nuevoHistorial);
    localStorage.setItem('gymos_historial', JSON.stringify(nuevoHistorial));
  };

  // Función puente para ir a crear rutina guardando el estado
  const irACrearRutina = () => {
    localStorage.setItem('gymos_retorno', 'agenda');
    localStorage.setItem('gymos_agenda_dia', diaSeleccionado);
    localStorage.setItem('gymos_agenda_mes', fechaActual.getMonth());
    localStorage.setItem('gymos_agenda_anio', fechaActual.getFullYear());
    cambiarVista('creadorRutina');
  };

  const renderizarIconoSede = (sedeId) => {
    const sede = sedes.find(s => s.id === sedeId);
    if (!sede) return null;
    const IconoComponente = IconosNeon[sede.icono] || IconosNeon.MapPin;
    return <div className={`${sede.color}`}><IconoComponente /></div>;
  };

  return (
    <div className="min-h-screen w-screen bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black p-4 md:p-8 relative flex flex-col">
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6 shrink-0">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => cambiarVista('lanzador')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors">
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">Agenda</h1>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PANEL IZQUIERDO: CALENDARIO */}
        <div className="lg:col-span-2 bg-black/40 border border-white/10 rounded-[2rem] p-4 md:p-8 backdrop-blur-xl h-fit">
          
          {/* Navegación Infinita y Select Nativo */}
          <div className="flex justify-between items-center mb-8 bg-white/5 p-2 rounded-2xl border border-white/5">
            <button onClick={() => cambiarMes(-1)} className="p-2 md:px-4 text-gray-400 hover:text-cyan-400 transition-colors">{'<'}</button>
            
            <div className="relative cursor-pointer group px-4 py-2">
              <h2 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-center pointer-events-none transition-opacity group-hover:opacity-80">
                {mesNombres[fechaActual.getMonth()]} <span className="text-gray-400 font-medium">{fechaActual.getFullYear()}</span>
              </h2>
              {/* Input de fecha nativo que cubre el texto */}
              <input 
                type="date" 
                onChange={manejarBuscadorNativo}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                title="Toca para abrir buscador de fechas"
              />
            </div>
            
            <button onClick={() => cambiarMes(1)} className="p-2 md:px-4 text-gray-400 hover:text-cyan-400 transition-colors">{'>'}</button>
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-3 mb-3">
            {diasSemana.map(dia => <div key={dia} className="text-center font-bold text-gray-500 uppercase text-[10px] md:text-xs">{dia}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-1 md:gap-3">
            {dias.map((dia, index) => {
              const eventos = obtenerEventosDelDia(dia);
              const seleccionado = dia === diaSeleccionado;
              return (
                <div 
                  key={index} onClick={() => { if(dia) setDiaSeleccionado(dia); }}
                  className={`min-h-[70px] md:min-h-[100px] p-1 md:p-2 rounded-2xl border transition-all flex flex-col cursor-pointer ${dia ? 'bg-white/5 border-white/5 hover:border-cyan-500/50' : 'opacity-0'} ${seleccionado ? 'ring-2 ring-cyan-500 bg-cyan-500/10' : ''}`}
                >
                  {dia && (
                    <>
                      <span className={`text-sm md:text-lg font-black mb-1 text-center md:text-left ${seleccionado ? 'text-cyan-400' : 'text-gray-400'}`}>{dia}</span>
                      <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar items-center md:items-start">
                        {eventos.map(ev => (
                          <div key={ev.id} className="bg-black/40 p-1 md:p-1.5 rounded-lg border border-white/5">
                            {renderizarIconoSede(ev.sedeId)}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL DERECHO: RESUMEN DEL DÍA */}
        <div className="bg-black/30 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md flex flex-col h-[500px] lg:h-[600px]">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
            <h3 className="text-gray-400 uppercase tracking-widest text-sm font-bold">
              Resumen: {diaSeleccionado} {mesNombres[fechaActual.getMonth()]}
            </h3>
            <button onClick={irAHoy} className="px-3 py-1 bg-white/5 text-cyan-400 text-xs font-bold rounded-lg border border-cyan-500/30">Hoy</button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
            {obtenerEventosDelDia(diaSeleccionado).length === 0 ? (
              <p className="text-gray-600 italic text-sm text-center mt-10">Día libre. No hay rutinas agendadas.</p>
            ) : (
              obtenerEventosDelDia(diaSeleccionado).map(evento => {
                const rutina = rutinas.find(r => r.id === evento.rutinaId);
                const sede = sedes.find(s => s.id === evento.sedeId);
                return (
                  <div key={evento.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 relative group">
                    <div className="flex items-center gap-3 mb-2">
                      {renderizarIconoSede(evento.sedeId)}
                      <span className="text-sm font-bold text-cyan-400">{sede ? sede.nombre : 'Sede borrada'}</span>
                    </div>
                    <span className="text-white font-medium block">{rutina ? rutina.nombre : 'Rutina borrada'}</span>
                    <button onClick={() => eliminarEvento(evento.id)} className="absolute top-4 right-4 text-gray-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <button onClick={() => setModalAbierto(true)} className="mt-4 w-full py-4 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 rounded-xl font-bold text-cyan-400 transition-all">
            + Agendar Rutina
          </button>
        </div>
      </div>

      {/* MODAL DE AGENDAMIENTO (Responsivo) */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-[0_0_50px_rgba(34,211,238,0.1)] relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModalAbierto(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Nueva Clase</h2>
            
            <form onSubmit={confirmarAgendamiento} className="flex flex-col gap-6">
              
              {/* Sección Rutina */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">1. Elegir Rutina</label>
                <div className="flex gap-2">
                  <select value={rutinaElegida} onChange={(e) => setRutinaElegida(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 appearance-none outline-none">
                    <option value="">Seleccionar de biblioteca...</option>
                    {rutinas.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                  </select>
                  <button type="button" onClick={irACrearRutina} className="px-4 bg-white/5 border border-white/10 rounded-xl text-cyan-400" title="Crear nueva">+</button>
                </div>
              </div>
              
              {/* Sección Espacio de Trabajo */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">2. Lugar / Sede</label>
                
                {creandoSede ? (
                  <div className="bg-black/40 border border-white/10 rounded-xl p-4 mt-2">
                    <input type="text" placeholder="Ej: Gym Central, Plaza..." value={nuevaSede.nombre} onChange={e => setNuevaSede({...nuevaSede, nombre: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm mb-4 outline-none focus:border-cyan-500" />
                    
                    <div className="flex gap-2 mb-3">
                       {nombresIconos.map(i => (
                         <button key={i} type="button" onClick={() => setNuevaSede({...nuevaSede, icono: i})} className={`p-2 rounded-lg border ${nuevaSede.icono === i ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'border-transparent text-gray-500'}`}>
                           {React.createElement(IconosNeon[i])}
                         </button>
                       ))}
                    </div>
                    
                    <div className="flex gap-3 mb-5">
                       {paletaColores.map(c => (
                         <button key={c} type="button" onClick={() => setNuevaSede({...nuevaSede, color: c})} className={`w-6 h-6 rounded-full bg-current ${c} ${nuevaSede.color === c ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white' : 'opacity-50'}`}></button>
                       ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setCreandoSede(false)} className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-bold transition-colors">Cancelar</button>
                      <button type="button" onClick={guardarSedeInSitu} disabled={!nuevaSede.nombre} className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 rounded-lg text-white text-sm font-bold transition-colors">Guardar y Elegir</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <select value={sedeElegida} onChange={(e) => setSedeElegida(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 appearance-none outline-none">
                      <option value="">¿Dónde se dicta?</option>
                      {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                    </select>
                    <button type="button" onClick={() => setCreandoSede(true)} className="px-4 bg-white/5 border border-white/10 rounded-xl text-fuchsia-400" title="Crear nueva sede">+</button>
                  </div>
                )}
              </div>

              <button type="submit" disabled={!rutinaElegida || !sedeElegida || creandoSede} className="mt-2 w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 rounded-xl font-bold text-white transition-all">Confirmar en Agenda</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}