import React, { useState, useEffect } from "react";
import PostIt from "../components/PostIt";
import ejerciciosBaseEspañol from "../data/diccionario_es.json";

export default function CreadorRutina({ cambiarVista }) {
  const [nombreRutina, setNombreRutina] = useState("");
  const [etapas, setEtapas] = useState([]);
  const [etapaEnConstruccion, setEtapaEnConstruccion] = useState({
    id: "temp",
    modalidad: "Fuerza",
    duracionMinutos: 10,
    audioPista: "Sin Audio",
    tieneAudioPersonalizado: false,
    listaEjercicios: [],
  });

  const [modoIngreso, setModoIngreso] = useState("simple");
  const [nuevoEjercicio, setNuevoEjercicio] = useState({
    nombre: "",
    cantidad: "",
  });
  const [bloqueCombinadoTemp, setBloqueCombinadoTemp] = useState([]);
  const [cantidadBloqueCombinado, setCantidadBloqueCombinado] = useState("");

  // --- ESTADOS PARA EL DESPLEGABLE INTELIGENTE ---
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  // --- ESTADOS DE LA BIBLIOTECA LOCAL ---
  const [modalBibliotecaAbierto, setModalBibliotecaAbierto] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [busquedaEjercicio, setBusquedaEjercicio] = useState("");
  const [ejerciciosPersonalizados, setEjerciciosPersonalizados] = useState([]);

  const [creandoEjercicio, setCreandoEjercicio] = useState(false);
  const [ejercicioAEditar, setEjercicioAEditar] = useState({
    id: null,
    name: "",
    category: "Fuerza",
    equipment: "Peso Corporal",
  });

  const pistasAudioBase = [
    "Sin Audio",
    "Pitidos Básicos (Beep Test)",
    "Tabata Song (20/10)",
    "EMOM Buzzer",
    "Rock Motivacional",
  ];

  useEffect(() => {
    // FIX DE CACHÉ: Cambiamos la clave a 'gymos_ejercicios_v2' para forzar la carga de tu nueva lista
    const guardados = JSON.parse(localStorage.getItem("gymos_ejercicios_v2"));
    if (guardados && guardados.length > 0) {
      setEjerciciosPersonalizados(guardados);
    } else {
      setEjerciciosPersonalizados(ejerciciosBaseEspañol);
      localStorage.setItem(
        "gymos_ejercicios_v2",
        JSON.stringify(ejerciciosBaseEspañol),
      );
    }
  }, []);

  // ==========================================
  // GESTIÓN DE LA BIBLIOTECA
  // ==========================================
  const guardarEjercicioPersonalizado = (e) => {
    e.preventDefault();
    if (!ejercicioAEditar.name) return;

    let nuevaLista;
    if (ejercicioAEditar.id) {
      nuevaLista = ejerciciosPersonalizados.map((ej) =>
        ej.id === ejercicioAEditar.id
          ? { ...ejercicioAEditar, isCustom: true }
          : ej,
      );
    } else {
      nuevaLista = [
        { ...ejercicioAEditar, id: `esp_${Date.now()}`, isCustom: true },
        ...ejerciciosPersonalizados,
      ];
    }

    setEjerciciosPersonalizados(nuevaLista);
    localStorage.setItem("gymos_ejercicios_v2", JSON.stringify(nuevaLista));
    setCreandoEjercicio(false);
    setEjercicioAEditar({
      id: null,
      name: "",
      category: "Fuerza",
      equipment: "Peso Corporal",
    });
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

  // ==========================================
  // NAVEGACIÓN Y GUARDADO DE RUTINAS
  // ==========================================
  const volverAtras = () => {
    const retorno = localStorage.getItem("gymos_retorno");
    if (retorno) {
      localStorage.removeItem("gymos_retorno");
      cambiarVista(retorno);
    } else {
      cambiarVista("rutinas");
    }
  };

  const guardarRutinaDefinitiva = () => {
    const rutinaNueva = {
      id: `rutina_${Date.now()}`,
      nombre: nombreRutina,
      etapas: etapas,
    };
    const rutinasGuardadas =
      JSON.parse(localStorage.getItem("gymos_rutinas")) || [];
    localStorage.setItem(
      "gymos_rutinas",
      JSON.stringify([...rutinasGuardadas, rutinaNueva]),
    );
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
        id:
          etapaEnConstruccion.id === "temp"
            ? Date.now().toString()
            : etapaEnConstruccion.id,
      },
    ]);
    setEtapaEnConstruccion({
      id: "temp",
      modalidad: "Fuerza",
      duracionMinutos: 10,
      audioPista: "Sin Audio",
      tieneAudioPersonalizado: false,
      listaEjercicios: [],
    });
  };

  // ==========================================
  // FIX: GESTIÓN DE EJERCICIOS (Con Autocompletado Custom)
  // ==========================================
  const manejarSeleccion = (nombreEjercicio) => {
    setNuevoEjercicio({ ...nuevoEjercicio, nombre: nombreEjercicio });
    setMostrarSugerencias(false); // Cierra el menú desplegable
    setModalBibliotecaAbierto(false);
  };

  const agregarEjercicioSimple = (e) => {
    e.preventDefault();
    if (!nuevoEjercicio.nombre) return;

    // Si no pone cantidad, pone guión.
    const repeticiones = nuevoEjercicio.cantidad || "-";

    setEtapaEnConstruccion({
      ...etapaEnConstruccion,
      listaEjercicios: [
        ...etapaEnConstruccion.listaEjercicios,
        {
          tipo: "simple",
          ejercicio: { ...nuevoEjercicio, cantidad: repeticiones },
        },
      ],
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
      listaEjercicios: [
        ...etapaEnConstruccion.listaEjercicios,
        {
          tipo: "combinado",
          ejercicios: bloqueCombinadoTemp,
          cantidad: repeticionesBloque,
        },
      ],
    });
    setBloqueCombinadoTemp([]);
    setCantidadBloqueCombinado("");
  };

  const eliminarBloqueDeEtapa = (index) => {
    const nuevaLista = [...etapaEnConstruccion.listaEjercicios];
    nuevaLista.splice(index, 1);
    setEtapaEnConstruccion({
      ...etapaEnConstruccion,
      listaEjercicios: nuevaLista,
    });
  };

  // Filtrado en vivo para el menú desplegable
  const sugerenciasFiltradas = ejerciciosPersonalizados.filter((ej) =>
    ej.name.toLowerCase().includes(nuevoEjercicio.nombre.toLowerCase()),
  );

  return (
    <div className="min-h-screen w-screen bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black overflow-x-hidden p-4 md:p-8">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-6 w-full max-w-2xl">
          <button
            onClick={volverAtras}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
          >
            <svg
              className="w-6 h-6 text-fuchsia-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Nombre de la Rutina..."
            value={nombreRutina}
            onChange={(e) => setNombreRutina(e.target.value)}
            className="flex-1 bg-transparent text-2xl md:text-3xl font-bold text-white placeholder-gray-600 focus:outline-none"
          />
        </div>
        <button
          onClick={guardarRutinaDefinitiva}
          disabled={!nombreRutina || etapas.length === 0}
          className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl font-bold text-white transition-all"
        >
          Guardar Rutina
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto h-[calc(100vh-180px)]">
        {/* PANEL IZQUIERDO: FORMULARIO */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 overflow-y-auto pr-2 md:pr-4 pb-20 no-scrollbar">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md relative">
            {etapaEnConstruccion.id !== "temp" && (
              <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-[2rem]">
                MODO EDICIÓN
              </div>
            )}

            <div className="flex gap-4 mb-4 mt-2">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Modalidad
                </label>
                <select
                  value={etapaEnConstruccion.modalidad}
                  onChange={(e) =>
                    setEtapaEnConstruccion({
                      ...etapaEnConstruccion,
                      modalidad: e.target.value,
                    })
                  }
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Fuerza">Fuerza</option>
                  <option value="AMRAP">AMRAP</option>
                  <option value="EMOM">EMOM</option>
                  <option value="Tabata">Tabata</option>
                </select>
              </div>
              <div className="w-1/3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Minutos
                </label>
                <input
                  type="number"
                  min="1"
                  value={etapaEnConstruccion.duracionMinutos}
                  onChange={(e) =>
                    setEtapaEnConstruccion({
                      ...etapaEnConstruccion,
                      duracionMinutos: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                Audio (Cronómetro)
              </label>
              <select
                value={etapaEnConstruccion.audioPista}
                onChange={(e) =>
                  setEtapaEnConstruccion({
                    ...etapaEnConstruccion,
                    audioPista: e.target.value,
                  })
                }
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                {pistasAudioBase.map((pista) => (
                  <option
                    key={pista}
                    value={pista}
                    className="bg-gray-900 text-white"
                  >
                    {pista}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex bg-black/40 rounded-xl p-1 mb-6 border border-white/5">
                <button
                  onClick={() => setModoIngreso("simple")}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${modoIngreso === "simple" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                  Ejercicio Simple
                </button>
                <button
                  onClick={() => setModoIngreso("combinado")}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${modoIngreso === "combinado" ? "bg-fuchsia-500/20 text-fuchsia-400" : "text-gray-500 hover:text-gray-300"}`}
                >
                  Superset / Complex
                </button>
              </div>

              {/* MODO SIMPLE */}
              {modoIngreso === "simple" ? (
                <form
                  onSubmit={agregarEjercicioSimple}
                  className="flex gap-2 mb-4 relative overflow-visible"
                >
                  <button
                    type="button"
                    onClick={() => setModalBibliotecaAbierto(true)}
                    className="p-3 bg-white/5 hover:bg-cyan-500/20 border border-white/10 rounded-xl text-cyan-400 transition-all shrink-0"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </button>

                  <div className="flex-1 relative min-w-0">
                    <input
                      type="text"
                      placeholder="Buscar o escribir..."
                      value={nuevoEjercicio.nombre}
                      onChange={(e) => {
                        setNuevoEjercicio({
                          ...nuevoEjercicio,
                          nombre: e.target.value,
                        });
                        setMostrarSugerencias(true);
                      }}
                      onFocus={() => setMostrarSugerencias(true)}
                      onBlur={() =>
                        setTimeout(() => setMostrarSugerencias(false), 200)
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                    />

                    {mostrarSugerencias &&
                      nuevoEjercicio.nombre.length > 0 &&
                      sugerenciasFiltradas.length > 0 && (
                        <ul className="absolute z-50 w-full bg-gray-800 border border-cyan-500/30 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-xl">
                          {sugerenciasFiltradas.map((ej) => (
                            <li
                              key={ej.id}
                              onMouseDown={() => manejarSeleccion(ej.name)}
                              className="p-3 hover:bg-cyan-500/30 cursor-pointer text-white text-sm border-b border-white/5 last:border-0 flex justify-between items-center"
                            >
                              <span>{ej.name}</span>
                              <span className="text-xs text-cyan-300 font-mono">
                                {ej.equipment}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>

                  <input
                    type="text"
                    placeholder="Reps"
                    value={nuevoEjercicio.cantidad}
                    onChange={(e) =>
                      setNuevoEjercicio({
                        ...nuevoEjercicio,
                        cantidad: e.target.value,
                      })
                    }
                    className="w-16 md:w-20 shrink-0 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 text-center"
                  />
                  <button
                    type="submit"
                    className="px-4 shrink-0 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-white transition-all"
                  >
                    +
                  </button>
                </form>
              ) : (
                /* MODO COMBINADO / SUPERSET */
                <div className="bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-2xl p-4 mb-6 relative overflow-visible">
                  <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-4 block">
                    Constructor de Superset
                  </span>
                  <form
                    onSubmit={agregarNombreAlBloqueCombinado}
                    className="flex gap-2 mb-4"
                  >
                    <button
                      type="button"
                      onClick={() => setModalBibliotecaAbierto(true)}
                      className="p-3 shrink-0 bg-white/5 hover:bg-fuchsia-500/20 border border-white/10 rounded-xl text-fuchsia-400 transition-all"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </button>

                    <div className="flex-1 relative min-w-0">
                      <input
                        type="text"
                        placeholder="Ej: Sentadilla..."
                        value={nuevoEjercicio.nombre}
                        onChange={(e) => {
                          setNuevoEjercicio({
                            ...nuevoEjercicio,
                            nombre: e.target.value,
                          });
                          setMostrarSugerencias(true);
                        }}
                        onFocus={() => setMostrarSugerencias(true)}
                        onBlur={() =>
                          setTimeout(() => setMostrarSugerencias(false), 200)
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500"
                      />

                      {mostrarSugerencias &&
                        nuevoEjercicio.nombre.length > 0 &&
                        sugerenciasFiltradas.length > 0 && (
                          <ul className="absolute z-50 w-full bg-gray-800 border border-fuchsia-500/30 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-xl">
                            {sugerenciasFiltradas.map((ej) => (
                              <li
                                key={ej.id}
                                onMouseDown={() => manejarSeleccion(ej.name)}
                                className="p-3 hover:bg-fuchsia-500/30 cursor-pointer text-white text-sm border-b border-white/5 last:border-0 flex justify-between items-center"
                              >
                                <span>{ej.name}</span>
                                <span className="text-xs text-fuchsia-300 font-mono">
                                  {ej.equipment}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>

                    <button
                      type="submit"
                      className="px-4 shrink-0 bg-fuchsia-500/20 hover:bg-fuchsia-500/40 text-fuchsia-300 rounded-xl font-bold transition-all"
                    >
                      Sumar
                    </button>
                  </form>
                  {bloqueCombinadoTemp.length > 0 && (
                    <div className="flex flex-col gap-1 mb-6 border-l-2 border-fuchsia-500/50 pl-3">
                      {bloqueCombinadoTemp.map((ej, i) => (
                        <span
                          key={i}
                          className="text-gray-300 text-sm flex items-center gap-2"
                        >
                          {i > 0 && (
                            <span className="text-fuchsia-500 font-bold">
                              +
                            </span>
                          )}{" "}
                          {ej}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-fuchsia-500/20 pt-4">
                    <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider mb-2 block">
                      Repeticiones Totales del Bloque
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ej: 4 Rondas o 10x10x8"
                        value={cantidadBloqueCombinado}
                        onChange={(e) =>
                          setCantidadBloqueCombinado(e.target.value)
                        }
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500"
                      />
                      <button
                        type="button"
                        onClick={confirmarBloqueCombinado}
                        disabled={bloqueCombinadoTemp.length < 2}
                        className="px-6 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-gray-800 text-white rounded-xl font-bold transition-all"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista Temporal de la Etapa */}
              {etapaEnConstruccion.listaEjercicios.length > 0 && (
                <div className="bg-black/20 rounded-2xl p-4 border border-white/5 flex flex-col gap-2 mt-2">
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                    Cargado en la tarjeta:
                  </span>
                  {etapaEnConstruccion.listaEjercicios.map((bloque, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm p-3 bg-white/5 border border-white/5 rounded-xl"
                    >
                      <div className="flex flex-col">
                        {bloque.tipo === "simple" && (
                          <span>
                            {bloque.ejercicio.nombre}{" "}
                            <span className="text-cyan-400 font-mono ml-2">
                              {bloque.ejercicio.cantidad}
                            </span>
                          </span>
                        )}
                        {bloque.tipo === "combinado" && (
                          <span className="text-gray-200">
                            {bloque.ejercicios.map((ej, i) => (
                              <React.Fragment key={i}>
                                {i > 0 && (
                                  <span className="text-fuchsia-400 font-bold mx-1">
                                    +
                                  </span>
                                )}
                                {ej}
                              </React.Fragment>
                            ))}
                            <span className="text-fuchsia-400 font-mono ml-2">
                              ({bloque.cantidad})
                            </span>
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => eliminarBloqueDeEtapa(index)}
                        className="text-gray-500 hover:text-rose-500"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={agregarEtapa}
              disabled={etapaEnConstruccion.listaEjercicios.length === 0}
              className="mt-8 w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 rounded-xl font-bold text-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] disabled:shadow-none"
            >
              {etapaEnConstruccion.id !== "temp"
                ? "Guardar Cambios de la Etapa"
                : "Confirmar y Agregar Etapa a la Rutina"}
            </button>
          </div>
        </div>

        {/* PANEL DERECHO: VISTA PREVIA Y ETAPAS */}
        <div className="w-full lg:w-1/2 bg-black/20 border border-white/5 rounded-[2rem] p-6 backdrop-blur-sm overflow-y-auto no-scrollbar">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Vista Previa
          </h2>
          <div className="mb-8 opacity-90 scale-95 origin-top-left min-h-[150px]">
            <PostIt etapa={etapaEnConstruccion} />
          </div>

          {etapas.length > 0 && (
            <>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-t border-white/10 pt-6">
                Etapas Guardadas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {etapas.map((etapa) => (
                  <div
                    key={etapa.id}
                    className="scale-90 origin-top relative group"
                  >
                    <PostIt etapa={etapa} />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all">
                      <button
                        onClick={() => editarEtapa(etapa.id)}
                        className="p-4 bg-cyan-500 text-black rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-110"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => eliminarEtapa(etapa.id)}
                        className="p-4 bg-rose-500 text-white rounded-full shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-110"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL: BIBLIOTECA LOCAL Y CREADOR */}
      {modalBibliotecaAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-[2rem] p-6 md:p-8 w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(34,211,238,0.1)] relative">
            <button
              onClick={() => setModalBibliotecaAbierto(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-1">
                  Biblioteca de Ejercicios
                </h2>
                <p className="text-gray-400 text-sm">
                  Tu diccionario personal.
                </p>
              </div>
              {!creandoEjercicio && (
                <button
                  onClick={() => {
                    setEjercicioAEditar({
                      id: null,
                      name: "",
                      category: "Fuerza",
                      equipment: "Peso Corporal",
                    });
                    setCreandoEjercicio(true);
                  }}
                  className="px-4 py-2 bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30 hover:bg-fuchsia-600/40 rounded-xl font-bold transition-all text-sm"
                >
                  + Añadir Nuevo
                </button>
              )}
            </div>

            {/* Formulario de Creación/Edición */}
            {creandoEjercicio ? (
              <form
                onSubmit={guardarEjercicioPersonalizado}
                className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">
                  {ejercicioAEditar.id
                    ? "Editar Ejercicio"
                    : "Crear Nuevo Ejercicio"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-2 uppercase font-bold">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={ejercicioAEditar.name}
                      onChange={(e) =>
                        setEjercicioAEditar({
                          ...ejercicioAEditar,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500"
                      placeholder="Ej: Thruster con Mancuernas"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-2 uppercase font-bold">
                      Categoría
                    </label>
                    <input
                      type="text"
                      required
                      value={ejercicioAEditar.category}
                      onChange={(e) =>
                        setEjercicioAEditar({
                          ...ejercicioAEditar,
                          category: e.target.value,
                        })
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500"
                      placeholder="Ej: Fuerza, Cardio..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-2 uppercase font-bold">
                      Equipamiento
                    </label>
                    <input
                      type="text"
                      value={ejercicioAEditar.equipment}
                      onChange={(e) =>
                        setEjercicioAEditar({
                          ...ejercicioAEditar,
                          equipment: e.target.value,
                        })
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500"
                      placeholder="Ej: Pesa Rusa, TRX..."
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setCreandoEjercicio(false)}
                    className="px-6 py-2 bg-gray-800 text-white rounded-xl font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-fuchsia-600 text-white rounded-xl font-bold"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Buscar por nombre, equipo o categoría..."
                  value={busquedaEjercicio}
                  onChange={(e) => setBusquedaEjercicio(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 appearance-none min-w-[150px] capitalize"
                >
                  <option value="Todos">Todas las categorías</option>
                  {[
                    ...new Set(
                      ejerciciosPersonalizados.map((ej) => ej.category),
                    ),
                  ]
                    .filter(Boolean)
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Listado de Biblioteca */}
            {!creandoEjercicio && (
              <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-2 pb-4">
                {ejerciciosPersonalizados
                  .filter(
                    (ej) =>
                      filtroCategoria === "Todos" ||
                      ej.category === filtroCategoria,
                  )
                  .filter(
                    (ej) =>
                      (ej.name &&
                        ej.name
                          .toLowerCase()
                          .includes(busquedaEjercicio.toLowerCase())) ||
                      (ej.equipment &&
                        ej.equipment
                          .toLowerCase()
                          .includes(busquedaEjercicio.toLowerCase())),
                  )
                  .map((ej, i) => (
                    <div
                      key={i}
                      className={`flex flex-col text-left p-4 rounded-2xl transition-all group relative border bg-fuchsia-500/5 border-fuchsia-500/30`}
                    >
                      <button
                        onClick={() => manejarSeleccion(ej.name)}
                        className="flex-1 w-full text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-lg group-hover:text-cyan-300 capitalize pr-8">
                            {ej.name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-3 w-full">
                          <span className="text-xs font-mono bg-black/50 text-gray-400 px-2 py-1 rounded-md capitalize">
                            {ej.equipment || "N/A"}
                          </span>
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                            {ej.category || "N/A"}
                          </span>
                        </div>
                      </button>

                      {/* Botones Flotantes de Edición */}
                      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => abrirEdicionEjercicio(e, ej)}
                          className="p-1 text-gray-400 hover:text-cyan-400"
                          title="Editar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) =>
                            eliminarEjercicioPersonalizado(e, ej.id)
                          }
                          className="p-1 text-gray-400 hover:text-rose-500"
                          title="Eliminar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
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
