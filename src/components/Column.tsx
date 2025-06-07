"use client";

import { useDroppable } from "@dnd-kit/core";
import { CardTarea } from "./CardTarea";  // Importa tu componente de tarjeta

interface ColumnProps {
  id: string;
  name: string;
  tasks: { id: string; title: string; content: string }[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const Column: React.FC<ColumnProps> = ({ id, name, tasks, onEdit, onDelete }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="w-full p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold text-center">{name}</h3>
      <div className="space-y-2 mt-4">
        {tasks.map((task) => (
          <CardTarea
            key={task.id}
            id={task.id}
            title={task.title}
            content={task.content}
            columnId={id}
            onEdit={() => onEdit(task.id)}
            onDelete={() => onDelete(task.id)}
          />
        ))}
      </div>
    </div>
  );
};