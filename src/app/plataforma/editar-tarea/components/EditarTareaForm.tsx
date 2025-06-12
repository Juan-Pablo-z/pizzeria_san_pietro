"use client";

import { editTarea } from "@/actions/tareas-actions";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  DateRangePicker,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { parseDate } from "@internationalized/date";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Props {
  tarea: {
    id_tarea: number;
    titulo: string;
    descripcion: string;
    fecha_limite?: string;
    id_asignado: string;
    id_prioridad: number;
  };
  users: { ced_user: string; nom_user: string }[];
  prioridades: { id_prioridad: number; nivel: string }[];
}

interface FormData {
  titulo: string;
  descripcion: string;
}

export default function EditarTareaForm({ tarea, users, prioridades }: Props) {
  const router = useRouter();

  const [selectedUser, setSelectedUser] = useState(tarea.id_asignado);
  const [selectedPrioridad, setSelectedPrioridad] = useState(String(tarea.id_prioridad));
  const [isLoading, setIsLoading] = useState(false);

  const [dateRange, setDateRange] = useState<{
    start?: string;
    end?: string;
  }>({
    start: tarea.fecha_limite || "",
    end: tarea.fecha_limite || "",
  });

  const isValidRange =
    !!dateRange.start &&
    dateRange.start.length > 0 &&
    !!dateRange.end &&
    dateRange.end.length > 0;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsLoading(true);
      await editTarea(tarea.id_tarea, {
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha_limite: dateRange.end,
        id_asignado: selectedUser,
        id_prioridad: Number(selectedPrioridad),
      });
      toast.success("Tarea actualizada correctamente");
      router.push("/plataforma/lista-tareas");
    } catch (error) {
      toast.error("Error al actualizar tarea");
      console.error("❌ Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 grid items-center lg:grid-cols-6">
      <Card className="p-4 animate__fade-in-up lg:col-span-4 lg:col-start-2">
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("titulo", { required: true })}
              fullWidth
              labelPlacement="outside"
              size="md"
              type="text"
              placeholder="Título"
              label="Título"
              isInvalid={!!errors.titulo}
              errorMessage={errors.titulo?.message}
            />
            <Input
              {...register("descripcion", { required: true })}
              fullWidth
              labelPlacement="outside"
              size="md"
              type="text"
              placeholder="Descripción"
              label="Descripción"
              isInvalid={!!errors.descripcion}
              errorMessage={errors.descripcion?.message}
            />
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
              selectedKeys={[selectedPrioridad]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setSelectedPrioridad(value);
              }}
              className="max-w-xs"
              isRequired
            >
              {prioridades.map((p) => (
                <SelectItem key={p.id_prioridad}>{p.nivel}</SelectItem>
              ))}
            </Select>
            <Button
              type="submit"
              isLoading={isLoading}
              isDisabled={!isValid || isLoading || !selectedUser || !isValidRange}
              className="btn btn-primary"
            >
              Guardar Cambios
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}