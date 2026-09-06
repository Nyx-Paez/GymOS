import React, { useState, useEffect } from "react";
import PostIt from "../components/PostIt";
import ejerciciosBaseEspañol from "../data/diccionario_es.json";

export default function CreadorRutina({ cambiarVista }) {
  const [nombreRutina, setNombreRutina] = useState("");
  const [etapas, setEtapas] = useState([]);
  
  const [rutinaEditandoId, setRutinaEditandoId] = useState(null);

  const [etapaEnConstruccion, setEtapaEnConstruccion] = useState({
    id: "temp",
    modalidad: "Fuerza",
    duracionMinutos: 10,
    audioPista: "Sin Audio",
    tieneAudioPersonalizado: false,
    archivoAudio: null,
    listaEjercicios: [],
  });

  const [modoIngreso, setModoIngreso] = useState("simple");
  const [nuevoEjercicio, setNuevoEjercicio] = useState({ nombre: "", cantidad: "" });
  const [bloqueCombinadoTemp, setBloqueCombinadoTemp] = useState([]);
  const [cantidadBloqueCombinado, setCantidadBloqueCombinado] = useState("");

  const [modalidades, setModalidades] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [modalBibliotecaAbierto, setModalBibliotecaAbierto] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [busquedaEjercicio, setBusquedaEjercicio] = useState("");
  const [ejerciciosPersonalizados, setEjerciciosPersonalizados] = useState([]);

  const [creandoEjercicio, setCreandoEjercicio] = useState(false);
  const [ejercicioAEditar, setEjercicioAEditar] = useState({ id: null, name: "", category: "Fuerza", equipment: "Peso Corporal" });

  const pistasAudioBase = ["Sin Audio", "Pitidos Básicos (Beep Test)", "Tabata Song (20/10)", "EMOM Buzzer", "Rock Motivacional"];

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("gymos_ejercicios_v2"));
    if (guardados && guardados.length > 0) {
      setEjerciciosPersonalizados(guardados);
    } else {
      setEjerciciosPersonalizados(ejerciciosBaseEspañol);
      localStorage.setItem("gymos_ejercicios_v2", JSON.stringify(ejerciciosBaseEspañol));
    }

    const modGuardadas = JSON.parse(localStorage.getItem("gymos_modalidades"));
    if (modGuardadas && modGuardadas.length > 0) {
      setModalidades(modGuardadas);
    } else {
      const base = ["Fuerza", "AMRAP", "EMOM", "Tabata", "Entrada en calor", "Elongación"];
      setModalidades(base);
      localStorage.setItem("gymos_modalidades", JSON.stringify(base));
    }

    const rutinaAEditar = JSON.parse(localStorage.getItem('gymos_rutina_a_editar'));
    if (rutinaAEditar) {
      setNombreRutina(rutinaAEditar.nombre);
      setEtapas(rutinaAEditar.etapas);
      setRutinaEditandoId(rutinaAEditar.id);
      localStorage.removeItem('gymos_rutina_a_editar'); 
    }
  }, []);

  const manejarCambioModalidad = (e) => {
    const valor = e.target.value;
    if (valor === "NUEVA_MODALIDAD") {
      const nueva = window.prompt("Escribí el nombre de la nueva categoría (Ej: Desafío, HIIT):");
      if (nueva && nueva.trim() !== "") {
        const nuevaFormateada = nueva.trim();
        if (!modalidades.includes(nuevaFormateada)) {
          const actualizadas = [...modalidades, nuevaFormateada];
          setModalidades(actualizadas);
          localStorage.setItem("gymos_modalidades", JSON.stringify(actualizadas));
        }
        setEtapaEnConstruccion({ ...etapaEnConstruccion, modalidad: nuevaFormateada });
      }
    } else {
      setEtapaEnConstruccion({ ...etapaEnConstruccion, modalidad: valor });
    }
  };

  const manejarSubidaAudio = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const nombreLimpio = file.name.replace(/\.[^/.]+$/, ""); 
      setEtapaEnConstruccion({
        ...etapaEnConstruccion,
        audioPista: nombreLimpio,
        tieneAudioPersonalizado: true,
        archivoAudio: fileUrl,
      });
    }
  };

  const guardarEjercicioPersonalizado = (e) => {
    e.preventDefault();
    if (!ejercicioAEditar.name) return;
    let nuevaLista = ejercicioAEditar.id 
      ? ejerciciosPersonalizados.map((ej) => ej.id === ejercicioAEditar.id ? { ...ejercicioAEditar, isCustom: true } : ej)
      : [{ ...ejercicioAEditar, id: `esp_${Date.now()}`, isCustom: true }, ...ejerciciosPersonalizados];
    setEjerciciosPersonalizados(nuevaLista);
    localStorage.setItem("gymos_ejercicios_v2", JSON.stringify(nuevaLista));
    setCreandoEjercicio(false);
    setEjercicioAEditar({ id: null, name: "", category: "Fuerza", equipment: "Peso Corporal" });
  };

  const eliminarEjercicioPersonalizado = (e, id) => {
    e.stopPropagation();
    if (window.confirm("¿Seguro que querés borrar este ejercicio?")) {
      const nuevaLista = ejerciciosPersonalizados.filter((ej) => ej.id !== id);
      setEjerciciosPersonalizados(nuevaLista);
      localStorage.setItem("gymos_ejercicios_v2", JSON.stringify(nuevaLista));
    }
  };

  const abrirEdicionEjercicio = (e, ej) => {
    e.stopPropagation();
    setEjercicioAEditar(ej);
    setCreandoEjercicio(true);
  };

  const volverAtras = () => {
    const retorno = localStorage.getItem("gymos_retorno") || "rutinas";
    localStorage.removeItem("gymos_retorno");
    cambiarVista(retorno);
  };

  const guardarRutinaDefinitiva = () => {
    const rutinasGuardadas = JSON.parse(localStorage.getItem("gymos_rutinas")) || [];
    
    if (rutinaEditandoId) {
      const rutinasActualizadas = rutinasGuardadas.map(r => 
        r.id === rutinaEditandoId ? { ...r, nombre: nombreRutina, etapas: etapas } : r
      );
      localStorage.setItem("gymos_rutinas", JSON.stringify(rutinasActualizadas));
    } else {
      const rutinaNueva = { id: `rutina_${Date.now()}`, nombre: nombreRutina, etapas: etapas };
      localStorage.setItem("gymos_rutinas", JSON.stringify([...rutinasGuardadas, rutinaNueva]));
    }
    volverAtras();
  };

  const editarEtapa = (id) => {
    setEtapaEnConstruccion(etapas.find((e) => e.id === id));
    setEtapas(etapas.filter((e) => e.id !== id));
  };
  
  const eliminarEtapa = (id) => setEtapas(etapas.filter((e) => e.id !== id));

  const agregarEtapa = () => {
    if (etapaEnConstruccion.listaEjercicios.length === 0) return;
    setEtapas([
      ...etapas,
      {
        ...etapaEnConstruccion,
        tieneAudioPersonalizado: etapaEnConstruccion.audioPista !== "Sin Audio",
        id: etapaEnConstruccion.id === "temp" ? Date.now().toString() : etapaEnConstruccion.id,
      },
    ]);
    setEtapaEnConstruccion({ id: "temp", modalidad: "Fuerza", duracionMinutos: 10, audioPista: "Sin Audio", tieneAudioPersonalizado: false, archivoAudio: null, listaEjercicios: [] });
  };

  const manejarSeleccion = (nombreEjercicio) => {
    setNuevoEjercicio({ ...nuevoEjercicio, nombre: nombreEjercicio });
    setMostrarSugerencias(false); 
    setModalBibliotecaAbierto(false);
  };

  const agregarEjercicioSimple = (e) => {
    e.preventDefault();
    if (!nuevoEjercicio.nombre) return;
    const repeticiones = nuevoEjercicio.cantidad || "-";
    setEtapaEnConstruccion({
      ...etapaEnConstruccion,
      listaEjercicios: [...etapaEnConstruccion.listaEjercicios, { tipo: "simple", ejercicio: { ...nuevoEjercicio, cantidad: repeticiones } }],
    });
    setNuevoEjercicio({ nombre: "", cantidad: "" });
  };

  const agregarNombreAlBloqueCombinado = (e) => {
    e.preventDefault();
    if (!nuevoEjercicio.nombre) return;
    setBloqueCombinadoTemp([...bloqueCombinadoTemp, nuevoEjercicio.nombre]);
    setNuevoEjercicio({ nombre: "", cantidad: "" });
  };

  const confirmarBloqueCombinado = () => {
    if (bloqueCombinadoTemp.length < 2) return;
    const repeticionesBloque = cantidadBloqueCombinado || "-";
    setEtapaEnConstruccion({
      ...etapaEnConstruccion,
      listaEjercicios: [...etapaEnConstruccion.listaEjercicios, { tipo: "combinado", ejercicios: bloqueCombinadoTemp, cantidad: repeticionesBloque }],
    });
    setBloqueCombinadoTemp([]);
    setCantidadBloqueCombinado("");
  };

  const eliminarBloqueDeEtapa = (index) => {
    const nuevaLista = [...etapaEnConstruccion.listaEjercicios];
    nuevaLista.splice(index, 1);
    setEtapaEnConstruccion({ ...etapaEnConstruccion, listaEjercicios: nuevaLista });
  };

  const sugerenciasFiltradas = ejerciciosPersonalizados.filter((ej) =>
    ej.name.toLowerCase().includes(nuevoEjercicio.nombre.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black overflow-x-hidden p-4 md:p-8">
      
      {/* HEADER CORREGIDO PARA MOBILE */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 border-b border-white/10 pb-4 md:pb-6 gap-4">
        <div className="flex items-center gap-3 md:gap-6 w-full">
          <button onClick={volverAtras} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 shrink-0">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <input
            type="text"
            placeholder="Nombre de la Rutina..."
            value={nombreRutina}
            onChange={(e) => setNombreRutina(e.target.value)}
            className="flex-1 bg-transparent text-xl md:text-3xl font-bold text-white placeholder-gray-600 focus:outline-none min-w-0"
          />
        </div>
        <button
          onClick={guardarRutinaDefinitiva}
          disabled={!nombreRutina || etapas.length === 0}
          className="w-full md:w-auto px-4 md:px-6 py-3 md:py-3 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl font-bold text-white text-sm md:text-base transition-all shrink-0"
        >
          {rutinaEditandoId ? "Actualizar Rutina" : "Guardar Rutina"}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto h-auto lg:h-[calc(100vh-180px)]">
        
        {/* PANEL IZQUIERDO: FORMULARIO */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:overflow-y-auto pr-0 lg:pr-4 pb-10 lg:pb-20 no-scrollbar">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 md:p-6 backdrop-blur-md relative">
            {etapaEnConstruccion.id !== "temp" && (
              <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-[2rem]">
                MODO EDICIÓN
              </div>
            )}

            <div className="flex gap-3 md:gap-4 mb-4 mt-2">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Modalidad</label>
                <select value={etapaEnConstruccion.modalidad} onChange={manejarCambioModalidad} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 text-sm">
                  {modalidades.map((mod, i) => <option key={i} value={mod}>{mod}</option>)}
                  <option disabled>──────────</option>
                  <option value="NUEVA_MODALIDAD" className="text-cyan-400 font-bold">+ Crear Nueva Categoría...</option>
                </select>
              </div>
              <div className="w-24 md:w-1/3 shrink-0">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Minutos</label>
                <input type="number" min="1" value={etapaEnConstruccion.duracionMinutos} onChange={(e) => setEtapaEnConstruccion({ ...etapaEnConstruccion, duracionMinutos: parseInt(e.target.value) || 0 })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 text-sm" />
              </div>
            </div>

            <div className="mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                Sonido de la Etapa
              </label>
              <div className="flex flex-col gap-3">
                <select 
                  value={etapaEnConstruccion.tieneAudioPersonalizado ? "Personalizado" : etapaEnConstruccion.audioPista} 
                  onChange={(e) => {
                    if (e.target.value !== "Personalizado") setEtapaEnConstruccion({...etapaEnConstruccion, audioPista: e.target.value, tieneAudioPersonalizado: false, archivoAudio: null});
                  }} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 text-sm"
                >
                  <optgroup label="Sistemas Nativos">
                    {pistasAudioBase.map(pista => <option key={pista} value={pista} className="bg-gray-900">{pista}</option>)}
                  </optgroup>
                  <optgroup label="Archivos del Profesor">
                    <option value="Personalizado" disabled>Subir pista musical (MP3)...</option>
                  </optgroup>
                </select>

                <div className="relative">
                  {!etapaEnConstruccion.tieneAudioPersonalizado && (
                    <input type="file" accept="audio/*" onChange={manejarSubidaAudio} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  )}
                  <div className={`flex flex-col gap-2 p-3 rounded-xl border transition-all ${etapaEnConstruccion.tieneAudioPersonalizado ? "bg-cyan-500/10 border-cyan-500/50" : "bg-white/5 border-white/10 hover:border-cyan-500/30"}`}>
                    {!etapaEnConstruccion.tieneAudioPersonalizado ? (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-800 text-gray-400 shrink-0">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        <span className="text-xs md:text-sm text-gray-400 truncate">Subir tu propio .MP3 o .WAV</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 relative z-20">
                        <div className="p-2 rounded-lg bg-cyan-500 text-black shrink-0">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                        </div>
                        <input type="text" value={etapaEnConstruccion.audioPista} onChange={(e) => setEtapaEnConstruccion({...etapaEnConstruccion, audioPista: e.target.value})} className="flex-1 bg-black/40 border border-cyan-500/30 rounded-lg p-2 text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 text-xs md:text-sm min-w-0" placeholder="Nombre de la pista..." />
                        <button type="button" onClick={() => setEtapaEnConstruccion({...etapaEnConstruccion, audioPista: "Sin Audio", tieneAudioPersonalizado: false, archivoAudio: null})} className="text-gray-400 hover:text-rose-500 p-1 transition-colors shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 md:pt-6">
              <div className="flex bg-black/40 rounded-xl p-1 mb-4 md:mb-6 border border-white/5">
                <button onClick={() => setModoIngreso("simple")} className={`flex-1 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${modoIngreso === "simple" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                  Ejercicio Simple
                </button>
                <button onClick={() => setModoIngreso("combinado")} className={`flex-1 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${modoIngreso === "combinado" ? "bg-fuchsia-500/20 text-fuchsia-400" : "text-gray-500 hover:text-gray-300"}`}>
                  Superset / Complex
                </button>
              </div>

              {modoIngreso === "simple" ? (
                <form onSubmit={agregarEjercicioSimple} className="flex gap-2 mb-4 relative overflow-visible">
                  <button type="button" onClick={() => setModalBibliotecaAbierto(true)} className="p-2 md:p-3 bg-white/5 hover:bg-cyan-500/20 border border-white/10 rounded-xl text-cyan-400 transition-all shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </button>
                  <div className="flex-1 relative min-w-0">
                    <input
                      type="text"
                      placeholder="Escribir..."
                      value={nuevoEjercicio.nombre}
                      onChange={(e) => { setNuevoEjercicio({ ...nuevoEjercicio, nombre: e.target.value }); setMostrarSugerencias(true); }}
                      onFocus={() => setMostrarSugerencias(true)}
                      onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 text-sm"
                    />
                    {mostrarSugerencias && nuevoEjercicio.nombre.length > 0 && sugerenciasFiltradas.length > 0 && (
                      <ul className="absolute z-50 w-full bg-gray-800 border border-cyan-500/30 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-xl">
                        {sugerenciasFiltradas.map((ej) => (
                          <li key={ej.id} onMouseDown={() => manejarSeleccion(ej.name)} className="p-3 hover:bg-cyan-500/30 cursor-pointer text-white text-sm border-b border-white/5 last:border-0 flex justify-between items-center">
                            <span className="truncate pr-2">{ej.name}</span>
                            <span className="text-[10px] text-cyan-300 font-mono shrink-0">{ej.equipment}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Ej: 10x10x8"
                    value={nuevoEjercicio.cantidad}
                    onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, cantidad: e.target.value })}
                    className="w-28 md:w-32 shrink-0 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 text-center text-sm"
                  />
                  <button type="submit" className="px-3 md:px-4 shrink-0 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-white transition-all">+</button>
                </form>
              ) : (
                <div className="bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-2xl p-3 md:p-4 mb-6 relative overflow-visible">
                  <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-4 block">Constructor de Superset</span>
                  <form onSubmit={agregarNombreAlBloqueCombinado} className="flex gap-2 mb-4">
                    <button type="button" onClick={() => setModalBibliotecaAbierto(true)} className="p-2 md:p-3 shrink-0 bg-white/5 hover:bg-fuchsia-500/20 border border-white/10 rounded-xl text-fuchsia-400 transition-all">
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </button>
                    <div className="flex-1 relative min-w-0">
                      <input
                        type="text"
                        placeholder="Ej: Sentadilla..."
                        value={nuevoEjercicio.nombre}
                        onChange={(e) => { setNuevoEjercicio({ ...nuevoEjercicio, nombre: e.target.value }); setMostrarSugerencias(true); }}
                        onFocus={() => setMostrarSugerencias(true)}
                        onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500 text-sm"
                      />
                      {mostrarSugerencias && nuevoEjercicio.nombre.length > 0 && sugerenciasFiltradas.length > 0 && (
                        <ul className="absolute z-50 w-full bg-gray-800 border border-fuchsia-500/30 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-xl">
                          {sugerenciasFiltradas.map((ej) => (
                            <li key={ej.id} onMouseDown={() => manejarSeleccion(ej.name)} className="p-3 hover:bg-fuchsia-500/30 cursor-pointer text-white text-sm border-b border-white/5 last:border-0 flex justify-between items-center">
                              <span className="truncate pr-2">{ej.name}</span>
                              <span className="text-[10px] text-fuchsia-300 font-mono shrink-0">{ej.equipment}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button type="submit" className="px-3 md:px-4 shrink-0 bg-fuchsia-500/20 hover:bg-fuchsia-500/40 text-fuchsia-300 rounded-xl font-bold transition-all text-sm">Sumar</button>
                  </form>
                  
                  {bloqueCombinadoTemp.length > 0 && (
                    <div className="flex flex-col gap-1 mb-6 border-l-2 border-fuchsia-500/50 pl-3">
                      {bloqueCombinadoTemp.map((ej, i) => (
                        <span key={i} className="text-gray-300 text-sm flex items-center gap-2">
                          {i > 0 && <span className="text-fuchsia-500 font-bold">+</span>} {ej}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-fuchsia-500/20 pt-4 w-full">
                    <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-2 block">Repeticiones Totales</span>
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        placeholder="Ej: 4 Rondas o 10x10x8"
                        value={cantidadBloqueCombinado}
                        onChange={(e) => setCantidadBloqueCombinado(e.target.value)}
                        className="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={confirmarBloqueCombinado}
                        disabled={bloqueCombinadoTemp.length < 2}
                        className="px-4 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-gray-800 text-white rounded-xl font-bold transition-all text-sm shrink-0"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {etapaEnConstruccion.listaEjercicios.length > 0 && (
                <div className="bg-black/20 rounded-2xl p-3 md:p-4 border border-white/5 flex flex-col gap-2 mt-2">
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Cargado en la tarjeta:</span>
                  {etapaEnConstruccion.listaEjercicios.map((bloque, index) => (
                    <div key={index} className="flex justify-between items-center text-sm p-3 bg-white/5 border border-white/5 rounded-xl">
                      <div className="flex flex-col">
                        {bloque.tipo === "simple" && (
                          <span>
                            {bloque.ejercicio.nombre} <span className="text-cyan-400 font-mono ml-2 font-bold">{bloque.ejercicio.cantidad}</span>
                          </span>
                        )}
                        {bloque.tipo === "combinado" && (
                          <span className="text-gray-200">
                            {bloque.ejercicios.map((ej, i) => (
                              <React.Fragment key={i}>{i > 0 && <span className="text-fuchsia-400 font-bold mx-1">+</span>}{ej}</React.Fragment>
                            ))}
                            <span className="text-fuchsia-400 font-mono ml-2 font-bold">({bloque.cantidad})</span>
                          </span>
                        )}
                      </div>
                      <button onClick={() => eliminarBloqueDeEtapa(index)} className="text-gray-500 hover:text-rose-500 shrink-0 ml-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={agregarEtapa}
              disabled={etapaEnConstruccion.listaEjercicios.length === 0}
              className="mt-6 md:mt-8 w-full py-3 md:py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 rounded-xl font-bold text-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] disabled:shadow-none text-sm md:text-base"
            >
              {etapaEnConstruccion.id !== "temp" ? "Guardar Cambios de la Etapa" : "Confirmar y Agregar Etapa"}
            </button>
          </div>
        </div>

        {/* PANEL DERECHO: VISTA PREVIA Y ETAPAS */}
        <div className="w-full lg:w-1/2 bg-black/20 border border-white/5 rounded-[2rem] p-4 md:p-6 backdrop-blur-sm lg:overflow-y-auto no-scrollbar">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Vista Previa</h2>
          
          <div className="mb-8 min-h-[150px]">
            <PostIt etapa={etapaEnConstruccion} />
          </div>

          {etapas.length > 0 && (
            <>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-t border-white/10 pt-6">
                Etapas Guardadas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {etapas.map((etapa) => (
                  <div key={etapa.id} className="relative group">
                    <PostIt etapa={etapa} />
                    
                    {/* Botones de borrado achicados en mobile */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all">
                      <button onClick={() => editarEtapa(etapa.id)} className="p-2 md:p-4 bg-cyan-500 text-black rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-110">
                        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => eliminarEtapa(etapa.id)} className="p-2 md:p-4 bg-rose-500 text-white rounded-full shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-110">
                        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL BIBLIOTECA (IGUAL QUE ANTES) */}
      {modalBibliotecaAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
           <div className="bg-gray-900 border border-cyan-500/30 rounded-[2rem] p-6 md:p-8 w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(34,211,238,0.1)] relative">
            <button onClick={() => setModalBibliotecaAbierto(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-1">Biblioteca de Ejercicios</h2>
                <p className="text-gray-400 text-sm">Tu diccionario personal.</p>
              </div>
              {!creandoEjercicio && (
                <button onClick={() => { setEjercicioAEditar({ id: null, name: "", category: "Fuerza", equipment: "Peso Corporal" }); setCreandoEjercicio(true); }} className="px-4 py-2 bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30 hover:bg-fuchsia-600/40 rounded-xl font-bold transition-all text-sm">
                  + Añadir Nuevo
                </button>
              )}
            </div>
            
            {creandoEjercicio ? (
              <form onSubmit={guardarEjercicioPersonalizado} className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4">{ejercicioAEditar.id ? "Editar Ejercicio" : "Crear Nuevo Ejercicio"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-2 uppercase font-bold">Nombre</label>
                    <input type="text" required value={ejercicioAEditar.name} onChange={(e) => setEjercicioAEditar({ ...ejercicioAEditar, name: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500" placeholder="Ej: Thruster con Mancuernas" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-2 uppercase font-bold">Categoría</label>
                    <input type="text" required value={ejercicioAEditar.category} onChange={(e) => setEjercicioAEditar({ ...ejercicioAEditar, category: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500" placeholder="Ej: Fuerza, Cardio..." />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-2 uppercase font-bold">Equipamiento</label>
                    <input type="text" value={ejercicioAEditar.equipment} onChange={(e) => setEjercicioAEditar({ ...ejercicioAEditar, equipment: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500" placeholder="Ej: Pesa Rusa, TRX..." />
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button type="button" onClick={() => setCreandoEjercicio(false)} className="px-6 py-2 bg-gray-800 text-white rounded-xl font-bold">Cancelar</button>
                  <button type="submit" className="px-6 py-2 bg-fuchsia-600 text-white rounded-xl font-bold">Guardar</button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input type="text" placeholder="Buscar por nombre, equipo o categoría..." value={busquedaEjercicio} onChange={(e) => setBusquedaEjercicio(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500" />
                <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 appearance-none min-w-[150px] capitalize">
                  <option value="Todos">Todas las categorías</option>
                  {[...new Set(ejerciciosPersonalizados.map((ej) => ej.category))].filter(Boolean).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {!creandoEjercicio && (
              <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-2 pb-4">
                {ejerciciosPersonalizados
                  .filter((ej) => filtroCategoria === "Todos" || ej.category === filtroCategoria)
                  .filter((ej) => (ej.name && ej.name.toLowerCase().includes(busquedaEjercicio.toLowerCase())) || (ej.equipment && ej.equipment.toLowerCase().includes(busquedaEjercicio.toLowerCase())))
                  .map((ej, i) => (
                    <div key={i} className={`flex flex-col text-left p-4 rounded-2xl transition-all group relative border bg-fuchsia-500/5 border-fuchsia-500/30`}>
                      <button onClick={() => manejarSeleccion(ej.name)} className="flex-1 w-full text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-lg group-hover:text-cyan-300 capitalize pr-8">{ej.name}</span>
                        </div>
                        <div className="flex justify-between items-center mt-3 w-full">
                          <span className="text-xs font-mono bg-black/50 text-gray-400 px-2 py-1 rounded-md capitalize">{ej.equipment || "N/A"}</span>
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{ej.category || "N/A"}</span>
                        </div>
                      </button>
                      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => abrirEdicionEjercicio(e, ej)} className="p-1 text-gray-400 hover:text-cyan-400" title="Editar"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                        <button onClick={(e) => eliminarEjercicioPersonalizado(e, ej.id)} className="p-1 text-gray-400 hover:text-rose-500" title="Eliminar"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}