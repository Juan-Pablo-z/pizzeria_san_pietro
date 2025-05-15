export interface Pedido {
  cod_fac: number;
  monto_total: number;
  fecha_fac: string;
  hora_fac: string;
  fktc_fac: number;
  nom_cliente: string;
  mesa_fac: number;
  fkcods_fac: number;
  dtipo_cliente: string;
  dstatus: string;
}

interface Product {
  cod_prod: number;
  img_prod: string;
  nom_prod: string;
  cantidad_platos: number;
  precio_base: number;
  recargo_clie: number;
}

export interface SinglePedido extends Pedido {
  obs_fac: string;
  nom_user: string;
  productos: Product[];
}
