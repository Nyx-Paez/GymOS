import React, { useState, useEffect } from 'react';

export default function GestorSedes({ cambiarVista }) {
  const [sedes, setSedes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  
  const [nuevaSede, setNuevaSede] = useState({
    id: null,
    nombre: '',
    tipo: 'lugar',
    icono: '📍',
    color: 'bg-cyan-500'
  });

  // Opciones de personalización
  const opcionesIconos = ['📍', '🌳', '🏡', '🏋️', '🏃', '💻', '👥', '⭐'];
  const opcionesColores = [
    { bg: 'bg-cyan-500', name: 'Cyan' },
    { bg: 'bg-fuchsia-500', name: 'Fucsia' },
    { bg: 'bg-emerald-500', name: 'Verde' },
    { bg: 'bg-amber-500', name: 'Naranja' },
    { bg: 'bg-rose-500', name: 'Rojo' },
    { bg: 'bg-indigo-500', name: 'Índigo' }
  ];

  // Cargar sedes al iniciar
  useEffect(() => {
    const sedesGuardadas = JSON.parse(localStorage.getItem('gymos_sedes')) || [];
    setSedes(sedesGuardadas);
  }, []);

  // Guardar o Actualizar Sede
  const guardarSede = (e) => {
    e.preventDefault();
    if (!nuevaSede.nombre.trim()) return;

    let listaActualizada;
    if (modoEdicion) {
      listaActualizada = sedes.map(s => s.id === nuevaSede.id ? nuevaSede : s);
    } else {
      const sedeParaGuardar = { ...nuevaSede, id: `sede_${Date.now()}` };
      listaActualizada = [...sedes, sedeParaGuardar];
    }

    setSedes(listaActualizada);
    localStorage.setItem('gymos_sedes', JSON.stringify(listaActualizada));
    cerrarModal();
  };

  const eliminarSede = (id) => {
    if (window.confirm('¿Seguro que querés eliminar este espacio/cliente? Desaparecerá de tu agenda.')) {
      const listaActualizada = sedes.filter(s => s.id !== id);
      setSedes(listaActualizada);
      localStorage.setItem('gymos_sedes', JSON.stringify(listaActualizada));
    }
  };

  const abrirParaEditar = (sede) => {
    setNuevaSede(sede);
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setNuevaSede({ id: null, nombre: '', tipo: 'lugar', icono: '📍', color: 'bg-cyan-500' });
  };

  const volverAtras = () => {
    const retorno = localStorage.getItem('gymos_retorno') || 'lanzador';
    localStorage.removeItem('gymos_retorno'); // Limpiamos la memoria
    cambiarVista(retorno);
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black overflow-x-hidden p-4 md:p-8">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 border-b border-white/10 pb-4 md:pb-6 gap-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 md:gap-6 w-full">
          <button onClick={volverAtras} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 shrink-0">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent truncate">Lugares y Clientes</h1>
        </div>
        <button onClick={() => setModalAbierto(true)} className="px-6 py-3 border border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] text-sm md:text-base shrink-0 self-start md:self-auto">
          + Nuevo Contacto
        </button>
      </header>

      {/* GRILLA DE SEDES/CLIENTES */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {sedes.length === 0 ? (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-white/10 rounded-2xl">
            <p className="text-gray-500 text-lg mb-2">No tenés lugares ni clientes registrados.</p>
            <p className="text-gray-600 text-sm">Creá uno para poder agendar clases.</p>
          </div>
        ) : (
          sedes.map(sede => (
            <div key={sede.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between group hover:border-cyan-500/50 transition-all">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${sede.color} shadow-lg`}>
                  {sede.icono}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-white font-bold text-lg truncate pr-2">{sede.nombre}</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">
                    {sede.tipo === 'lugar' ? 'Ubicación Física' : sede.tipo === 'persona' ? 'Alumno/a' : 'Clase Online'}
                  </span>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex flex-col gap-2 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button onClick={() => abrirParaEditar(sede)} className="text-gray-500 hover:text-cyan-400 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button onClick={() => eliminarSede(sede.id)} className="text-gray-500 hover:text-rose-500 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form onSubmit={guardarSede} className="bg-gray-900 border border-cyan-500/30 rounded-[2rem] p-6 md:p-8 w-full max-w-md flex flex-col shadow-[0_0_50px_rgba(34,211,238,0.1)] relative">
            <button type="button" onClick={cerrarModal} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="text-2xl font-bold text-cyan-400 mb-6">{modoEdicion ? 'Editar Contacto' : 'Nuevo Contacto'}</h2>

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Nombre del Lugar / Alumno</label>
              <input type="text" required placeholder="Ej: Parque San Martín, Juan Pérez..." value={nuevaSede.nombre} onChange={e => setNuevaSede({...nuevaSede, nombre: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500" />
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Tipo</label>
              <select value={nuevaSede.tipo} onChange={e => setNuevaSede({...nuevaSede, tipo: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500">
                <option value="lugar">Ubicación Física (Plaza, Gym)</option>
                <option value="persona">Alumno/a Particular</option>
                <option value="online">Clase Online (Zoom/Meet)</option>
              </select>
            </div>

            {/* Selector de Íconos */}
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Ícono</label>
              <div className="flex flex-wrap gap-2">
                {opcionesIconos.map(icono => (
                  <button key={icono} type="button" onClick={() => setNuevaSede({...nuevaSede, icono})} className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${nuevaSede.icono === icono ? 'bg-white/20 scale-110 border border-white/40' : 'bg-black/40 hover:bg-white/10 border border-transparent'}`}>
                    {icono}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Colores */}
            <div className="mb-8">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Color Distintivo</label>
              <div className="flex flex-wrap gap-3">
                {opcionesColores.map(color => (
                  <button key={color.bg} type="button" onClick={() => setNuevaSede({...nuevaSede, color: color.bg})} className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${color.bg} ${nuevaSede.color === color.bg ? 'ring-4 ring-white/30 scale-110' : 'opacity-70 hover:opacity-100'}`}>
                    {nuevaSede.color === color.bg && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              {modoEdicion ? 'Actualizar Datos' : 'Guardar en Directorio'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}