import React from 'react';

export default function PostIt({ etapa }) {
  if (!etapa) return null;

  return (
    <div className="bg-fuchsia-900/40 border border-fuchsia-500/30 rounded-2xl p-4 shadow-lg w-full flex flex-col h-full min-h-[160px]">
      
      {/* Cabecera del PostIt */}
      <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-2">
        <span className="bg-fuchsia-500 text-black text-xs font-black px-2 py-1 rounded uppercase tracking-widest">
          {etapa.modalidad}
        </span>
        <span className="text-fuchsia-400 font-black text-xl">
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
                <span className="text-white text-sm font-medium">{item.ejercicio.nombre}</span>
                <span className="text-cyan-400 font-mono text-sm ml-2 font-bold">{item.ejercicio.cantidad}</span>
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
                      {i > 0 && <span className="text-fuchsia-400 font-bold text-xs">+</span>}
                      <span className="text-gray-200 text-sm">{ej}</span>
                    </React.Fragment>
                  ))}
                </div>
                <div className="text-right mt-1">
                  <span className="text-fuchsia-400 font-mono text-sm font-bold bg-fuchsia-500/10 px-2 py-0.5 rounded">
                    {item.cantidad}
                  </span>
                </div>
              </div>
            );
          }

          // Fallback por si hay datos viejos guardados
          return (
            <div key={index} className="flex justify-between items-center">
              <span className="text-white text-sm font-medium">{item.nombre || item}</span>
            </div>
          );
        })}
      </div>

      {/* Indicador de Audio */}
      {etapa.audioPista && etapa.audioPista !== 'Sin Audio' && (
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-cyan-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
          <span className="text-xs font-medium truncate">{etapa.audioPista}</span>
        </div>
      )}
    </div>
  );
}