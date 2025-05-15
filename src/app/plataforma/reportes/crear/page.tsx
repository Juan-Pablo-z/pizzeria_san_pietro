import { Metadata } from "next";
import { ReporteForm } from "../components/ReporteForm";
import {
  getGastosFijos,
  getReportesDateRanges,
} from "@/actions/reportes-action";

export const metadata: Metadata = {
  title: "Crear Reporte",
  description: "Crear un reporte diario basado en gastos fijos",
};

export default async function CrearReportePage() {
  const [gastosFijos, reportesCreados] = await Promise.all([
    getGastosFijos(),
    getReportesDateRanges(),
  ]);

  return (
    <div className="main-container">
      <h1 className="title">Crear Reporte Diario</h1>
      <ReporteForm
        gastosFijos={gastosFijos}
        reportesCreados={reportesCreados as any}
      />
    </div>
  );
}
