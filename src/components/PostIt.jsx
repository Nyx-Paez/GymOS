import React from 'react';

const estilosPorModalidad = {
  AMRAP: { borde: 'border-emerald-500/50', fondo: 'bg-emerald-500/10', brillo: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]', textoNeón: 'text-emerald-400', etiqueta: 'bg-emerald-500 text-black' },
  EMOM: { borde: 'border-cyan-500/50', fondo: 'bg-cyan-500/10', brillo: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]', textoNeón: 'text-cyan-400', etiqueta: 'bg-cyan-400 text-black' },
  Tabata: { borde: 'border-rose-500/50', fondo: 'bg-rose-500/10', brillo: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]', textoNeón: 'text-rose-400', etiqueta: 'bg-rose-500 text-white' },
  Fuerza: { borde: 'border-fuchsia-500/50', fondo: 'bg-fuchsia-500/10', brillo: 'hover:shadow-[0_0_30px_rgba(217,70,239,0.3)]', textoNeón: 'text-fuchsia-400', etiqueta: 'bg-fuchsia-500 text-white' }
};

export default function PostIt({ etapa }) {
  const estilo = estilosPorModalidad[etapa.modalidad] || estilosPorModalidad.Fuerza;

  return (
    <div className={`relative flex flex-col p-5 rounded-2xl backdrop-blur-md border ${estilo.borde} ${estilo.fondo} ${estilo.brillo} transition-colors h-full`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-gray-500/80 cursor-grab active:cursor-grabbing hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
          <span className={`px-4 py-1 text-sm font-black uppercase tracking-widest rounded-md shadow-lg ${estilo.etiqueta}`}>{etapa.modalidad}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-3xl font-black ${estilo.textoNeón}`}>{etapa.duracionMinutos}'</span>
          {etapa.tieneAudioPersonalizado && (
            <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          )}
        </div>
      </div>

      <div className="flex-1 mt-2">
        <ul className="space-y-3">
          {etapa.listaEjercicios.map((bloque, index) => (
            <li key={index} className="border-b border-white/5 pb-2 text-sm">
              
              <div className="flex justify-between items-center gap-4">
                <span className="text-gray-300 font-medium flex flex-wrap items-center gap-1">
                  {bloque.tipo === 'simple' ? (
                    bloque.ejercicio
                  ) : (
                    bloque.ejercicios.map((ej, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className={`${estilo.textoNeón} font-bold text-lg mx-1`}>+</span>}
                        {ej}
                      </React.Fragment>
                    ))
                  )}
                </span>
                <span className="text-gray-400 font-mono bg-black/30 px-2 py-0.5 rounded whitespace-nowrap">
                  {bloque.cantidad}
                </span>
              </div>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}