import React from 'react';

export default function PostIt({ etapa }) {
  if (!etapa) return null;

  // Función mágica para asignar colores según el nombre de la modalidad
  const getColor = (modalidad) => {
    const mod = modalidad?.toLowerCase() || '';
    if (mod.includes('fuerza')) return { bg: 'bg-fuchsia-900/40', border: 'border-fuchsia-500/30', badge: 'bg-fuchsia-500 text-black', text: 'text-fuchsia-400' };
    if (mod.includes('amrap')) return { bg: 'bg-cyan-900/40', border: 'border-cyan-500/30', badge: 'bg-cyan-500 text-black', text: 'text-cyan-400' };
    if (mod.includes('emom')) return { bg: 'bg-amber-900/40', border: 'border-amber-500/30', badge: 'bg-amber-500 text-black', text: 'text-amber-400' };
    if (mod.includes('tabata')) return { bg: 'bg-rose-900/40', border: 'border-rose-500/30', badge: 'bg-rose-500 text-black', text: 'text-rose-400' };
    if (mod.includes('calor')) return { bg: 'bg-emerald-900/40', border: 'border-emerald-500/30', badge: 'bg-emerald-500 text-black', text: 'text-emerald-400' };
    if (mod.includes('elongación') || mod.includes('elongacion')) return { bg: 'bg-indigo-900/40', border: 'border-indigo-500/30', badge: 'bg-indigo-400 text-black', text: 'text-indigo-400' };
    
    // Color por defecto para las nuevas categorías que agregues vos
    return { bg: 'bg-slate-800/60', border: 'border-slate-500/30', badge: 'bg-slate-400 text-black', text: 'text-slate-300' };
  };

  const colores = getColor(etapa.modalidad);

  return (
    <div className={`${colores.bg} border ${colores.border} rounded-2xl p-4 shadow-lg w-full flex flex-col h-full min-h-[160px]`}>
      
      {/* Cabecera del PostIt */}
      <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-2">
        <span className={`${colores.badge} text-[10px] sm:text-xs font-black px-2 py-1 rounded uppercase tracking-widest truncate max-w-[70%]`}>
          {etapa.modalidad}
        </span>
        <span className={`${colores.text} font-black text-lg sm:text-xl shrink-0`}>
          {etapa.duracionMinutos}'
        </span>
      </div>

      {/* Lista de Ejercicios */}
      <div className="flex-1 flex flex-col gap-2">
        {etapa.listaEjercicios && etapa.listaEjercicios.map((item, index) => {
          
          // Renderizado de Ejercicio Simple
          if (item.tipo === 'simple') {
            return (
              <div key={index} className="flex justify-between items-center">
                <span className="text-white text-sm font-medium leading-tight">{item.ejercicio.nombre}</span>
                <span className={`${colores.text} font-mono text-sm ml-2 font-bold shrink-0`}>{item.ejercicio.cantidad}</span>
              </div>
            );
          } 
          
          // Renderizado de Superset / Complex
          else if (item.tipo === 'combinado') {
            return (
              <div key={index} className="flex flex-col bg-black/40 p-2 rounded-lg border border-white/5 mt-1 mb-1">
                <div className="flex flex-wrap gap-1 items-center">
                  {item.ejercicios.map((ej, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className={`${colores.text} font-bold text-xs`}>+</span>}
                      <span className="text-gray-200 text-sm leading-tight">{ej}</span>
                    </React.Fragment>
                  ))}
                </div>
                <div className="text-right mt-1">
                  <span className={`${colores.text} font-mono text-sm font-bold bg-white/5 px-2 py-0.5 rounded`}>
                    {item.cantidad}
                  </span>
                </div>
              </div>
            );
          }

          // Fallback de seguridad
          return (
            <div key={index} className="flex justify-between items-center">
              <span className="text-white text-sm font-medium">{item.nombre || item}</span>
            </div>
          );
        })}
      </div>

      {/* Indicador de Audio */}
      {etapa.audioPista && etapa.audioPista !== 'Sin Audio' && (
        <div className={`mt-4 pt-3 border-t border-white/10 flex items-center gap-2 ${colores.text}`}>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
          <span className="text-xs font-medium truncate">{etapa.audioPista}</span>
        </div>
      )}
    </div>
  );
}