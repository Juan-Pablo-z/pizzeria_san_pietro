"use client";
import { OrdenPendiente } from "@/interfaces";
import { pusherClient } from "@/lib/pusher";
import { Session } from "next-auth";
import React, { createContext, useContext, useEffect, useState } from "react";

interface WebSocketContextProps {
  orderList: OrdenPendiente[];
}

const WebSocketContext = createContext<WebSocketContextProps>({
  orderList: [],
});

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) => {
  const [orderList, setOrderList] = useState<any[]>([]);

  return (
    <WebSocketContext.Provider value={{ orderList }}>
      {children}
    </WebSocketContext.Provider>
  );
};
