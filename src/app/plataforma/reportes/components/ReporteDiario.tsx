import { CustomTable } from "@/components";
import { sumar } from "@/helpers/math.helper";
import { ReporteRange, Reportes } from "@/interfaces";
import { Chip, ScrollShadow } from "@nextui-org/react";
import clsx from "clsx";
import { useMemo } from "react";
import { CardTotal } from "./CardTotal";

export const ReporteDiario: React.FC<ReporteRange> = ({
  dailyReports,
  endDate,
  startDate,
  isTotalReport = false,
}) => {
  const totals: Reportes = useMemo(() => {
    return dailyReports.reduce(
      (totals: any, row: any) => {
        Object.keys(row).forEach((key) => {
          if (key !== "fecha_rd") totals[key] = (totals[key] || 0) + row[key];
        });
        return totals;
      },
      { fecha_rd: "TOTAL" }
    );
  }, [dailyReports, isTotalReport]);

  const data = useMemo(() => {
    if (isTotalReport) return [totals];
    return [...dailyReports, totals];
  }, [dailyReports, totals]);

  const columnsGroup1: any = useMemo(() => {
    const colums = isTotalReport
      ? []
      : [
          {
            header: "Día",
            accessor: "fecha_rd",
            template: (item: any) => {
              if (item.fecha_rd === "TOTAL") return "TOTAL";

              const fecha = new Date(item.fecha_rd);
              const diaSemana = fecha.toLocaleDateString("es-CO", {
                weekday: "long",
              }); // Obtén el día de la semana
              const diaMes = fecha.toLocaleDateString("es-CO", {
                day: "2-digit",
              }); // Día del mes
              const mes = fecha.toLocaleDateString("es-CO", { month: "short" }); // Mes abreviado

              // Capitaliza el día de la semana y arma el formato
              return `${diaSemana.toUpperCase()} ${diaMes} ${mes}`;
            },
          },
        ];

    return [
      ...colums,
      {
        header: "Compras",
        accessor: "compras_rd",
        type: "price",
        align: "center",
      },
      {
        header: "Varios",
        accessor: "varios_rd",
        type: "price",
        align: "center",
      },
    ];
  }, []);

  const columnsGroup2: any = useMemo(
    () => [
      {
        header: "Salarios",
        accessor: "salarios_rd",
        type: "price",
        align: "center",
      },
      {
        header: "Arriendo",
        accessor: "arriendo_rd",
        type: "price",
        align: "center",
      },
      {
        header: "Gas",
        accessor: "gas_rd",
        type: "price",
        align: "center",
      },
      {
        header: "Servicios",
        accessor: "servicios_rd",
        type: "price",
        align: "center",
      },
      {
        header: "Vehículo",
        accessor: "vehiculo_rd",
        type: "price",
        align: "center",
      },
      {
        header: "Banco",
        accessor: "banco_rd",
        type: "price",
        align: "center",
      },
    ],
    []
  );

  const columnsGroup3: any = useMemo(
    () => [
      {
        header: "Ventas",
        accessor: "ventas_rd",
        type: "price",
        align: "center",
      },
    ],
    []
  );

  const gastosInversion = sumar(totals.compras_rd, totals.varios_rd);
  const gastosOperativos = sumar(
    totals.salarios_rd,
    totals.arriendo_rd,
    totals.gas_rd,
    totals.servicios_rd,
    totals.vehiculo_rd,
    totals.banco_rd
  );
  const utilidad = totals.ventas_rd - (gastosInversion + gastosOperativos);

  return (
    <div className="mt-2">
      {isTotalReport ? null : (
        <div className="flex items-center gap-2 px-2">
          <h2 className="subtitle font-bold">Reporte Semana:</h2>
          <Chip className="bg-orange-100">
            {new Date(startDate).toLocaleDateString("es-CO")}
          </Chip>
          <span>-</span>
          <Chip className="bg-orange-100">
            {new Date(endDate).toLocaleDateString("es-CO")}
          </Chip>
        </div>
      )}

      <ScrollShadow orientation="horizontal" className="flex px-2 py-4 gap-4">
        <div className="flex flex-col gap-4">
          <CustomTable
            columns={columnsGroup1}
            data={data}
            classNames={{
              wrapper: clsx("w-[400px]", {
                "w-[250px]": isTotalReport,
              }),
            }}
          />

          <div className="flex">
            <CardTotal title="Gastos de Inversión" total={gastosInversion} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <CustomTable
            columns={columnsGroup2}
            data={data}
            classNames={{
              wrapper: "w-[660px]",
            }}
          />
          <div className="flex justify-between">
            <CardTotal title="Gastos Operativos" total={gastosOperativos} />
            <CardTotal title="Ventas" total={totals.ventas_rd} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <CustomTable
            columns={columnsGroup3}
            data={data}
            classNames={{
              wrapper: "w-[150px]",
            }}
          />
          <CardTotal
            title="Utilidad"
            total={utilidad}
            headerClassName="bg-primary text-dark"
          />
        </div>
      </ScrollShadow>
    </div>
  );
};
