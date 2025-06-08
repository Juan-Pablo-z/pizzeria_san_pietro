"use client";
import { useMemo } from "react";
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

const avatarColors = [
  "bg-blue",
  "bg-success",
  "bg-gray",
  "bg-warning-dark",
  "bg-danger-dark",
  "bg-info-dark",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];

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

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Genera un color consistente basado en el nombre
  const getAvatarColor = (name: string) => {
    let total = 0;
    // Crea un número total  a partir del nombre
    for (let i = 0; i < name.length; i++) {
      total = name.charCodeAt(i) + ((total << 5) - total);
    }
    // Selecciona un color usando el total
    const index = Math.abs(total) % avatarColors.length;
    return avatarColors[index];
  };

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
      <Card className="w-full shadow-md card-tarea-personalizada">
        <CardHeader className="bg-black text-white px-4 py-2 flex items-center gap-3 rounded-t-lg">
          <Tooltip content={name}>
            <div
              className={`w-8 h-8 ${getAvatarColor(
                name
              )} rounded-full flex items-center justify-center text-white font-bold text-sm`}
            >
              {getInitials(name)}
            </div>
          </Tooltip>
          <h2 className="text-lg font-semibold">{title}</h2>
        </CardHeader>
        <CardBody className="flex flex-row justify-between items-center pb-4 pt-4">
          <span >{content}</span>
          {/* Botones flotantes */}
          <div className="hidden group-hover:flex gap-1">
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
        </CardBody>
      </Card>
    </motion.div>
  );
};
