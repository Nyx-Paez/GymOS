import React, { useState, useEffect } from 'react';

export default function Cronometro({ cambiarVista }) {
  // Estado inicial: 12 minutos (720 segundos)
  const [tiempoTotal, setTiempoTotal] = useState(720); 
  const [tiempoRestante, setTiempoRestante] = useState(720);
  const [corriendo, setCorriendo] = useState(false);

  // Lógica matemática del reloj
  useEffect(() => {
    let intervalo = null;
    if (corriendo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (tiempoRestante === 0 && corriendo) {
      // ¡Acá es donde en el futuro sonará el PITIDO FINAL!
      setCorriendo(false);
    }
    return () => clearInterval(intervalo);
  }, [corriendo, tiempoRestante]);

  // Funciones de control
  const toggleTimer = () => setCorriendo(!corriendo);
  
  const resetTimer = () => {
    setCorriendo(false);
    setTiempoRestante(tiempoTotal);
  };

  const ajustarTiempo = (segundos) => {
    if (corriendo) return; // No permitimos cambiar el tiempo si está corriendo
    const nuevoTiempo = Math.max(0, tiempoTotal + segundos); // Evitamos números negativos
    setTiempoTotal(nuevoTiempo);
    setTiempoRestante(nuevoTiempo);
  };

  // Convertir segundos a formato MM:SS
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  // padStart asegura que siempre haya 2 dígitos (ej: "05" en vez de "5")
  const tiempoFormateado = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

  return (
    <div className="h-screen w-screen bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white p-4 md:p-8 flex flex-col justify-between overflow-hidden">
      
      {/* Cabecera */}
      <header className="flex justify-between items-center mb-4">
        <button 
          onClick={() => cambiarVista('lanzador')}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-md transition-colors border border-white/10 text-cyan-400 flex items-center gap-2 font-bold text-sm md:text-base"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span className="hidden sm:inline">Volver</span>
        </button>
        <div className="px-3 md:px-4 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 font-mono tracking-widest uppercase text-xs md:text-sm">
          AMRAP / For Time
        </div>
      </header>

      {/* Reloj Gigante (El centro de atención) */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full">
        {/* Efecto de brillo de fondo responsivo */}
        <div className={`absolute w-[80vw] h-[80vw] md:w-[40rem] md:h-[40rem] rounded-full blur-[80px] md:blur-[120px] transition-all duration-1000 ${corriendo ? 'bg-cyan-600/20 scale-110' : 'bg-gray-700/10 scale-90'}`}></div>
        
        {/* Los números (Acá está la magia del text-[28vw] y tabular-nums) */}
        <h1 className="text-[28vw] sm:text-[25vw] md:text-[10rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_40px_rgba(34,211,238,0.4)] tracking-tighter z-10 font-mono tabular-nums">
          {tiempoFormateado}
        </h1>

        {/* Botones para ajustar el tiempo */}
        {!corriendo && (
          <div className="flex gap-2 md:gap-4 mt-6 md:mt-8 z-10">
            <button onClick={() => ajustarTiempo(-60)} className="px-4 md:px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm md:text-xl font-bold border border-white/10 transition-colors">- 1 Min</button>
            <button onClick={() => ajustarTiempo(60)} className="px-4 md:px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm md:text-xl font-bold border border-white/10 transition-colors">+ 1 Min</button>
          </div>
        )}
      </main>

      {/* Controles Principales */}
      <footer className="flex justify-center items-center gap-6 md:gap-8 pb-6 md:pb-10 z-10">
        <button 
          onClick={resetTimer}
          className="p-4 md:p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>

        <button 
          onClick={toggleTimer}
          className={`p-6 md:p-8 rounded-full border-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:scale-105 ${corriendo ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_40px_rgba(244,63,94,0.4)]' : 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_40px_rgba(34,211,238,0.4)]'}`}
        >
          {corriendo ? (
            <svg className="w-12 h-12 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"></path></svg>
          ) : (
            <svg className="w-12 h-12 md:w-16 md:h-16 translate-x-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
          )}
        </button>
      </footer>

    </div>
  );
}