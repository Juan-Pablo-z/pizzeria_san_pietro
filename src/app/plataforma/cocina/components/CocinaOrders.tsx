"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { OrdenPendiente } from "@/interfaces";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import OrderCard from "./OrderCard";
import { toast } from "react-toastify";
import { updateStatusFactura } from "@/actions/facturas.actions";
import { Status } from "@/enum";
import { pusherClient } from "@/lib/pusher";
import { useSound } from "@/hooks/use-sound";
import { WebSocketEvents } from "@/enum/websocket-events.enum";
import { WebSocketChannels } from "@/enum/websocket-channels";

interface Props {
  orders: OrdenPendiente[];
}

export const CocinaOrders: React.FC<Props> = ({ orders }) => {
  const [orderList, setOrderList] = useState<OrdenPendiente[]>(orders);
  const orderCodFac = useMemo(
    () => orderList.map((col) => col.cod_fac),
    [orderList]
  );

  const [activeOrder, setActiveOrder] = useState<OrdenPendiente | null>(null);

  const handleCompleteOrder = async (orderCod: number) => {
    try {
      await updateStatusFactura(orderCod, Status.ENTREGADO, false);
      setOrderList((orders) =>
        orders.filter((order) => order.cod_fac !== orderCod)
      );
      toast.success(`Orden ${orderCod} completada`);
    } catch (error) {
      toast.error("Error al completar la orden");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Order") {
      setActiveOrder(event.active.data.current.order);
      return;
    }
  };
  const onDragEnd = (event: DragEndEvent) => {
    setActiveOrder(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Order";
    if (!isActiveAColumn) return;

    setOrderList((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.cod_fac === activeId
      );

      const overColumnIndex = columns.findIndex(
        (col) => col.cod_fac === overId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };
  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { playNotificationSound } = useSound();

  const uniqueOrders = useMemo(
    () =>
      orderList.filter((value, index, self) => self.indexOf(value) === index),
    [orderList]
  );

  useEffect(() => {
    pusherClient.subscribe(WebSocketChannels.ORDERS);

    pusherClient.bind(WebSocketEvents.NEW_ORDER, (data: OrdenPendiente) => {
      toast.success("Nueva orden recibida", { toastId: data.cod_fac });
      playNotificationSound();
      setOrderList((orders) => [...orders, data]);
    });

    pusherClient.bind(WebSocketEvents.COMPLETE_ORDER, ({ cod_fac }: any) => {
      const order = orderList.find((order) => order.cod_fac === cod_fac);
      if (!order) return;
      playNotificationSound();
      toast.success("Orden completada", { toastId: cod_fac });
      setOrderList((orders) =>
        orders.filter((order) => order.cod_fac !== cod_fac)
      );
    });

    pusherClient.bind(
      WebSocketEvents.UPDATE_ORDER,
      ({ cod_fac, status }: any) => {
        const order = orderList.find((order) => order.cod_fac === cod_fac);
        if (!order) return;
        const message =
          status === Status.ENTREGADO
            ? `Orden #${cod_fac} completada`
            : status === Status.PAGADO
            ? `Orden #${cod_fac} pagada`
            : status === Status.CANCELADO
            ? `Orden #${cod_fac} cancelada`
            : "";

        if (message) {
          playNotificationSound();
          toast.success(message, { toastId: cod_fac });
        }

        setOrderList((orders) =>
          orders.filter((order) => order.cod_fac !== cod_fac)
        );
      }
    );

    return () => pusherClient.unsubscribe(WebSocketChannels.ORDERS);
  }, [playNotificationSound]);

  return (
    <div className="main-container !px-0">
      <div className="px-4 pd:px-6 lg:px-8 mb-4">
        <h1 className="title">Órdenes de cocina</h1>
      </div>

      {uniqueOrders.length ? (
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="flex gap-4 overflow-x-auto no-scrollbar min-h-screen">
            <div className="flex gap-4 px-4 pd:px-6 lg:px-8 pb-4">
              <SortableContext items={orderCodFac}>
                {uniqueOrders.map((col) => (
                  <OrderCard
                    key={col.cod_fac}
                    order={col}
                    handleCompleteOrder={handleCompleteOrder}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
          {isClient
            ? createPortal(
                <DragOverlay>
                  {activeOrder && (
                    <OrderCard
                      order={activeOrder}
                      handleCompleteOrder={handleCompleteOrder}
                    />
                  )}
                </DragOverlay>,
                document?.body
              )
            : null}
        </DndContext>
      ) : (
        <div className="px-4 pd:px-6 lg:px-8 grid mt-32 place-content-center">
          <div className="text-center text-zinc-400">
            <i className="i-ep-dish text-center text-9xl" />
            <h2 className="text-center text-xl font-bold">
              No hay órdenes pendientes
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};
