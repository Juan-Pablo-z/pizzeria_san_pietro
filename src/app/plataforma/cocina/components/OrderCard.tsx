import { formatHour, formatMoney, getImage } from "@/helpers";
import { OrdenPendiente } from "@/interfaces";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  cn,
  Divider,
} from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";

interface Props {
  order: OrdenPendiente;
  handleCompleteOrder: any;
}

const OrderCard: React.FC<Props> = ({ order, handleCompleteOrder }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: order.cod_fac,
    data: {
      type: "Order",
      order,
    },
    disabled: isLoading,
  });

  const completeOrder = async () => {
    setIsLoading(true);
    await handleCompleteOrder(order.cod_fac);
    setIsLoading(false);
  };

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div ref={setNodeRef}>
      <Card
        style={style}
        className={cn(
          "flex flex-col w-[280px] flex-initial bg-default-100 shadow-md relative rounded-lg",
          {
            "opacity-50": isDragging, // Cambia opacidad al arrastrar
          }
        )}
      >
        {/* Card Header */}
        <CardHeader
          className="flex-none bg-dark rounded-t-md py-4 px-3 relative transition-all hover:bg-zinc-700 group"
          {...attributes}
          {...listeners}
        >
          <div
            className={cn(
              "absolute -left-[4px] top-1/2 transform -translate-y-1/2 h-[60%] w-1 group-hover:w-2 transition-all bg-primary rounded"
            )}
          ></div>
          <div className="flex items-center justify-between w-full gap-3">
            <div className="text-lg font-semibold text-white capitalize">
              Orden #{order.cod_fac}
            </div>
            <Checkbox
              onChange={completeOrder}
              color="primary"
              isDisabled={isLoading}
            />
          </div>
        </CardHeader>

        {/* Card Content */}
        <CardBody>
          <div className="flex items-center gap-1">
            <i className="i-mdi-user" />
            <strong>{order.dtipo_cliente}</strong>
          </div>
          <Divider className="my-2" />
          {order.mesa_fac ? (
            <>
              <div className="flex items-center gap-1">
                <i className="i-material-symbols-table-bar-rounded" />
                <span>
                  Mesa: <strong>{order.mesa_fac}</strong>
                </span>
              </div>
              <Divider className="my-2" />
            </>
          ) : null}
          {order.nom_cliente ? (
            <>
              <div className="flex items-center gap-1">
                <i className="i-ph-user-list-fill" />
                <span>{order.nom_cliente}</span>
              </div>
              <Divider className="my-2" />
            </>
          ) : null}

          <p className="text-sm text-default-700">
            <strong>Hora:</strong> {formatHour(order.hora_fac)}
          </p>
          <Divider className="my-2" />
          {order.obs_fac ? (
            <>
              <div className="text-sm text-default-700">
                <strong>Observaciones:</strong>
                <p>{order.obs_fac}</p>
              </div>
              <Divider className="my-2" />
            </>
          ) : null}

          <ul className="space-y-4 mt-2">
            {order.productos.map((p) => (
              <li key={p.cod_prod} className="flex gap-2">
                <Image
                  width={44}
                  height={44}
                  src={getImage(p.img_prod)}
                  alt={p.nom_prod}
                  className="aspect-square object-cover object-center rounded-md"
                />
                <div className="flex flex-col">
                  <strong className="text-md">{p.nom_prod}</strong>
                  <span className="text-sm text-gray-600">
                    Cantidad: <strong>{p.cantidad_platos}</strong>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default OrderCard;
