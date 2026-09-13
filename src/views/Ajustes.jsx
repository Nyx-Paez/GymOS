import React, { useState, useEffect } from 'react';

export default function Ajustes({ cambiarVista }) {
  const [zoom, setZoom] = useState('normal');
  const [tema, setTema] = useState('cyberpunk');
  const [sugerencia, setSugerencia] = useState('');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const zoomGuardado = localStorage.getItem('furia_zoom') || 'normal';
    const temaGuardado = localStorage.getItem('furia_tema') || 'cyberpunk';
    setZoom(zoomGuardado);
    setTema(temaGuardado);
  }, []);

  const cambiarZoom = (nuevoZoom) => {
    setZoom(nuevoZoom);
    localStorage.setItem('furia_zoom', nuevoZoom);
    // Aplicar escala global al body si se desea
    if (nuevoZoom === 'compacto') document.documentElement.style.fontSize = '14px';
    else if (nuevoZoom === 'grande') document.documentElement.style.fontSize = '18px';
    else document.documentElement.style.fontSize = '16px';
  };

  const cambiarTema = (nuevoTema) => {
    setTema(nuevoTema);
    localStorage.setItem('furia_tema', nuevoTema);
  };

  const enviarSugerencia = (e) => {
    e.preventDefault();
    if (!sugerencia.trim()) return;

    const listaSugerencias = JSON.parse(localStorage.getItem('furia_sugerencias')) || [];
    listaSugerencias.push({ texto: sugerencia, fecha: new Date().toISOString() });
    localStorage.setItem('furia_sugerencias', JSON.stringify(listaSugerencias));

    setSugerencia('');
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black p-4 md:p-8 text-white">
      
      {/* HEADER */}
      <header className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6 max-w-4xl mx-auto">
        <button onClick={() => cambiarVista('lanzador')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 shrink-0">
          <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="overflow-hidden">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-300 to-gray-400 bg-clip-text text-transparent truncate">Ajustes del Sistema</h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1 truncate">Personaliza la visualización de la app.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-8 pb-12">
        
        {/* SECCIÓN 1: TAMAÑO DE TEXTO / ZOOM */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-cyan-400 mb-4">Escala de Visualización (Zoom)</h2>
          <p className="text-gray-400 text-sm mb-4">Ajusta el tamaño general de los elementos para mayor comodidad en tu celular o tablet.</p>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'compacto', label: 'Compacto (Más info)' },
              { id: 'normal', label: 'Normal (Estándar)' },
              { id: 'grande', label: 'Grande (Mayor visibilidad)' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => cambiarZoom(item.id)}
                className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${zoom === item.id ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {/* SECCIÓN 2: TEMAS DE COLOR */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-fuchsia-400 mb-4">Temas de Interfaz</h2>
          <p className="text-gray-400 text-sm mb-4">Elige la paleta cromática principal de FuriaGymPlanner.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'cyberpunk', nombre: 'Cyber Neon (Actual)', desc: 'Cyan, fucsia y fondos oscuros profundos', color: 'from-cyan-500 to-fuchsia-600' },
              { id: 'minimal', nombre: 'Midnight Minimal', desc: 'Tonos grises limpios y profesionales', color: 'from-slate-600 to-gray-800' },
              { id: 'energetico', nombre: 'Furia Amber', desc: 'Naranjas y ámbar de alta energía', color: 'from-amber-500 to-rose-600' },
            ].map(t => (
              <div
                key={t.id}
                onClick={() => cambiarTema(t.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${tema === t.id ? 'border-white/50 bg-white/10 shadow-lg' : 'border-white/10 bg-black/40 opacity-70 hover:opacity-100'}`}
              >
                <div>
                  <div className={`w-full h-3 rounded-full bg-gradient-to-r ${t.color} mb-3`}></div>
                  <h3 className="font-bold text-white text-sm">{t.nombre}</h3>
                  <p className="text-gray-400 text-xs mt-1">{t.desc}</p>
                </div>
                {tema === t.id && <span className="text-[10px] uppercase font-bold text-cyan-400 mt-4 tracking-wider">● Activo</span>}
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN 3: SUGERENCIAS Y COMENTARIOS */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-amber-400 mb-2">Comentarios y Sugerencias</h2>
          <p className="text-gray-400 text-sm mb-4">¿Se te ocurrió una función nueva o detectaste algo que mejorar? Anótalo aquí.</p>
          
          <form onSubmit={enviarSugerencia} className="space-y-4">
            <textarea
              rows="4"
              value={sugerencia}
              onChange={e => setSugerencia(e.target.value)}
              placeholder="Escribe tu idea, mejora o reporte de error..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 text-sm resize-none"
            ></textarea>
            
            <div className="flex justify-between items-center">
              {enviado ? (
                <span className="text-emerald-400 text-xs font-bold animate-pulse">¡Sugerencia guardada con éxito en el sistema!</span>
              ) : <span></span>}
              <button
                type="submit"
                disabled={!sugerencia.trim()}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl font-bold transition-all text-sm shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                Guardar Sugerencia
              </button>
            </div>
          </form>
        </section>

      </main>
    </div>
  );
}