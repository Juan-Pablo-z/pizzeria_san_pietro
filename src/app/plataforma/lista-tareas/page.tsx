"use client";

import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ColumnaTareas } from "./components/ColumnaTareas";
import { ModalEditarTarea } from "./components/ModalEditarTarea";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalConfirmarEliminacion } from "./components/ModalConfirmarEliminacion";
import { toast } from "react-toastify";
import "./css/estilos.css";
import { Divider } from "@heroui/react";



type EstadoTarea = "pendientes" | "enProceso" | "terminadas";

interface Tarea {
  id: string;
  title: string;
  content: string;
  name: string;
}

type ColumnasTareas = Record<EstadoTarea, Tarea[]>;

const initialTareas: ColumnasTareas = {
  pendientes: [{ id: "1", title: "Tarea 1", content: "Contenido de la tarea 1", name:"JP" }],
  enProceso: [{ id: "2", title: "Tarea 2", content: "Contenido de la tarea 2", name:"AN" }],
  terminadas: [{ id: "3", title: "Tarea 3", content: "Contenido de la tarea 3", name:"SF" }],
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
  const [columns, setColumns] = useState<ColumnasTareas>(initialTareas);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  const [columnaEditando, setColumnaEditando] = useState<EstadoTarea | null>(null);

  const handleDragEnd = ({ active, over }: any) => {
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    let sourceColumn: EstadoTarea | null = null;
    let targetColumn: EstadoTarea | null = null;

    for (const key of Object.keys(columns) as EstadoTarea[]) {
      if (columns[key].some((t) => t.id === activeId)) {
        sourceColumn = key;
      }
      if (columns[key].some((t) => t.id === overId) || overId === key) {
        targetColumn = key;
      }
    }

    if (!sourceColumn || !targetColumn) return;

    if (sourceColumn === targetColumn) {
      const tareas = [...columns[sourceColumn]];
      const oldIndex = tareas.findIndex((t) => t.id === activeId);
      const newIndex = tareas.findIndex((t) => t.id === overId);
      const reordered = arrayMove(tareas, oldIndex, newIndex);
      setColumns((prev) => ({ ...prev, [sourceColumn]: reordered }));
    } else {
      const tareaMovida = columns[sourceColumn].find((t) => t.id === activeId);
      if (!tareaMovida) return;
      setColumns((prev) => ({
        ...prev,
        [sourceColumn]: prev[sourceColumn].filter((t) => t.id !== activeId),
        [targetColumn]: [...prev[targetColumn], tareaMovida],
      }));
    }
  };

const handleEliminarTarea = (columna: EstadoTarea, tareaId: string) => {
  setTareaAEliminar({ columna, id: tareaId });
  setModalEliminarAbierto(true);
};

const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
const [tareaAEliminar, setTareaAEliminar] = useState<{ columna: EstadoTarea; id: string } | null>(null);


  const handleEditarTarea = (columna: EstadoTarea, tareaId: string) => {
    const tarea = columns[columna].find((t) => t.id === tareaId);
    if (!tarea) return;
    setTareaEditando(tarea);
    setColumnaEditando(columna);
    setModalAbierto(true);
  };

  const confirmarEliminacion = () => {
  if (!tareaAEliminar) return;

  const { columna, id } = tareaAEliminar;

  setColumns((prev) => ({
    ...prev,
    [columna]: prev[columna].filter((t) => t.id !== id),
  }));

  setModalEliminarAbierto(false);
  setTareaAEliminar(null);

  toast.success("Tarea eliminada correctamente");
};


  const guardarCambiosTarea = (nuevoTitulo: string, nuevoContenido: string) => {
    if (!tareaEditando || !columnaEditando) return;

    setColumns((prev) => ({
      ...prev,
      [columnaEditando]: prev[columnaEditando].map((t) =>
        t.id === tareaEditando.id ? { ...t, title: nuevoTitulo, content: nuevoContenido } : t
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
              onEdit={(tareaId) => handleEditarTarea(columnaId, tareaId)}
              onDelete={(tareaId) => handleEliminarTarea(columnaId, tareaId)}
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
        initialTitle={tareaEditando?.title || ""}
        initialContent={tareaEditando?.content || ""}
      />
    </div>
  );
}

