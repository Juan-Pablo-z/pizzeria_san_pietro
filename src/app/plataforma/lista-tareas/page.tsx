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
import { getTareasPorRol } from "@/actions/tareas-actions";

import "react-toastify/dist/ReactToastify.css";
import "./css/estilos.css";

type EstadoTarea = "pendientes" | "enProceso" | "terminadas";

export interface Tarea {
  id_tarea: number;
  titulo: string;
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

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  const [columnaEditando, setColumnaEditando] = useState<EstadoTarea | null>(null);
  const [tareaAEliminar, setTareaAEliminar] = useState<{ columna: EstadoTarea; id: number } | null>(null);

  useEffect(() => {
    async function cargarTareas() {
      if (!session?.user?.ced_user || session?.user?.fkcod_car_user === undefined) return;
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
    }

    cargarTareas();
  }, [session]);

  const handleDragEnd = ({ active, over }: any) => {
    if (!over) return;

    const activeId = +active.id;
    const overId = +over.id;

    let sourceColumn: EstadoTarea | null = null;
    let targetColumn: EstadoTarea | null = null;

    for (const key of Object.keys(columns) as EstadoTarea[]) {
      if (columns[key].some((t) => t.id_tarea === activeId)) {
        sourceColumn = key;
      }
      if (columns[key].some((t) => t.id_tarea === overId) || String(overId) === key) {
        targetColumn = key;
      }
    }

    if (!sourceColumn || !targetColumn) return;

    if (sourceColumn === targetColumn) {
      const tareas = [...columns[sourceColumn]];
      const oldIndex = tareas.findIndex((t) => t.id_tarea === activeId);
      const newIndex = tareas.findIndex((t) => t.id_tarea === overId);
      const reordered = arrayMove(tareas, oldIndex, newIndex);
      setColumns((prev) => ({ ...prev, [sourceColumn!]: reordered }));
    } else {
      const tareaMovida = columns[sourceColumn].find((t) => t.id_tarea === activeId);
      if (!tareaMovida) return;

      setColumns((prev) => ({
        ...prev,
        [sourceColumn]: prev[sourceColumn].filter((t) => t.id_tarea !== activeId),
        [targetColumn]: [...prev[targetColumn], tareaMovida],
      }));
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
              onEdit={(id) => handleEditarTarea(columnaId, Number(id))}
              onDelete={(id) => handleEliminarTarea(columnaId, Number(id))}
            />
          ))}
        </div>
      </DndContext>

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
