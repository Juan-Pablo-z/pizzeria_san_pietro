import { Cargos } from "@/enum/cargos.enum";

export const validateCargo = (user_cargo: number, ...cargos: Cargos[]) => {
  return [Cargos.SUPER_ADMIN, ...cargos].includes(user_cargo);
};
