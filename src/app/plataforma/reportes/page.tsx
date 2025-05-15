import { getReportes } from "@/actions/reportes-action";
import { Button } from "@nextui-org/react";
import { Metadata } from "next";
import Link from "next/link";
import { ReportesManager } from "./components/ReportesManager";

export const metadata: Metadata = {
  title: "Reportes",
  description: "Reportes de la plataforma",
};

interface Props {
  searchParams: {
    startDate?: string;
    endDate?: string;
  };
}

export default async function ReportesPage({
  searchParams: { startDate, endDate },
}: Props) {
  let groupedData: any = null;

  if (startDate && endDate) {
    groupedData = await getReportes(startDate!, endDate!);
  }

  return (
    <div className="main-container">
      <h1 className="title">Reportes por fechas</h1>
      <ReportesManager
        groupedData={groupedData}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
