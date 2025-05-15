interface Producto {
  cod_prod: number;
  img_prod: string;
  nom_prod: string;
  cantidad_platos: number;
}

export interface OrdenPendiente {
  cod_fac: number;
  fecha_fac: string;
  hora_fac: string;
  obs_fac: string;
  mesa_fac: number;
  nom_cliente: string;
  fktc_fac: number;
  dtipo_cliente: string;
  productos: Producto[];
}