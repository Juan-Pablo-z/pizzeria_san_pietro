"use client";

import { PedidosTable } from "@/components/PedidosTable";
import { useSearchParams } from "@/hooks";
import { ClientType, Pedido } from "@/interfaces";
import { parseDate } from "@internationalized/date";
import {
  Button,
  DateRangePicker,
  Divider,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
interface Props {
  pedidos: Pedido[];
  totalPages: number;
  clientTypes: ClientType[];
  filters: {
    currentPage: number;
    pageSize: number;
    fktc_fac?: string;
    sortDirection?: "asc" | "desc";
    startDate?: string;
    endDate?: string;
  };
}

export const PedidosManager: React.FC<Props> = ({
  pedidos,
  totalPages,
  clientTypes,
  filters: {
    currentPage,
    pageSize,
    fktc_fac,
    sortDirection,
    startDate,
    endDate,
  },
}) => {

  const {
    filters,
    handleFilterChange,
    handlePageChange,
    handleApplyFiltersWithPage
  }  = useSearchParams({
    fktc_fac: fktc_fac || "",
    sortDirection: sortDirection || "desc",
    startDate: startDate || "",
    endDate: endDate || "",
  })

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-col lg:flex-row justify-between mb-4 gap-y-2 lg:items-end">
        <div className="flex flex-col md:flex-row gap-2">
          <DateRangePicker
            className="lg:w-72"
            label="Filtrar por Fecha"
            value={
              [filters.startDate, filters.endDate].every((e) => e.length)
                ? {
                    start: parseDate(filters.startDate),
                    end: parseDate(filters.endDate),
                  }
                : null
            }
            onChange={(value) => {
              handleFilterChange("startDate", value.start.toString());
              handleFilterChange("endDate", value.end.toString());
            }}
          />

          <div className="flex flex-row gap-2">
            <Select
              size="md"
              className="md:w-48"
              startContent={<i className="i-mdi-user" />}
              label="tipo de empleado"
              selectedKeys={new Set([filters.fktc_fac || "all"])}
              onSelectionChange={(values) =>
                handleFilterChange("fktc_fac", values.currentKey || "")
              }
            >
              {clientTypes.map((tc) => (
                <SelectItem key={tc.cod_tc} value={tc.cod_tc}>
                  {tc.dtipo_cliente}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Ordenar por fecha"
              selectedKeys={new Set([filters.sortDirection || ""])}
              onSelectionChange={(values) =>
                handleFilterChange("sortDirection", values.currentKey || "")
              }
              className="md:w-48"
            >
              <SelectItem key={"asc"} value="asc">
                Ascendente
              </SelectItem>
              <SelectItem key={"desc"} value="desc">
                Descendente
              </SelectItem>
            </Select>
          </div>
        </div>
        <Divider className="md:hidden" />
        <Button onClick={() => handleApplyFiltersWithPage()} className="btn btn-black">
          Aplicar Filtros
        </Button>
      </div>

      {/* Tabla */}
      <PedidosTable
        itemHref="/plataforma/pedidos"
        pedidos={pedidos}
        hasPagination
        paginationProps={{
          currentPage,
          totalPages,
          handlePageChange,
        }}
      />
    </div>
  );
};
