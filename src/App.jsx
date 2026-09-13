import React, { useState, useEffect } from 'react';
import Lanzador from './views/Lanzador';
import MisRutinas from './views/MisRutinas';
import Cronometro from './views/Cronometro';
import Agenda from './views/Agenda';
import CreadorRutina from './views/CreadorRutina';
import GestorSedes from './views/GestorSedes';
import BibliotecaAudios from './views/BibliotecaAudios';
import Informes from './views/Informes';
import Ajustes from './views/Ajustes';

export default function FuriaGymPlanner() {
  const [vistaActual, setVistaActual] = useState('lanzador'); 

  // Inyectar el tema visual apenas arranca la app
  useEffect(() => {
    const temaGuardado = localStorage.getItem('furia_tema') || 'cyberpunk';
    document.body.className = `tema-${temaGuardado}`;
  }, []);

  return (
    <>
      {vistaActual === 'lanzador' && <Lanzador cambiarVista={setVistaActual} />}
      {vistaActual === 'rutinas' && <MisRutinas cambiarVista={setVistaActual} />}
      {vistaActual === 'creadorRutina' && <CreadorRutina cambiarVista={setVistaActual} />}
      {vistaActual === 'cronometro' && <Cronometro cambiarVista={setVistaActual} />}
      {vistaActual === 'agenda' && <Agenda cambiarVista={setVistaActual} />}
      {vistaActual === 'gestorSedes' && <GestorSedes cambiarVista={setVistaActual} />}
      {vistaActual === 'bibliotecaAudios' && <BibliotecaAudios cambiarVista={setVistaActual} />}
      {vistaActual === 'informes' && <Informes cambiarVista={setVistaActual} />}
      {vistaActual === 'ajustes' && <Ajustes cambiarVista={setVistaActual} />}
    </>
  );
}