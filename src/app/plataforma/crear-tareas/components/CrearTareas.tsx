"use client";

import { createTarea } from "@/actions/tareas-actions";
import {
  Button,
  Card,
  CardBody,
  DateRangePicker,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface User {
  ced_user: string;
  nom_user: string;
}

interface Props {
  users: User[];
}

interface UserFormData {
  titulo: string;
  descripcion: string;
}

export default function CrearTareas({ users }: Props): JSX.Element {
  const [selectedUser, setSelectedUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [dateRange, setDateRange] = useState<{
    start?: string;
    end?: string;
  }>({
    start: "",
    end: "",
  });

  const isValidRange =
    !!dateRange.start &&
    dateRange.start.length > 0 &&
    !!dateRange.end &&
    dateRange.end.length > 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UserFormData>({
    mode: "onChange",
  });

   const onSubmit: SubmitHandler<UserFormData> = async (data) => {
    if (!selectedUser || !isValidRange) return;

    setIsLoading(true);

    try {
      await createTarea({
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha_limite: dateRange.end,
        id_asignado: selectedUser,
        id_creador: "ADMIN", // cambia esto por el usuario real logueado
        id_estado: 1, // 1 = pendientes
        id_prioridad: 1, // puedes cambiar a una prioridad seleccionable
      });

      reset();
      setSelectedUser("");
      setDateRange({ start: "", end: "" });
    } catch (error) {
      console.error("Error al crear tarea:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="mt-6 grid items-center lg:grid-cols-6">
      <Card className="p-4 animate__fade-in-up lg:col-span-4 lg:col-start-2 ">
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              fullWidth
              labelPlacement="outside"
              size="md"
              type="text"
              placeholder="Ingrese el titulo de la tarea"
              isRequired
              label="Titulo de la tarea"
            ></Input>
            <Input
              label="Descripción de la tarea"
              fullWidth
              labelPlacement="outside"
              size="md"
              type="text"
              placeholder="Ingrese la descripción de la tarea"
              isRequired
            ></Input>
              {/* <DateRangePicker
              label="Fecha límite"
              fullWidth
              size="md"
              labelPlacement="outside"
              isRequired
              value={
                isValidRange
                  ? {
                      start: parseDate(dateRange.start || ""),
                      end: parseDate(dateRange.end || ""),
                    }
                  : null
              }
              onChange={(value) => {
                setDateRange({
                  start: value?.start.toString(),
                  end: value?.end.toString(),
                });
              }}
            /> */}
            <Select
              label="Asignar a"
              placeholder="Seleccione un usuario"
              selectedKeys={selectedUser ? [selectedUser] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setSelectedUser(value);
              }}
              className="max-w-xs"
              isRequired
            >
              {users.map((user) => (
                <SelectItem key={user.ced_user}>{user.nom_user}</SelectItem>
              ))}
            </Select>
          <Button
              type="submit"
              isLoading={isLoading}
              isDisabled={isLoading || !isValid || !isValidRange || !selectedUser}
              className="btn btn-primary"
            >
              Crear Tarea
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
