"use client";

import { PedidosTable } from "@/components";
import { Status } from "@/enum";
import { WebSocketChannels } from "@/enum/websocket-channels";
import { WebSocketEvents } from "@/enum/websocket-events.enum";
import { useSound } from "@/hooks/use-sound";
import { pusherClient } from "@/lib/pusher";
import React, { FC, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  pedidos: any[];
}

export const CajaTable: FC<Props> = ({ pedidos }) => {
  const [pedidosList, setPedidosList] = useState<any[]>(pedidos);

  useEffect(() => {
    setPedidosList(pedidos);
  }, [pedidos]);

  const uniquePedidos = useMemo(
    () =>
      pedidosList.filter((value, index, self) => self.indexOf(value) === index),
    [pedidosList]
  );

  const { playNotificationSound } = useSound();

  useEffect(() => {
    pusherClient.subscribe(WebSocketChannels.ORDERS);

    pusherClient.bind(WebSocketEvents.NEW_ORDER, (data: any) => {
      toast.success("Nueva orden recibida", { toastId: data.cod_fac });
      playNotificationSound();
      setPedidosList((orders) => [...orders, data]);
    });

    pusherClient.bind(
      WebSocketEvents.UPDATE_ORDER,
      ({ cod_fac, status }: any) => {
        if (status === Status.ENTREGADO) {
          toast.success("Orden completada", { toastId: cod_fac });
          setPedidosList((orders) =>
            orders.map((order) =>
              order.cod_fac === cod_fac
                ? { ...order, fkcods_fac: status }
                : order
            )
          );
        }
      }
    );

    return () => pusherClient.unsubscribe(WebSocketChannels.ORDERS);
  }, [playNotificationSound]);

  return (
    <PedidosTable
      pedidos={uniquePedidos}
      showStatusActions
      itemHref="/plataforma/caja"
    />
  );
};
