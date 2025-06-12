export enum StatusTareas {
  PENDIENTE = 0,
  EN_PROCESO = 1,
  TERMINADA = 2,
}

export const statusTareasLabels = {
  [StatusTareas.PENDIENTE]: "Pendiente",
  [StatusTareas.EN_PROCESO]: "En Proceso",
  [StatusTareas.TERMINADA]: "Terminada",
};

