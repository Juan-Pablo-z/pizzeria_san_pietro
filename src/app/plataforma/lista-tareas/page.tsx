"use client";

import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ColumnaTareas } from "./components/ColumnaTareas";
import { ModalEditarTarea } from "./components/ModalEditarTarea";
import { ModalConfirmarEliminacion } from "./components/ModalConfirmarEliminacion";
import { toast } from "react-toastify";
import { Divider } from "@heroui/react";
import { useSession } from "next-auth/react";
import { getTareasPorRol, cambiarEstadoTarea } from "@/actions/tareas-actions";

import "react-toastify/dist/ReactToastify.css";
import "./css/estilos.css";

type EstadoTarea = "pendientes" | "enProceso" | "terminadas";

export interface Tarea {
  id_tarea: number;
  titulo: string;
  fecha_creacion: string;
  fecha_limite: string;
  descripcion: string;
  nombre_asignado: string;
  id_estado: number;
}

type ColumnasTareas = Record<EstadoTarea, Tarea[]>;

const estadoMapeo: Record<number, EstadoTarea> = {
  0: "pendientes",
  1: "enProceso",
  2: "terminadas",
};
const estadoMapeoInverso: Record<EstadoTarea, number> = {
  pendientes: 0,
  enProceso: 1,
  terminadas: 2,
};

const claseFondo: Record<EstadoTarea, string> = {
  pendientes: "header-tablero-pendientes",
  enProceso: "header-tablero-enProceso",
  terminadas: "header-tablero-terminadas",
};

const claseAnimacion: Record<EstadoTarea, string> = {
  pendientes: "card-animada-pendientes",
  enProceso: "card-animada-proceso",
  terminadas: "card-animada-terminadas",
};

const claseDivider: Record<EstadoTarea, string> = {
  pendientes: "secondary",
  enProceso: "dark",
  terminadas: "primary",
};

export default function ListaTareasPage() {
  const { data: session } = useSession();
  const [columns, setColumns] = useState<ColumnasTareas>({
    pendientes: [],
    enProceso: [],
    terminadas: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  const [columnaEditando, setColumnaEditando] = useState<EstadoTarea | null>(null);
  const [tareaAEliminar, setTareaAEliminar] = useState<{ columna: EstadoTarea; id: number } | null>(null);

  useEffect(() => {
    async function cargarTareas() {
      if (!session?.user?.ced_user || session?.user?.fkcod_car_user === undefined) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const tareas = await getTareasPorRol(session.user.ced_user, session.user.fkcod_car_user);
      console.log("🔍 TAREAS RECIBIDAS:", tareas); 
      console.log("🧾 Sesión actual:", session?.user);
      
      
      const agrupadas: ColumnasTareas = {
        pendientes: [],
        enProceso: [],
        terminadas: [],
      };

      tareas.forEach((tarea: any) => {
        const estado = estadoMapeo[tarea.id_estado];
        if (estado) agrupadas[estado].push(tarea);
      });

      console.log(agrupadas);

      setColumns(agrupadas);
      setIsLoading(false);
    }

    cargarTareas();
  }, [session]);

  const handleDragEnd = async ({ active, over }: any) => {
    if (!over) return;

    const activeId = +active.id;
    let sourceColumn: EstadoTarea | null = null;
    let targetColumn: EstadoTarea | null = null;

    // Buscar columna origen
    for (const key of Object.keys(columns) as EstadoTarea[]) {
      if (columns[key].some((t) => t.id_tarea === activeId)) {
        sourceColumn = key;
        break;
      }
    }

    // Determinar columna destino
    if (["pendientes", "enProceso", "terminadas"].includes(over.id)) {
      targetColumn = over.id as EstadoTarea;
    } else {
      for (const key of Object.keys(columns) as EstadoTarea[]) {
        if (columns[key].some((t) => t.id_tarea === +over.id)) {
          targetColumn = key;
          break;
        }
      }
    }

    if (!sourceColumn || !targetColumn) return;

    // Si es la misma columna, reordenar
    if (sourceColumn === targetColumn) {
      const tareas = [...columns[sourceColumn]];
      const oldIndex = tareas.findIndex((t) => t.id_tarea === activeId);
      let newIndex = tareas.findIndex((t) => t.id_tarea === +over.id);
      // Si soltó en el área vacía de la columna, poner al final
      if (["pendientes", "enProceso", "terminadas"].includes(over.id)) {
        newIndex = tareas.length - 1;
      }
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(tareas, oldIndex, newIndex);
        setColumns((prev) => ({ ...prev, [sourceColumn!]: reordered }));
      }
    } else {
      // Mover entre columnas y actualizar en BD
      const tareaMovida = columns[sourceColumn].find((t) => t.id_tarea === activeId);
      if (!tareaMovida) return;

      // Actualiza visualmente primero (optimista)
      setColumns((prev) => ({
        ...prev,
        [sourceColumn]: prev[sourceColumn].filter((t) => t.id_tarea !== activeId),
        [targetColumn]: [...prev[targetColumn], { ...tareaMovida, id_estado: estadoMapeoInverso[targetColumn] }],
      }));

      // Actualiza en la base de datos
      try {
        await cambiarEstadoTarea(activeId, estadoMapeoInverso[targetColumn]);
      } catch (error) {
        toast.error("Error al cambiar el estado de la tarea");
        // Si falla, podrías recargar o revertir el cambio visual si lo deseas
      }
    }
  };

  const handleEliminarTarea = (columna: EstadoTarea, id: number) => {
    setTareaAEliminar({ columna, id });
    setModalEliminarAbierto(true);
  };

  const confirmarEliminacion = () => {
    if (!tareaAEliminar) return;

    const { columna, id } = tareaAEliminar;

    setColumns((prev) => ({
      ...prev,
      [columna]: prev[columna].filter((t) => t.id_tarea !== id),
    }));

    setModalEliminarAbierto(false);
    setTareaAEliminar(null);
    toast.success("Tarea eliminada correctamente");
  };

  const handleEditarTarea = (columna: EstadoTarea, id: number) => {
    const tarea = columns[columna].find((t) => t.id_tarea === id);
    if (!tarea) return;
    setTareaEditando(tarea);
    setColumnaEditando(columna);
    setModalAbierto(true);
  };

  const guardarCambiosTarea = (titulo: string, descripcion: string) => {
    if (!tareaEditando || !columnaEditando) return;

    setColumns((prev) => ({
      ...prev,
      [columnaEditando]: prev[columnaEditando].map((t) =>
        t.id_tarea === tareaEditando.id_tarea ? { ...t, titulo, descripcion } : t
      ),
    }));

    setModalAbierto(false);
    setTareaEditando(null);
    setColumnaEditando(null);
  };

  return (
    <div className="main-container">
      <h1 className="title mb-4">Lista de Tareas</h1>
      <Divider className="my-4" />
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="animate-spin border-t-4 border-primary border-solid w-16 h-16 rounded-full mx-auto shadow-xl mb-6"></div>
          <p className="text-lg text-gray-600 font-medium">Cargando tareas, por favor espera...</p>
        </div>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.entries(columns) as [EstadoTarea, Tarea[]][]).map(([columnaId, tareas]) => (
              <ColumnaTareas
                key={columnaId}
                id={columnaId}
                titulo={
                  columnaId === "enProceso"
                    ? "En Proceso"
                    : columnaId.charAt(0).toUpperCase() + columnaId.slice(1)
                }
                tareas={tareas}
                claseFondo={claseFondo[columnaId]}
                claseAnimacion={claseAnimacion[columnaId]}
                claseDivider={claseDivider[columnaId]}
                cargoUsuario={session?.user?.fkcod_car_user ?? 0}
                onEdit={(id) => handleEditarTarea(columnaId, Number(id))}
                onDelete={(id) => handleEliminarTarea(columnaId, Number(id))}
              />
            ))}
          </div>
        </DndContext>
      )}

      <ModalConfirmarEliminacion
        isOpen={modalEliminarAbierto}
        onClose={() => setModalEliminarAbierto(false)}
        onConfirm={confirmarEliminacion}
      />

      <ModalEditarTarea
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarCambiosTarea}
        initialTitle={tareaEditando?.titulo || ""}
        initialContent={tareaEditando?.descripcion || ""}
      />
    </div>
  );
}