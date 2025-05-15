import { Recargo } from "./recargos.interface";

export interface Product {
  cod_prod: number;
  nom_prod: string;
  img_prod: string;
  dprod: string;
  precio_base: number;
  es_adicional: boolean;
  recargos: Recargo[];
  fkcods_prod: number;
}

export interface ProductOrdered {
  cod_prod: number;
  nom_prod: string;
  img_prod: string;
  precio_base: number;
  quantity: number;
  recargos: Recargo[];
}