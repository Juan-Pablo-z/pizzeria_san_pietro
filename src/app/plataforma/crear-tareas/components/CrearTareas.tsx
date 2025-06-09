"use client";

import {
  Button,
  Card,
  CardBody,
  DateRangePicker,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface User {
  ced_user: string;
  nom_user: string;
}

interface Props {
  users: User[];
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

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isValid },
//   } = useForm<UserFormData>({
//     defaultValues: initialValues,
//   });

  return (
    <div className="mt-6 grid items-center lg:grid-cols-6">
      <Card className="p-4 animate__fade-in-up lg:col-span-4 lg:col-start-2 ">
        <CardBody>
          <form className="flex flex-col gap-4" action="">
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
                      start: parseDate(dateRange.start? dateRange.start : ""),
                      end: parseDate(dateRange.end? dateRange.end : ""),
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
            //   isDisabled={isLoading || !isValid}
              className="btn btn-primary"
            >
              Crear Usuario
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
