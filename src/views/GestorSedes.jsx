import React, { useState, useEffect } from 'react';

export default function GestorSedes({ cambiarVista }) {
  const [sedes, setSedes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [buscando, setBuscando] = useState(false);

  // Estados para la creación manual
  const [modoManual, setModoManual] = useState(false);
  const [nombreManual, setNombreManual] = useState('');
  const [iconoSeleccionado, setIconoSeleccionado] = useState('🏋️');
  const [colorSeleccionado, setColorSeleccionado] = useState('bg-fuchsia-500');

  const iconosGenericos = ['🏋️', '🌳', '🏠', '👤', '🥊', '🏃', '🚴', '🧘'];
  const coloresGenericos = ['bg-fuchsia-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-500'];

  useEffect(() => {
    const sedesGuardadas = JSON.parse(localStorage.getItem('gymos_sedes')) || [];
    setSedes(sedesGuardadas);
  }, []);

  // Función para buscar logos reales en internet (API de Clearbit)
  const buscarLugar = async (query) => {
    setBusqueda(query);
    if (query.length < 3) {
      setResultadosBusqueda([]);
      return;
    }
    
    setBuscando(true);
    try {
      const response = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`);
      const data = await response.json();
      setResultadosBusqueda(data);
    } catch (error) {
      console.error("Error buscando:", error);
    }
    setBuscando(false);
  };

  const guardarSede = (nuevaSede) => {
    const nuevasSedes = [...sedes, { ...nuevaSede, id: `sede_${Date.now()}` }];
    setSedes(nuevasSedes);
    localStorage.setItem('gymos_sedes', JSON.stringify(nuevasSedes));
    
    // Limpiar estados
    setBusqueda('');
    setResultadosBusqueda([]);
    setModoManual(false);
    setNombreManual('');
  };

  const agregarDesdeInternet = (lugar) => {
    guardarSede({
      nombre: lugar.name,
      logo: lugar.logo, // URL de la imagen real
      tipo: 'internet',
      color: 'bg-gray-800' // Fondo por defecto si la imagen falla
    });
  };

  const agregarManual = (e) => {
    e.preventDefault();
    if (!nombreManual) return;
    
    guardarSede({
      nombre: nombreManual,
      icono: iconoSeleccionado,
      tipo: 'manual',
      color: colorSeleccionado
    });
  };

  const eliminarSede = (id) => {
    const nuevas = sedes.filter(s => s.id !== id);
    setSedes(nuevas);
    localStorage.setItem('gymos_sedes', JSON.stringify(nuevas));
  };

  return (
    <div className="min-h-screen w-screen bg-gray-900 p-8 overflow-y-auto">
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-6">
          <button onClick={() => cambiarVista('lanzador')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="text-3xl font-bold text-white">Gestor de Espacios</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PANEL IZQUIERDO: Buscador y Creador */}
        <div className="bg-black/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md h-fit">
          <h2 className="text-xl font-bold text-gray-200 mb-6">Agregar Nuevo Lugar</h2>
          
          {/* BUSCADOR DE INTERNET */}
          <div className="mb-6">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Buscar en Internet (Logos Reales)</label>
            <input 
              type="text" 
              placeholder="Ej: Megatlon, SportClub, Smart Fit..." 
              value={busqueda}
              onChange={(e) => buscarLugar(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
            
            {/* Resultados de Internet */}
            {buscando && <p className="text-amber-400 text-sm mt-2">Buscando en la red...</p>}
            {resultadosBusqueda.length > 0 && (
              <div className="mt-2 bg-gray-800 rounded-xl border border-white/10 overflow-hidden">
                {resultadosBusqueda.map((resultado, i) => (
                  <button 
                    key={i}
                    onClick={() => agregarDesdeInternet(resultado)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left"
                  >
                    <img src={resultado.logo} alt="logo" className="w-8 h-8 rounded bg-white object-contain p-1" onError={(e) => e.target.style.display = 'none'} />
                    <span className="text-white font-medium">{resultado.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-500 text-sm font-bold uppercase">O si no lo encontrás</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* CREADOR MANUAL */}
          {!modoManual ? (
            <button 
              onClick={() => setModoManual(true)}
              className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 font-bold border border-dashed border-white/20 transition-colors"
            >
              + Crear Lugar Personalizado (Alumnos, Parques)
            </button>
          ) : (
            <form onSubmit={agregarManual} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <input 
                type="text" 
                placeholder="Nombre del lugar o persona..." 
                value={nombreManual}
                onChange={(e) => setNombreManual(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white mb-4"
              />
              
              <div className="mb-4">
                <span className="text-xs text-gray-400 block mb-2">Elegí un ícono:</span>
                <div className="flex gap-2 flex-wrap">
                  {iconosGenericos.map(icono => (
                    <button type="button" key={icono} onClick={() => setIconoSeleccionado(icono)} className={`text-2xl p-2 rounded-lg ${iconoSeleccionado === icono ? 'bg-amber-500/20 border border-amber-500' : 'bg-black/30 border border-transparent'}`}>{icono}</button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <span className="text-xs text-gray-400 block mb-2">Elegí un color identificador:</span>
                <div className="flex gap-2">
                  {coloresGenericos.map(color => (
                    <button type="button" key={color} onClick={() => setColorSeleccionado(color)} className={`w-8 h-8 rounded-full ${color} ${colorSeleccionado === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : 'opacity-50'}`}></button>
                  ))}
                </div>
              </div>

              <button onClick={() => {
    const retorno = localStorage.getItem('gymos_retorno');
    if (retorno) {
      localStorage.removeItem('gymos_retorno');
      cambiarVista(retorno);
    } else {
      cambiarVista('lanzador');
    }
}} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"></button>
            </form>
          )}
        </div>

        {/* PANEL DERECHO: Tus Sedes Guardadas */}
        <div className="bg-black/20 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-gray-500 uppercase tracking-wider mb-6 border-b border-white/10 pb-2">Tus Espacios Guardados</h2>
          
          {sedes.length === 0 ? (
            <p className="text-gray-600 italic">Todavía no agregaste ningún lugar. Usá el buscador o el creador de la izquierda.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sedes.map((sede) => (
                <div key={sede.id} className="relative group flex items-center gap-4 bg-white/5 border border-white/5 p-3 rounded-2xl">
                  {/* Renderizamos el Logo si es de internet, o el Ícono+Color si es manual */}
                  {sede.tipo === 'internet' ? (
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 shrink-0">
                      <img src={sede.logo} alt={sede.nombre} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 ${sede.color} rounded-xl flex items-center justify-center shrink-0 shadow-lg`}>
                      <span className="text-2xl">{sede.icono}</span>
                    </div>
                  )}
                  
                  <span className="text-white font-bold truncate pr-8">{sede.nombre}</span>

                  <button 
                    onClick={() => eliminarSede(sede.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-gray-400 hover:text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}