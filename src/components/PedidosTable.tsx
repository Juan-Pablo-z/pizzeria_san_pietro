/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { capitalazeText, formatHour } from "@/helpers";
import { Pedido } from "@/interfaces";
import React, { useMemo } from "react";
import { CustomTable } from "./CustomTable";
import { PedidosActions } from "./PedidosActions";
import { StatusChip } from "./StatusChip";
import { statusLabels } from "@/enum";

interface Props {
  pedidos: Pedido[];
  showStatusActions?: boolean;
  itemHref: string;
  hasPagination?: boolean;
  paginationProps?: {
    currentPage: number;
    totalPages: number;
    handlePageChange: (page: number) => void;
  };
}

export const PedidosTable: React.FC<Props> = ({
  pedidos,
  showStatusActions = false,
  itemHref,
  hasPagination = false,
  paginationProps,
}) => {
  const items: any[] = useMemo(() => {
    const cols = [
      { header: "Código", accessor: "cod_fac", type: "text" },
      {
        header: "Cliente",
        accessor: "nom_cliente",
        type: "text",
        template: (item: Pedido) => item.nom_cliente || "-",
      },
      {
        header: "Mesa",
        accessor: "mesa_fac",
        type: "text",
        template: (item: Pedido) => item.mesa_fac || "-",
      },
      { header: "Monto Total", accessor: "monto_total", type: "price" },
      {
        header: "Fecha",
        accessor: "fecha_fac",
        type: "text",
        template: (item: Pedido) =>
          `${new Date(item.fecha_fac).toLocaleDateString("es-CO")}`,
      },
      {
        header: "Hora",
        accessor: "hora_fac",
        type: "text",
        template: (item: Pedido) => `${formatHour(item.hora_fac)}`,
      },
      { header: "Tipo cliente", accessor: "dtipo_cliente", type: "text" },
      {
        header: "Estado",
        accessor: "dstatus",
        type: "text",
        template: (item: any) => (
          <StatusChip status={item.fkcods_fac}>
            {(statusLabels as any)[item.fkcods_fac]}
          </StatusChip>
        ),
      },
      {
        header: "Acciones",
        accessor: "",
        template: (item: Pedido) => (
          <PedidosActions
            item={item}
            showStatusActions={showStatusActions}
            itemHref={itemHref}
          />
        ),
      },
    ];

    return cols;
  }, [pedidos]);

  return (
    <CustomTable
      emptyMessage="No hay pedidos registrados"
      columns={items}
      data={pedidos}
      hasPagination={hasPagination}
      paginationProps={paginationProps}
    />
  );
};
