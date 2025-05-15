export interface Reportes {
  cod_rd: number;
  fecha_rd: Date;
  salarios_rd: number;
  arriendo_rd: number;
  gas_rd: number;
  servicios_rd: number;
  vehiculo_rd: number;
  banco_rd: number;
  compras_rd: number;
  varios_rd: number;
  ventas_rd: number;
}

export interface ReporteRange {
  startDate: string;
  endDate: string;
  dailyReports: Reportes[];
  isTotalReport?: boolean;
}