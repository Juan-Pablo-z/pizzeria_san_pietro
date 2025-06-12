"use client";

import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Card, CardHeader, CardBody } from "@heroui/card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CardTarea } from "./CardTarea";
import { Divider } from "@heroui/divider";
import "../css/estilos.css"; // si estás en components/
import { Tarea } from "../page";

interface Props {
  id: string;
  titulo: string;
  tareas: Tarea[];
  claseFondo: string;
  claseAnimacion: string;
  claseDivider: string;
  onEdit: (tareaId: number) => void;
  onDelete: (tareaId: number) => void;
}

export const ColumnaTareas = ({
  id,
  titulo,
  tareas,
  claseFondo,
  claseAnimacion,
  claseDivider,
  onEdit,
  onDelete,
}: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`transition-shadow ${isOver ? "shadow-2xl scale-[1.01]" : ""}`}
    >
      <Card className={`w-auto lg:h-screen ${claseAnimacion} `}>
        <CardHeader
          className={`flex flex-col items-center text-white ${claseFondo}`}
        >
          <h2 className="text-lg font-semibold text-center capitalize">
            {titulo}
          </h2>
        </CardHeader>
        <Divider className={`bg-${claseDivider}`} />
        <CardBody className="flex flex-col gap-4 p-4 !bg-[#e3eaf2]">
          <SortableContext
            items={tareas.map((t) => t.id_tarea)}
            strategy={verticalListSortingStrategy}
          >
            {tareas.length > 0 ? (
              tareas.map((t) => (
                <CardTarea
                  key={t.id_tarea}
                  id={t.id_tarea}
                  title={t.titulo}
                  content={t.descripcion}
                  name={t.nombre_asignado}
                  onEdit={() => onEdit(t.id_tarea)}
                  onDelete={() => onDelete(t.id_tarea)}
                />
              ))
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center text-gray-400 lg:py-48"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex flex-col items-center">
                  <i className="i-mdi-account-remove text-6xl mb-2 bg-gray" />
                  <p className="text-sm text-gray">No hay tareas</p>
                </div>
              </motion.div>
            )}
          </SortableContext>
        </CardBody>
      </Card>
    </motion.div>
  );
};
