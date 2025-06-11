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
} from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { StatusTareas } from "@/enum/status-tareas.enum";
import { toast } from "react-toastify";

interface User {
  ced_user: string;
  nom_user: string;
}

interface Props {
  users: User[];
    prioridades: Prioridad[];
}

interface Prioridad {
  id_prioridad: number;
  nivel: string;
}

interface UserFormData {
  titulo: string;
  descripcion: string;
}

export default function CrearTareas({ users, prioridades }: Props): JSX.Element {
  const { data: session } = useSession();
  const [selectedPrioridad, setSelectedPrioridad] = useState("");
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
    if (!selectedUser || !isValidRange || !session?.user?.ced_user) return;

    setIsLoading(true);

    try {
      await createTarea({
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha_limite: dateRange.end,
        id_asignado: selectedUser,
        id_creador: session.user.ced_user,
        id_estado: StatusTareas.PENDIENTE,
        id_prioridad: Number(selectedPrioridad), 
      });

      reset();
      setSelectedUser("");
      setSelectedPrioridad("");
      setDateRange({ start: "", end: "" });
      toast.success("Tarea editada correctamente");
    } catch (error) {
      toast.error("Error al crear tarea");
      console.error("Error al crear tarea:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 grid items-center lg:grid-cols-6">
      <Card className="p-4 animate__fade-in-up lg:col-span-4 lg:col-start-2 ">
        <CardBody>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              {...register("titulo", { required: true })}
              fullWidth
              labelPlacement="outside"
              size="md"
              type="text"
              placeholder="Ingrese el titulo de la tarea"
              isRequired
              label="Titulo de la tarea"
            ></Input>
            <Input
              {...register("descripcion", { required: true })}
              label="Descripción de la tarea"
              fullWidth
              labelPlacement="outside"
              size="md"
              type="text"
              placeholder="Ingrese la descripción de la tarea"
              isRequired
            ></Input>
            <DateRangePicker
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
            />
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
            <Select
              label="Prioridad"
              placeholder="Seleccione una prioridad"
              selectedKeys={[selectedPrioridad]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setSelectedPrioridad(value);
              }}
              className="max-w-xs"
              isRequired
            >
              {prioridades.map((prio) => (
                <SelectItem key={prio.id_prioridad}>{prio.nivel}</SelectItem>
              ))}
            </Select>
            <Button
              type="submit"
              isLoading={isLoading}
              isDisabled={
                isLoading || !isValid || !isValidRange || !selectedUser
              }
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
