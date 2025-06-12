import { Cargos } from "@/enum/cargos.enum";

export const modulesRedirectHelper = (cod_car_user: Cargos) => {
  if ([Cargos.ADMIN, Cargos.SUPER_ADMIN].includes(cod_car_user)) {
    return "/plataforma/dashboard";
  }
  if ([Cargos.COCINERA, Cargos.COCINERA_JEFE].includes(cod_car_user)) {
    return "/plataforma/lista-tareas";
  }
  if ([Cargos.MESERA].includes(cod_car_user)) {
    return "/plataforma/lista-tareas";
  }
  return null;
};
