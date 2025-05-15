"use client";

import { CustomTable } from "@/components";
import { formatMoney } from "@/helpers";
import { useSearchParams } from "@/hooks";
import { ReporteRange, Reportes } from "@/interfaces";
import { parseDate } from "@internationalized/date";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  cn,
  DateRangePicker,
  Divider,
  ScrollShadow,
} from "@nextui-org/react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { ReporteDiario } from "./ReporteDiario";



interface Props {
  groupedData: { reportes: ReporteRange[]; finances: Reportes };
  startDate?: string;
  endDate?: string;
}

export const ReportesManager = ({ groupedData, startDate, endDate }: Props) => {

  const { filters, handleFilterChange, handleApplyFilters } = useSearchParams({
    startDate: startDate || "",
    endDate: endDate || "",
  });

  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <div className="flex gap-2">
          <DateRangePicker
            aria-label="Date range picker for reports"
            className="lg:w-72"
            size="md"
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
          <Button className="btn btn-primary px-8" onClick={handleApplyFilters}>
            Aplicar filtros
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            as={Link}
            href="/plataforma/reportes/gastos-fijos"
            className="btn btn-primary"
          >
            Editar gastos fijos
          </Button>
          <Button
            as={Link}
            href="/plataforma/reportes/crear"
            className="btn btn-black"
          >
            Crear reporte
          </Button>
        </div>
      </div>
      {groupedData ? (
        <>
          <Divider className="my-4" />

          <ReporteDiario
            dailyReports={[groupedData.finances]}
            endDate={new Date(endDate!).toString()}
            startDate={new Date(startDate!).toString()}
            isTotalReport
          />
          {groupedData.reportes?.map(
            ({ dailyReports, endDate, startDate }, i) => (
              <>
                <Divider className="my-4" />
                <ReporteDiario
                  key={startDate}
                  dailyReports={dailyReports}
                  startDate={startDate}
                  endDate={endDate}
                />
              </>
            )
          )}
        </>
      ) : (
        <div className="">
          <Divider className="my-4" />
          {startDate && endDate ? (
            <h2 className="subtitle">No hay reportes para mostrar</h2>
          ) : (
            <h2 className="subtitle">
              Selecciona un rango de fechas para ver los reportes
            </h2>
          )}
        </div>
      )}
    </div>
  );
};
