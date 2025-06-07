"use client";

import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CardTarea } from "./CardTarea";
import {Divider} from "@heroui/divider";
import "../css/estilos.css"; // si estás en components/




interface Tarea {
  id: string;
  title: string;
  content: string;
  name: string;
}

interface Props {
  id: string;
  titulo: string;
  tareas: Tarea[];
  claseFondo: string;
  claseAnimacion: string;
  claseDivider: string;
  onEdit: (tareaId: string) => void;
  onDelete: (tareaId: string) => void;
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
      <Card className={`w-auto h-auto ${claseAnimacion}`}>
        <CardHeader className={`flex flex-col items-center text-white ${claseFondo}`}>
          <h2 className="text-lg font-semibold text-center capitalize">
            {titulo}
          </h2>
        </CardHeader>
        <Divider className={`bg-${claseDivider}`}/>
        <CardBody className="flex flex-col gap-4 p-4">
          <SortableContext items={tareas.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tareas.map((t) => (
              <CardTarea
                key={t.id}
                id={t.id}
                title={t.title}
                content={t.content}
                name={t.name}
                onEdit={() => onEdit(t.id)}
                onDelete={() => onDelete(t.id)}
              />
            ))}
          </SortableContext>
        </CardBody>
      </Card>
    </motion.div>
  );
};

