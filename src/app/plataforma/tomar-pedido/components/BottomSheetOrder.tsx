"use client";

import { createFacturaWithDetails } from "@/actions/facturas.actions"; // Asegúrate de importar la función correctamente
import { ProductQuantity, SelectClientTypes } from "@/components";
import { ClientType, Product } from "@/interfaces";
import { useOrderStore } from "@/store";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";

import { CustomTable } from "@/components/CustomTable";
import { formatMoney } from "@/helpers";
import { Button, Divider, Input } from "@nextui-org/react";

import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";

export const FacturaSchema = z.object({
  nom_cliente: z
    .string()
    .max(100, "El nombre no debe exceder los 100 caracteres"),
  obs_fac: z.string().max(500, "El nombre no debe exceder los 500 caracteres"),
  mesa_fac: z.number(),
});

interface FacturaData {
  nom_cliente: string;
  mesa_fac: string;
  obs_fac: string;
}

interface Props {
  clientTypes: ClientType[];
}

export const BottomSheetOrder: React.FC<Props> = ({ clientTypes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showObservations, setShowObservations] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FacturaData>({});

  const { products, clientType, getTotalPrice, calculateRecargo, clearOrder } =
    useOrderStore();

  const handleCreateOrder: SubmitHandler<FacturaData> = async (data) => {
    setIsLoading(true);

    const { nom_cliente, obs_fac, mesa_fac } = data;

    const factura = {
      monto_total: getTotalPrice(),
      nom_cliente,
      obs_fac,
      fktc_fac: clientType?.cod_tc,
      mesa_fac
    };

    const detalle_factura = products.map((product) => ({
      cantidad_platos: product.quantity,
      precio_base: product.precio_base,
      recargo_clie: calculateRecargo(product.recargos),
      fkcod_prod_dfac: product.cod_prod,
    }));

    try {
      await createFacturaWithDetails(factura, detalle_factura);
      toast.success("Pedido creado exitosamente");
      clearOrder();
      reset();
    } catch (error) {
      toast.error("Error al crear el pedido");
      console.error("Error al crear el pedido:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="order-detail">
        <p className="subtitle">
          Total a pagar: <b> {formatMoney(getTotalPrice())} </b>
        </p>
        <Button
          className="btn btn-primary"
          id="open-bottom-sheet"
          onClick={() => setIsOpen(true)}
        >
          Ver orden
        </Button>
      </div>
      <BottomSheet
        open={isOpen}
        onDismiss={() => setIsOpen(false)}
        style={{
          position: "absolute",
          zIndex: 999,
        }}
        snapPoints={({ minHeight }) => minHeight}
      >
        <form
          onSubmit={handleSubmit(handleCreateOrder)}
          className="px-4 pt-2 md:px-8 lg:px-16"
        >
          <div className="flex items-center justify-between">
            <h2 className="title">Resumen del pedido</h2>
            <button
              className=""
              type="button"
              id="close-bottom-sheet"
              onClick={() => setIsOpen(false)}
            >
              <i className="i-mdi-close"></i>
            </button>
          </div>

          <Divider className="mt-2 mb-2" />

          <div className="mb-2 flex flex-col md:flex-row gap-x-4 gap-y-2">
            <Input
              size="sm"
              width={200}
              label="Nombre del cliente"
              {...register("nom_cliente")}
              isDisabled={isLoading}
              isInvalid={!!errors.nom_cliente}
              errorMessage={errors.nom_cliente?.message}
            />

            <Input
              size="sm"
              width={200}
              label="Número de mesa"
              {...register("mesa_fac")}
              type="number"
              isDisabled={isLoading}
              isInvalid={!!errors.mesa_fac}
              errorMessage={errors.mesa_fac?.message}
            />
          </div>

          <CustomTable
            columns={[
              { accessor: "img_prod", type: "icon", header: "i-mdi-image" },
              { header: "Nombre", accessor: "nom_prod", type: "text" },
              {
                header: "Precio",
                width: 100,
                accessor: "precio_base",
                template: (item: any) =>
                  formatMoney(
                    item.precio_base + calculateRecargo(item.recargos)
                  ),
              },
              {
                header: "Cantidad",
                accessor: "quantity",
                width: 1,
                template: ({ cod_prod }: Product) => (
                  <ProductQuantity productId={cod_prod} />
                ),
              },
              {
                header: "Subtotal",
                accessor: "subtotal",
                width: 100,
                template: (item: any) =>
                  formatMoney(
                    (item.precio_base + calculateRecargo(item.recargos)) *
                      item.quantity
                  ),
              },
            ]}
            data={products}
            footerComponent={
              <div>
                <Divider className="mb-2" />
                <div className="flex gap-6 justify-between items-center text-small">
                  <div className="flex gap-6 pl-3 items-center">
                    <div className="bg-zinc-300 w-8 h-8 grid place-content-center rounded-lg">
                      <i className="i-mdi-user user-icon"></i>
                    </div>
                    <SelectClientTypes clientTypes={clientTypes} />
                  </div>

                  <div className="flex text-small items-center">
                    <div className="px-3">Total a pagar:</div>
                    <div className="w-[100px] px-3  font-bold">
                      {formatMoney(getTotalPrice())}
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          <div className="mt-2">
            <div>
              {!showObservations ? (
                <Button
                  size="sm"
                  onClick={() => setShowObservations(true)}
                  className="btn btn-black"
                >
                  Añadir observaciones
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    onClick={() => {
                      setShowObservations(false);
                      setValue("obs_fac", "");
                    }}
                    className="btn btn-danger"
                  >
                    Quitar observaciones
                  </Button>
                </>
              )}
            </div>
            <motion.textarea
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: showObservations ? "100px" : 0,
                opacity: showObservations ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              style={{
                padding: showObservations ? "8px" : "0",
                marginTop: showObservations ? "8px" : "0",
              }}
              {...register("nom_cliente")}
              placeholder="Ingrese sus observaciones aquí"
              className="observations-textarea"
            />
          </div>
          <Divider className="mb-2" />
          <div className="flex flex-col gap-2 md:flex-row md:justify-between mb-4">
            <span className="subtitle flex items-center justify-between gap-2">
              Total a pagar:{" "}
              <span className="font-bold">{formatMoney(getTotalPrice())}</span>
            </span>
            <Button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Creando pedido..." : "Confirmar orden"}
            </Button>
          </div>
        </form>
      </BottomSheet>
    </>
  );
};
