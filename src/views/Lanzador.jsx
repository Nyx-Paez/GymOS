import React from 'react';

export default function Lanzador({ cambiarVista }) {
  const modulos = [
    { 
      id: 'rutinas', 
      nombre: 'Mis Rutinas', 
      color: 'from-fuchsia-600/20 to-purple-600/20 border-fuchsia-500/30 text-fuchsia-400',
      icono: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    { 
      id: 'agenda', 
      nombre: 'Agenda', 
      color: 'from-cyan-600/20 to-blue-600/20 border-cyan-500/30 text-cyan-400',
      icono: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'cronometro', 
      nombre: 'Cronómetro', 
      color: 'from-amber-600/20 to-orange-600/20 border-amber-500/30 text-amber-400',
      icono: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'bibliotecaAudios', 
      nombre: 'Biblioteca de Audios', 
      color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400',
      icono: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    },
    { 
      id: 'informes', 
      nombre: 'Informes', 
      color: 'from-indigo-600/20 to-violet-600/20 border-indigo-500/30 text-indigo-400',
      icono: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'ajustes', 
      nombre: 'Ajustes', 
      color: 'from-slate-600/20 to-gray-600/20 border-slate-500/30 text-slate-300',
      icono: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black p-4 md:p-8 flex flex-col justify-between">
      
      {/* HEADER */}
      <header className="text-center py-6 border-b border-white/10 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent">
          FuriaGymPlanner
        </h1>
        <p className="text-gray-400 text-xs md:text-sm mt-1 uppercase tracking-widest">Panel de Control del Profesor</p>
      </header>

      {/* GRILLA DE 6 ACCESOS (2x3 en mobile, 3x2 en desktop) */}
      <main className="max-w-4xl mx-auto w-full grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 my-auto py-6">
        {modulos.map((mod) => (
          <button
            key={mod.id}
            onClick={() => cambiarVista(mod.id)}
            className={`flex flex-col items-center justify-center p-5 md:p-8 bg-gradient-to-br ${mod.color} border rounded-[2rem] backdrop-blur-md hover:scale-105 active:scale-95 transition-all shadow-xl group cursor-pointer`}
          >
            <div className={`mb-3 group-hover:scale-110 transition-transform ${mod.color.split(' ')[2]}`}>
              {mod.icono}
            </div>
            <span className="text-white font-bold text-sm md:text-base text-center tracking-wide">
              {mod.nombre}
            </span>
          </button>
        ))}
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs text-gray-600 pb-2">
        FuriaGymPlanner • Sistema de Gestión de Clases
      </footer>
    </div>
  );
}