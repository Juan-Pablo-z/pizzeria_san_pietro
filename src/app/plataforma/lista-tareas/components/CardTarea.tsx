"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button, Divider } from "@heroui/react";

interface CardTareaProps {
  id: string;
  title: string;
  content: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CardTarea: React.FC<CardTareaProps> = ({
  id,
  title,
  content,
  onEdit,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <Card className="w-60 card-tarea-personalizada">
        <CardHeader className="bg-dark text-white">
          <h2 className="text-lg font-semibold">{title}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <span>{content}</span>
        </CardBody>
        <CardFooter>
          <div className="flex justify-end gap-2">
            <Button isIconOnly color="primary" variant="ghost" size="sm" onClick={onEdit}>
              <i className="i-mdi-pencil" />
            </Button>
            <Button isIconOnly color="secondary" variant="ghost" size="sm" onClick={onDelete}>
              <i className="i-mdi-delete" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
