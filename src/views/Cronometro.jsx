import React, { useState, useEffect } from 'react';

export default function Cronometro({ cambiarVista }) {
  const [tiempoRestante, setTiempoRestante] = useState(0); 
  const [corriendo, setCorriendo] = useState(false);

  // --- MOTOR DE SONIDO PROFESIONAL (Reloj Digital) ---
  const hacerSonarAlarma = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      
      const tocarPitido = (frecuencia, tiempoInicio, duracion) => {
        const oscilador = ctx.createOscillator();
        const volumen = ctx.createGain();
        
        oscilador.type = 'sine'; // Onda limpia, sin ruido a "jueguito"
        oscilador.frequency.setValueAtTime(frecuencia, ctx.currentTime + tiempoInicio);
        
        // Suavizar la entrada y salida para un sonido súper nítido
        volumen.gain.setValueAtTime(0, ctx.currentTime + tiempoInicio);
        volumen.gain.linearRampToValueAtTime(1, ctx.currentTime + tiempoInicio + 0.02);
        volumen.gain.setValueAtTime(1, ctx.currentTime + tiempoInicio + duracion - 0.02);
        volumen.gain.linearRampToValueAtTime(0, ctx.currentTime + tiempoInicio + duracion);
        
        oscilador.connect(volumen);
        volumen.connect(ctx.destination);
        
        oscilador.start(ctx.currentTime + tiempoInicio);
        oscilador.stop(ctx.currentTime + tiempoInicio + duracion);
      };

      // Patrón clásico de alarma digital: "pi-pi... pi-pi... piiiiii"
      tocarPitido(1500, 0.0, 0.12);
      tocarPitido(1500, 0.18, 0.12);
      
      tocarPitido(1500, 0.5, 0.12);
      tocarPitido(1500, 0.68, 0.12);
      
      tocarPitido(1500, 1.0, 0.12);
      tocarPitido(1500, 1.18, 0.12);
      
      tocarPitido(1500, 1.5, 0.8); // Pitido largo final para cerrar
      
    } catch (error) {
      console.error("Audio no soportado en este navegador", error);
    }
  };

  // --- LÓGICA DEL RELOJ ---
  useEffect(() => {
    let intervalo = null;
    if (corriendo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (corriendo && tiempoRestante === 0) {
      setCorriendo(false);
      hacerSonarAlarma();
    }
    return () => clearInterval(intervalo);
  }, [corriendo, tiempoRestante]);

  // Suma o resta segundos cuidando de no bajar de cero
  const ajustarTiempo = (segundosToAdd) => {
    setTiempoRestante((prev) => {
      const nuevo = prev + segundosToAdd;
      return nuevo > 0 ? nuevo : 0;
    });
  };

  const reiniciar = () => {
    setCorriendo(false);
    setTiempoRestante(0);
  };

  const min = Math.floor(tiempoRestante / 60);
  const seg = tiempoRestante % 60;
  const tiempoFormat = `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;

  return (
    <div className="min-h-screen w-full bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black p-4 md:p-8 flex flex-col">
      
      <header className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6 max-w-4xl mx-auto w-full shrink-0">
        <button onClick={() => cambiarVista('lanzador')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 shrink-0 transition-colors">
          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Timers Rápidos</h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">Cronómetro de alta precisión.</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        
        <div className="relative flex justify-center items-center mb-8 md:mb-12 w-full">
          <div className={`absolute w-[60vw] h-[60vw] md:w-[30rem] md:h-[30rem] rounded-full blur-[100px] transition-all duration-1000 ${corriendo ? 'bg-cyan-600/20 scale-110' : 'bg-transparent scale-90'}`}></div>
          
          <h1 className="text-[25vw] md:text-[10rem] font-black text-white tabular-nums tracking-tighter leading-none z-10 drop-shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            {tiempoFormat}
          </h1>
        </div>

        {/* CONTROLES DE EDICIÓN AVANZADA (Solo visibles cuando está pausado/frenado) */}
        {!corriendo && (
          <div className="flex flex-col gap-3 z-10 mb-8 w-full max-w-md px-4">
            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl p-3 px-4 md:px-6 shadow-lg">
              <span className="text-gray-400 font-bold text-xs uppercase tracking-widest w-20">Minutos</span>
              <div className="flex gap-2">
                <button onClick={() => ajustarTiempo(-60)} className="w-12 h-10 md:w-14 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg font-bold text-gray-300 transition-colors">-1</button>
                <button onClick={() => ajustarTiempo(60)} className="w-12 h-10 md:w-14 bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/30 text-cyan-400 rounded-lg font-bold transition-colors">+1</button>
                <button onClick={() => ajustarTiempo(300)} className="w-12 h-10 md:w-14 bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/30 text-cyan-400 rounded-lg font-bold transition-colors">+5</button>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl p-3 px-4 md:px-6 shadow-lg">
              <span className="text-gray-400 font-bold text-xs uppercase tracking-widest w-20">Segundos</span>
              <div className="flex gap-2">
                <button onClick={() => ajustarTiempo(-10)} className="w-12 h-10 md:w-14 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg font-bold text-gray-300 transition-colors">-10</button>
                <button onClick={() => ajustarTiempo(10)} className="w-12 h-10 md:w-14 bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/30 text-cyan-400 rounded-lg font-bold transition-colors">+10</button>
                <button onClick={() => ajustarTiempo(30)} className="w-12 h-10 md:w-14 bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/30 text-cyan-400 rounded-lg font-bold transition-colors">+30</button>
              </div>
            </div>
          </div>
        )}

        {/* BOTONES DE ACCIÓN (INICIAR, PAUSAR Y CANCELAR) */}
        <div className="flex items-center justify-center gap-4 z-10 min-h-[5rem] w-full">
          {tiempoRestante > 0 && !corriendo && (
            <button onClick={reiniciar} className="px-6 md:px-8 py-4 rounded-2xl font-bold text-base md:text-lg text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all shadow-[0_0_15px_rgba(244,63,94,0.1)]">
              Cancelar
            </button>
          )}

          {tiempoRestante > 0 && (
            <button 
              onClick={() => setCorriendo(!corriendo)} 
              className={`px-10 md:px-12 py-4 rounded-2xl font-bold text-lg md:text-xl border-2 transition-all shadow-lg ${corriendo ? 'bg-amber-500 border-amber-400 text-black shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:scale-105' : 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-105'}`}
            >
              {corriendo ? 'Pausar' : 'Iniciar'}
            </button>
          )}
        </div>

      </main>
    </div>
  );
}