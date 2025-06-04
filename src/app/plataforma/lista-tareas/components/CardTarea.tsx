"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button, Divider } from "@heroui/react";

interface CardTarea {
  title: string;
  content: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CardTarea: React.FC<CardTarea> = ({ title, content, onEdit, onDelete }) => {
  return (
    <Card className="w-60">
      <CardHeader className="bg-dark text-white">
        <div className="w-full flex">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col items-center gap-2">
          <span>{content}</span>
        </div>
      </CardBody>
      <CardFooter>
        <div className="w-full flex justify-end items-end gap-2">
          <Button
            isIconOnly
            color="primary"
            variant="ghost"
            size="sm"
            onClick={onEdit}
          >
            <i className="i-mdi-pencil" />
          </Button>
          <Button
            isIconOnly
            color="secondary"
            variant="ghost"
            size="sm"
            onClick={onDelete}
          >
            <i className="i-mdi-delete" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
