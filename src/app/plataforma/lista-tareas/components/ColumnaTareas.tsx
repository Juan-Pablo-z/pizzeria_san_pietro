"use client";

import { useDroppable } from "@dnd-kit/core";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CardTarea } from "./CardTarea";

interface Tarea {
id: string;
title: string;
content: string;
}

interface Props {
id: string;
titulo: string;
tareas: Tarea[];
claseFondo: string;
claseAnimacion: string;
}

export const ColumnaTareas = ({ id, titulo, tareas, claseFondo, claseAnimacion }: Props) => {
const { setNodeRef } = useDroppable({ id });

return (
    <Card ref={setNodeRef} id={id} className={`w-auto h-auto ${claseAnimacion}`}>
    <CardHeader className={`flex flex-col items-center text-white ${claseFondo}`}>
        <h2 className="text-lg font-semibold text-center capitalize">{titulo}</h2>
    </CardHeader>
    <CardBody className="flex flex-col items-center gap-2 p-4 min-h-[100px]">
        <SortableContext items={tareas.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        {tareas.map((t) => (
            <CardTarea key={t.id} id={t.id} title={t.title} content={t.content} />
        ))}
        </SortableContext>
    </CardBody>
    </Card>
);
};
