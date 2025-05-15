import { updateStatusFactura } from "@/actions/facturas.actions";
import { Status } from "@/enum";
import { Pedido } from "@/interfaces";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
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
  item: Pedido;
  showStatusActions: boolean;
  itemHref: string;
}

export const PedidosActions: FC<Props> = ({
  item,
  showStatusActions,
  itemHref,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleChangeStatus = async (cod: number, status: Status) => {
    try {
      setIsOpen(false);
      await updateStatusFactura(cod, status);
      router.refresh();
      toast.success("Estado actualizado correctamente");
    } catch (error) {
      toast.error("Error al cambiar el estado del pedido");
    }
  };
  return (
    <div className="flex items-center gap-2">
      {showStatusActions ? (
        <Popover
          color="default"
          placement="bottom"
          isOpen={isOpen}
          onOpenChange={(open) => setIsOpen(open)}
        >
          <PopoverTrigger>
            <Button className="text-dark" color="primary" size="sm">
              Cambiar estado
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 overflow-hidden">
            <div className="flex flex-col gap-2 p-2">
              {item.fkcods_fac !== Status.ENTREGADO ? (
                <Button
                  size="sm"
                  className={orderStatus[Status.ENTREGADO].fullColor}
                  onClick={() =>
                    handleChangeStatus(item.cod_fac, Status.ENTREGADO)
                  }
                >
                  <i className="i-ep-dish" />
                  Marcar como entregado
                </Button>
              ) : null}
              <Button
                size="sm"
                className={orderStatus[Status.PAGADO].fullColor}
                onClick={() => handleChangeStatus(item.cod_fac, Status.PAGADO)}
              >
                <i className="i-mdi-check-circle-outline" />
                Marcar como pagado
              </Button>
              <Button
                size="sm"
                className={orderStatus[Status.CANCELADO].fullColor}
                onClick={() =>
                  handleChangeStatus(item.cod_fac, Status.CANCELADO)
                }
              >
                <i className="i-mdi-cancel-circle-outline" />
                Marcar como cancelado
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : null}
      <Button
        className="bg-blue text-white"
        isIconOnly
        size="sm"
        onClick={() => router.push(`${itemHref}/${item.cod_fac}`)}
      >
        <i className="i-mdi-arrow-top-right" />
      </Button>
    </div>
  );
};
