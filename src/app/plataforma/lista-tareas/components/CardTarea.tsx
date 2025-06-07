"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/react";
import { Tooltip } from "@heroui/tooltip";

interface CardTareaProps {
  id: string;
  title: string;
  content: string;
  name: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CardTarea: React.FC<CardTareaProps> = ({
  id,
  title,
  content,
  name,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    animateLayoutChanges: () => true,
  });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition ?? "transform 300ms ease",
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      layout
      layoutId={id}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative group"
    >
      {/* Botones flotantes */}
      <div className="absolute bottom-2 right-2 hidden group-hover:flex gap-1 z-10">
        <Button
          isIconOnly
          size="sm"
          color="primary"
          variant="light"
          onClick={onEdit}
        >
          <i className="i-mdi-pencil" />
        </Button>
        <Button
          isIconOnly
          size="sm"
          color="danger"
          variant="light"
          onClick={onDelete}
        >
          <i className="i-mdi-delete" />
        </Button>
      </div>

      <Card className="w-full shadow-md card-tarea-personalizada">
        <CardHeader className="bg-black text-white px-4 py-2 flex items-center gap-3 rounded-t-lg">
          <Tooltip content={name}>
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {name}
            </div>
          </Tooltip>
          <h2 className="text-lg font-semibold">{title}</h2>
        </CardHeader>
        <CardBody>
          <span>{content}</span>
        </CardBody>
      </Card>
    </motion.div>
  );
};
