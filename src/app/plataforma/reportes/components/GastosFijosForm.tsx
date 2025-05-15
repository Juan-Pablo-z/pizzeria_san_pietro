"use client";

import {
  createGastosFijos,
  createReporteDiario,
} from "@/actions/reportes-action";
import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

const GastosFijosSchema = z.object({
  salarios: z.number().min(0, "Debe ser mayor o igual a 0"),
  arriendo: z.number().min(0, "Debe ser mayor o igual a 0"),
  gas: z.number().min(0, "Debe ser mayor o igual a 0"),
  servicios: z.number().min(0, "Debe ser mayor o igual a 0"),
  vehiculo: z.number().min(0, "Debe ser mayor o igual a 0"),
  banco: z.number().min(0, "Debe ser mayor o igual a 0"),
});

interface GastosFijosFormData {
  salarios: number;
  arriendo: number;
  gas: number;
  servicios: number;
  vehiculo: number;
  banco: number;
}

interface InputProps {
  label: string;
  name: keyof GastosFijosFormData;
}

const GASTOS_OPERATIVOS: InputProps[] = [
  { label: "Salarios", name: "salarios" },
  { label: "Arriendo", name: "arriendo" },
  { label: "Gas", name: "gas" },
  { label: "Servicios", name: "servicios" },
  { label: "Vehículo", name: "vehiculo" },
  { label: "Banco", name: "banco" },
];

interface Props {
  gastosFijos: any;
}

export const GastosFijosForm: React.FC<Props> = ({ gastosFijos }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<GastosFijosFormData>({
    defaultValues: {
      salarios: gastosFijos.salarios || 0,
      arriendo: gastosFijos.arriendo || 0,
      gas: gastosFijos.gas || 0,
      servicios: gastosFijos.servicios || 0,
      vehiculo: gastosFijos.vehiculo || 0,
      banco: gastosFijos.banco || 0,
    },
  });

  const onSubmit: SubmitHandler<GastosFijosFormData> = async (data) => {
    try {
      setIsLoading(true);

      try {
        GastosFijosSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            toast.error(err.message);
          });
          return;
        }
      }
      await createGastosFijos(data);
      toast.success("Gastos fijos cambiados correctamente");
      reset();
      router.push("/plataforma/reportes");
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <section className="flex-1 grid md:grid-cols-2 gap-4">
        {/* Gastos Operativos */}
        <Card className="self-start animate__fade-in-up">
          <CardBody className="p-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {GASTOS_OPERATIVOS.map(({ label, name }) => (
                <Input
                  key={name}
                  labelPlacement="outside"
                  fullWidth
                  label={label}
                  type="number"
                  placeholder={`Ingrese el monto`}
                  {...register(name, { required: true, valueAsNumber: true })}
                  isInvalid={!!errors[name]}
                  errorMessage={errors[name]?.message}
                  isRequired
                />
              ))}
              <Divider />
              <Button
                className="btn btn-primary"
                type="submit"
                isLoading={isLoading}
                isDisabled={isLoading || !isValid}
              >
                {isLoading ? "Cargando..." : "Actualizar gastos fijos"}
              </Button>
            </form>
          </CardBody>
        </Card>
        {/* Botón de Envío */}
      </section>
    </div>
  );
};
