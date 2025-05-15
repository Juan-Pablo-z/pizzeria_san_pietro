/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { updateStatusFactura } from "@/actions/facturas.actions";
import { CustomTable, StatusChip } from "@/components";
import { Status } from "@/enum";
import { capitalazeText, formatHour, formatMoney } from "@/helpers";
import { SinglePedido } from "@/interfaces";
import {
  Button,
  cn,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "react-toastify";

const orderStatus: Record<
  number,
  {
    fullColor: string;
    dark: string;
    light: string;
    icon: string;
  }
> = {
  [Status.PENDIENTE]: {
    fullColor: "bg-warning-light text-warning-dark",
    dark: "text-warning-dark",
    light: "bg-warning-light",
    icon: "i-mdi-clock-outline",
  },
  [Status.ENTREGADO]: {
    fullColor: "bg-info-light text-info-dark",
    dark: "text-info-dark",
    light: "bg-info-light",
    icon: "i-ep-dish",
  },
  [Status.PAGADO]: {
    fullColor: "bg-success-light text-success-dark",
    dark: "text-success-dark",
    light: "bg-success-light",
    icon: "i-mdi-check-circle-outline",
  },
  [Status.CANCELADO]: {
    fullColor: "bg-danger-light text-danger-dark",
    dark: "text-danger-dark",
    light: "bg-danger-light",
    icon: "i-mdi-cancel-circle-outline",
  },
};

interface Props {
  pedido: SinglePedido;
}

export const SinglePedidoComponent: React.FC<Props> = ({ pedido }) => {
  const router = useRouter();

  const handleChangeStatus = async (cod: number, status: Status) => {
    try {
      await updateStatusFactura(cod, status);
      router.refresh();
      toast.success("Estado actualizado correctamente");
    } catch (error) {
      toast.error("Error al cambiar el estado del pedido");
    }
  };

  const columns = useMemo(() => {
    let columns: any = [
      {
        header: "Vendedor",
        accessor: "nom_user",
        type: "text",
      },
      {
        header: "Cliente",
        accessor: "nom_cliente",
        type: "text",
        template: (item: any) => item.nom_cliente || "-",
      },
      {
        header: "Mesa",
        accessor: "mesa_fac",
        type: "text",
        template: (item: any) => item.mesa_fac || "-",
      },
      {
        header: "Fecha",
        accessor: "fecha_fac",
        type: "text",
        template: (item: any) =>
          `${new Date(item.fecha_fac).toLocaleDateString("es-CO")}`,
      },
      {
        header: "Hora",
        accessor: "hora_fac",
        type: "text",
        template: (item: any) => `${formatHour(item.hora_fac)}`,
      },
      { header: "Tipo cliente", accessor: "dtipo_cliente", type: "text" },
      {
        header: "Estado",
        accessor: "dstatus",
        type: "text",
        template: (item: any) => (
          <StatusChip status={item.fkcods_fac}>
            {capitalazeText(item.dstatus)}
          </StatusChip>
        ),
      },
      {
        header: "Monto Total",
        accessor: "monto_total",
        type: "price",
      },
    ];

    if ([Status.PENDIENTE, Status.ENTREGADO].includes(pedido.fkcods_fac)) {
      columns.push({
        header: "Acciones",
        accessor: "",
        template: (item: any) => (
          <div className="flex gap-2">
            <Popover color="default" placement="bottom">
              <PopoverTrigger>
                <Button className="text-dark" color="primary" size="sm">
                  Cambiar estado
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 overflow-hidden">
                <div className="flex flex-col gap-2 p-2">
                  {pedido.fkcods_fac !== Status.ENTREGADO ? (
                    <Button
                      size="sm"
                      className={orderStatus[Status.ENTREGADO].fullColor}
                      onClick={() =>
                        handleChangeStatus(pedido.cod_fac, Status.ENTREGADO)
                      }
                    >
                      <i className="i-ep-dish" />
                      Marcar como entregado
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    className={orderStatus[Status.PAGADO].fullColor}
                    onClick={() =>
                      handleChangeStatus(pedido.cod_fac, Status.PAGADO)
                    }
                  >
                    <i className="i-mdi-check-circle-outline" />
                    Marcar como pagado
                  </Button>
                  <Button
                    size="sm"
                    className={orderStatus[Status.CANCELADO].fullColor}
                    onClick={() =>
                      handleChangeStatus(pedido.cod_fac, Status.CANCELADO)
                    }
                  >
                    <i className="i-mdi-cancel-circle-outline" />
                    Marcar como cancelado
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ),
      });
    }

    return columns;
  }, [pedido.cod_fac, pedido.fkcods_fac]);

  return (
    <>
      <div className="flex gap-2 items-center">
        <h1 className="title">Pedido #{pedido.cod_fac}</h1>
        <span>|</span>
        <div className="flex gap-1 items-center">
          <div
            className={cn(
              "p-1 rounded-full grid place-content-center",
              orderStatus[pedido.fkcods_fac].fullColor
            )}
          >
            <i className={orderStatus[pedido.fkcods_fac].icon} />
          </div>
          <span className={cn(orderStatus[pedido.fkcods_fac].dark)}>
            {capitalazeText(pedido.dstatus)}
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <CustomTable columns={columns} data={[pedido]} />
        <CustomTable
          columns={[
            { accessor: "img_prod", type: "icon", header: "i-mdi-image" },
            { header: "Nombre", accessor: "nom_prod", type: "text" },
            {
              header: "Cantidad",
              accessor: "cantidad_platos",
              width: 100,
              align: "center",
            },
            {
              header: "Valor und.",
              accessor: "precio_base",
              width: 100,
              template: ({ precio_base, recargo_clie }) =>
                formatMoney(precio_base + recargo_clie),
            },
            {
              header: "Subtotal",
              accessor: "subtotal",
              width: 100,
              template: ({ precio_base, recargo_clie, cantidad_platos }) =>
                formatMoney((precio_base + recargo_clie) * cantidad_platos),
            },
          ]}
          data={pedido.productos}
          footerComponent={
            <div>
              <Divider />
              <div className="flex gap-6 justify-between items-center mt-2">
                <div className="flex gap-6 pl-3 items-center">
                  Observaciones: {pedido.obs_fac || "Sin observaciones"}
                </div>

                <div className="flex text-small items-center">
                  <div className="w-[100px] px-3  font-bold">
                    {formatMoney(pedido.monto_total)}
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
};
