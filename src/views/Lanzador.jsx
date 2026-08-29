import React from 'react';

export default function Lanzador({ cambiarVista, hora }) {
  return (
    <div className="h-screen w-screen bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white p-8">
      
      <header className="flex justify-between items-center mb-12 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg">
        <div className="font-bold text-fuchsia-400 tracking-wider">GymOS</div>
        <div className="text-cyan-300 font-mono">{hora} • 22°C Pilar</div>
      </header>

      {/* Cambiamos a grid-cols-2 lg:grid-cols-4 para que los 4 íconos queden perfectos */}
      <main className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto mt-20">
        
        {/* 1. Timers Rápidos */}
        <button onClick={() => cambiarVista('cronometro')} className="group flex flex-col items-center justify-center p-8 bg-white/5 hover:bg-cyan-500/20 backdrop-blur-lg rounded-3xl border border-white/10 hover:border-cyan-400 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
          <div className="h-20 w-20 mb-4 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <span className="font-semibold text-gray-200 group-hover:text-cyan-300 mt-2">Timers Rápidos</span>
        </button>

        {/* 2. Mis Rutinas */}
        <button onClick={() => cambiarVista('rutinas')} className="group flex flex-col items-center justify-center p-8 bg-white/5 hover:bg-fuchsia-500/20 backdrop-blur-lg rounded-3xl border border-white/10 hover:border-fuchsia-400 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(217,70,239,0.3)]">
          <div className="h-20 w-20 mb-4 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          </div>
          <span className="font-semibold text-gray-200 group-hover:text-fuchsia-300 mt-2">Mis Rutinas</span>
        </button>

        {/* 3. NUEVO: Agenda y Calendario */}
        <button onClick={() => cambiarVista('agenda')} className="group flex flex-col items-center justify-center p-8 bg-white/5 hover:bg-amber-500/20 backdrop-blur-lg rounded-3xl border border-white/10 hover:border-amber-400 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]">
          <div className="h-20 w-20 mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <span className="font-semibold text-gray-200 group-hover:text-amber-300 mt-2">Agenda</span>
        </button>

        {/* 4. Ajustes */}
        <button onClick={() => cambiarVista('ajustes')} className="group flex flex-col items-center justify-center p-8 bg-white/5 hover:bg-violet-500/20 backdrop-blur-lg rounded-3xl border border-white/10 hover:border-violet-400 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
          <div className="h-20 w-20 mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <span className="font-semibold text-gray-200 group-hover:text-violet-300 mt-2">Ajustes</span>
        </button>

      </main>
    </div>
  );
}