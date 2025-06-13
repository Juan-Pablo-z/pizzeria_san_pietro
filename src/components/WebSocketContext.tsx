"use client";
import { Session } from "next-auth";
import React, { createContext, useContext } from "react";

interface WebSocketContextProps {}

const WebSocketContext = createContext<WebSocketContextProps>({});

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
  return (
    <WebSocketContext.Provider value={{}}>
      {children}
    </WebSocketContext.Provider>
  );
};
