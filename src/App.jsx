import React, { useState, useEffect } from 'react';
import Lanzador from './views/Lanzador';
import MisRutinas from './views/MisRutinas';
import Cronometro from './views/Cronometro';
import Agenda from './views/Agenda';
import CreadorRutina from './views/CreadorRutina';
import GestorSedes from './views/GestorSedes';

export default function GymOS() {
  // Estado que controla qué pantalla estamos viendo
  const [vistaActual, setVistaActual] = useState('lanzador'); 
  const [isIdle, setIsIdle] = useState(false);
  const [hora, setHora] = useState(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }));

  // Lógica del Reloj
  useEffect(() => {
    const intervaloReloj = setInterval(() => {
      setHora(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(intervaloReloj);
  }, []);

  // Lógica de Inactividad (Salvapantallas)
  useEffect(() => {
    let idleTimer;
    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      // Solo activamos inactividad si estamos en el lanzador (no queremos que se apague en medio de un ejercicio)
      if (vistaActual === 'lanzador') {
        idleTimer = setTimeout(() => setIsIdle(true), 30000); 
      }
    };

    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    resetTimer(); // Iniciar al montar

    return () => {
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      clearTimeout(idleTimer);
    };
  }, [vistaActual]);

  // RENDERIZADO 1: Si está inactivo, mostramos el salvapantallas
  if (isIdle && vistaActual === 'lanzador') {
    return (
      <div className="h-screen w-screen bg-gray-950 flex flex-col items-center justify-center text-white select-none cursor-pointer">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          {hora}
        </h1>
        <p className="text-xl text-gray-400 mt-4 tracking-widest uppercase">Toca para iniciar</p>
        <div className="mt-12 h-64 w-64 rounded-full border-4 border-fuchsia-500/30 flex items-center justify-center relative overflow-hidden shadow-[0_0_40px_rgba(217,70,239,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 to-cyan-500/20 animate-pulse"></div>
          <span className="text-gray-300 font-mono z-10">[ Avatar SVG Aquí ]</span>
        </div>
      </div>
    );
  }

  // RENDERIZADO 2: Sistema de navegación (Switch)
  return (
    <>
      {/* 1. Pantalla del Lanzador */}
      {vistaActual === 'lanzador' && <Lanzador cambiarVista={setVistaActual} hora={hora} />}
      
      {/* 2. Pantalla de Rutinas */}
      {vistaActual === 'rutinas' && <MisRutinas cambiarVista={setVistaActual} />}

      {/* NUEVO: Creador de Rutinas */}
      {vistaActual === 'creadorRutina' && <CreadorRutina cambiarVista={setVistaActual} />}

      {/* 3. Pantalla del Cronómetro */}
      {vistaActual === 'cronometro' && <Cronometro cambiarVista={setVistaActual} />}
      
      {/* 4. Pantalla de Agenda */}
      {vistaActual === 'agenda' && <Agenda cambiarVista={setVistaActual} />}
      
      {/* 5. Pantalla del Gestor de Sedes */}
      {vistaActual === 'gestorSedes' && <GestorSedes cambiarVista={setVistaActual} />}
    </>
  );
}