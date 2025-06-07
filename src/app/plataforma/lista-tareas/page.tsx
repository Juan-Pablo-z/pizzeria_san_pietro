"use client";

import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { ColumnaTareas } from "./components/ColumnaTareas";
import { arrayMove } from "@dnd-kit/sortable";
import "./css/estilos.css";

type EstadoTarea = "pendientes" | "enProceso" | "terminadas";

interface Tarea {
  id: string;
  title: string;
  content: string;
}

type ColumnasTareas = Record<EstadoTarea, Tarea[]>;

const initialTareas: ColumnasTareas = {
  pendientes: [{ id: "1", title: "Tarea 1", content: "Contenido de la tarea 1" }],
  enProceso: [{ id: "2", title: "Tarea 2", content: "Contenido de la tarea 2" }],
  terminadas: [{ id: "3", title: "Tarea 3", content: "Contenido de la tarea 3" }],
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

export default function ListaTareasPage() {
  const [columns, setColumns] = useState<ColumnasTareas>(initialTareas);

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

  return (
    <div className="main-container">
      <h1 className="title mb-4">Lista de Tareas</h1>
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
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
