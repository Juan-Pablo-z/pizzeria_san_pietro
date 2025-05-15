"use server";

import { Status } from "@/enum";
import { WebSocketChannels } from "@/enum/websocket-channels";
import { WebSocketEvents } from "@/enum/websocket-events.enum";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";

export const createFacturaWithDetails = async (
  factura: any,
  detalle_factura: any[]
) => {
  const session = await auth();
  if (!session) return null;
  try {
    const session = await auth();
    if (!session) return null;

    await pool.connect();

    const obs_fac = factura.obs_fac || null;
    const nom_cliente = factura.nom_cliente || null;
    const mesa_fac = +factura.mesa_fac || null;

    
    // Insertar la factura
    const insertFacturaQuery = `
    INSERT INTO tdfactura (monto_total, obs_fac, nom_cliente, mesa_fac, fktc_fac, fkced_vendedor, fkcods_fac)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING cod_fac;
    `;
    const insertFacturaValues = [
      factura.monto_total,
      obs_fac,
      nom_cliente,
      mesa_fac,
      factura.fktc_fac,
      session.user.ced_user,
      Status.PENDIENTE,
    ];
    
    
    
    const res = await pool.query(insertFacturaQuery, insertFacturaValues);
    const cod_fac = res.rows[0].cod_fac;
    
    // Insertar los detalles de la factura
    const insertDetalleQuery = `
      INSERT INTO tddfactura (cantidad_platos, precio_base, recargo_clie, fkcod_prod_dfac, fkcod_fac_dfac)
      VALUES ($1, $2, $3, $4, $5);
    `;

    const insertDetallePromises = detalle_factura.map(async (detalle) => {
      const insertDetalleValues = [
        detalle.cantidad_platos,
        detalle.precio_base,
        detalle.recargo_clie,
        detalle.fkcod_prod_dfac,
        cod_fac,
      ];
      return pool.query(insertDetalleQuery, insertDetalleValues);
    });

    await Promise.all(insertDetallePromises);

    const pedido = await getSinglePedido(cod_fac);

    pusherServer.trigger(
      WebSocketChannels.ORDERS,
      WebSocketEvents.NEW_ORDER,
      pedido
    );

    revalidatePath("/plataforma/pedidos");
    revalidatePath("/plataforma/cocina");
    revalidatePath("/plataforma/caja");

    return cod_fac;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getPedidosPendientes = async () => {
  const session = await auth();
  if (!session) return null;
  try {
    await pool.connect();

    const query = `
      SELECT
	      f.cod_fac,
	      f.fecha_fac,
	      f.hora_fac,
	      f.obs_fac,
        f.fktc_fac,
        f.mesa_fac,
        f.nom_cliente,
	      tc.dtipo_cliente,
	      json_agg(json_build_object(
	        'cod_prod', p.cod_prod,
	        'img_prod', p.img_prod,
	        'nom_prod', p.nom_prod,
	        'cantidad_platos',fd.cantidad_platos
	      )) AS productos
      FROM
	      tdfactura AS f
	      LEFT JOIN tddfactura AS fd ON f.cod_fac = fd.fkcod_fac_dfac
	      LEFT JOIN tmproductos AS p ON fd.fkcod_prod_dfac = p.cod_prod
        LEFT JOIN tmtipo_clientes AS tc ON f.fktc_fac = tc.cod_tc
      WHERE
        f.fkcods_fac = ${Status.PENDIENTE}
      GROUP BY
	      f.cod_fac, tc.dtipo_cliente
      ORDER BY
        f.fecha_fac;
    `;
    const res = await pool.query(query);

    return res.rows;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const updateStatusFactura = async (
  cod_fac: number,
  status: Status,
  uniqueEvent: boolean = true
) => {
  const session = await auth();
  if (!session) return null;
  try {
    await pool.connect();

    const query = `
      UPDATE tdfactura
      SET fkcods_fac = $1
      WHERE cod_fac = $2;
    `;
    const values = [status, cod_fac];
    const res = await pool.query(query, values);

    if (res.rowCount === 0) {
      throw new Error("No se pudo actualizar el estado de la factura");
    }

    const event =
      status === Status.ENTREGADO && uniqueEvent
        ? WebSocketEvents.COMPLETE_ORDER
        : WebSocketEvents.UPDATE_ORDER;

    pusherServer.trigger(WebSocketChannels.ORDERS, event, {
      cod_fac,
      status,
    });

    revalidatePath("/plataforma/pedidos");
    revalidatePath("/plataforma/cocina");
    revalidatePath("/plataforma/caja");
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getPedidosPaginated = async ({
  page,
  limit,
  fktc_fac,
  sortDirection = "desc",
  startDate,
  endDate,
}: {
  page: number;
  limit: number;
  fktc_fac?: string;
  sortDirection: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}) => {
  const session = await auth();
  if (!session) return null;
  try {
    await pool.connect();

    // Calculating offset for pagination
    const offset = (page - 1) * limit;

    // Base query for counting total records
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM tdfactura AS f
      WHERE 1 = 1
    `;

    // Base query for fetching paginated records
    let query = `
      SELECT
        f.cod_fac,
        f.monto_total,
        f.fecha_fac,
        f.hora_fac,
        f.fktc_fac,
        f.fkcods_fac,
        f.mesa_fac,
        f.nom_cliente,
        tc.dtipo_cliente,
        s.dstatus
      FROM
        tdfactura AS f
        LEFT JOIN tmtipo_clientes AS tc ON f.fktc_fac = tc.cod_tc
        LEFT JOIN tmstatus AS s ON f.fkcods_fac = s.cods
      WHERE 1 = 1
    `;

    // Filters
    const params: any[] = [];
    if (fktc_fac) {
      params.push(fktc_fac);
      countQuery += ` AND f.fktc_fac = $${params.length}`;
      query += ` AND f.fktc_fac = $${params.length}`;
    }

    if (startDate) {
      params.push(startDate);
      countQuery += ` AND f.fecha_fac >= $${params.length}`;
      query += ` AND f.fecha_fac >= $${params.length}`;
    }

    if (endDate) {
      params.push(endDate);
      countQuery += ` AND f.fecha_fac <= $${params.length}`;
      query += ` AND f.fecha_fac <= $${params.length}`;
    }

    // Execute count query
    const countRes = await pool.query(countQuery, params);
    const totalRecords = parseInt(countRes.rows[0].total, 10);
    const totalPages = Math.ceil(totalRecords / limit);

    // Sorting and pagination
    query += ` ORDER BY f.cod_fac ${sortDirection}`;
    params.push(limit, offset);
    query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    // Execute paginated query
    const res = await pool.query(query, params);

    return {
      totalPages,
      data: res.rows,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const getSinglePedido = async (cod_fac: number) => {
  const session = await auth();
  if (!session) return null;
  try {
    await pool.connect();

    const query = `
      SELECT
        f.cod_fac,
        f.monto_total,
        f.fecha_fac,
        f.hora_fac,
        f.obs_fac,
        f.fktc_fac,
        f.fkcods_fac,
        f.mesa_fac,
        f.nom_cliente,
        tc.dtipo_cliente,
        s.dstatus,
        u.nom_user,
        json_agg(json_build_object(
          'cod_prod', p.cod_prod,
          'img_prod', p.img_prod,
          'nom_prod', p.nom_prod,
          'cantidad_platos',fd.cantidad_platos,
          'precio_base', fd.precio_base,
          'recargo_clie', fd.recargo_clie
        )) AS productos
      FROM
        tdfactura AS f
        LEFT JOIN tddfactura AS fd ON f.cod_fac = fd.fkcod_fac_dfac
        LEFT JOIN tmproductos AS p ON fd.fkcod_prod_dfac = p.cod_prod
        LEFT JOIN tmtipo_clientes AS tc ON f.fktc_fac = tc.cod_tc
        LEFT JOIN tmstatus AS s ON f.fkcods_fac = s.cods
        LEFT JOIN tmusuarios AS u ON f.fkced_vendedor = u.ced_user
      WHERE
        f.cod_fac = $1
      GROUP BY
        f.cod_fac, tc.dtipo_cliente, s.dstatus, u.nom_user;
    `;
    const res = await pool.query(query, [cod_fac]);

    return res.rows[0];
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const getPedidosCaja = async () => {
  const session = await auth();
  if (!session) return null;
  try {
    await pool.connect();

    const query = `
      SELECT
        f.cod_fac,
        f.monto_total,
        f.fecha_fac,
        f.hora_fac,
        f.fktc_fac,
        f.fkcods_fac,
        f.mesa_fac,
        f.nom_cliente,
        tc.dtipo_cliente,
        s.dstatus
      FROM
        tdfactura AS f
        LEFT JOIN tmtipo_clientes AS tc ON f.fktc_fac = tc.cod_tc
        LEFT JOIN tmstatus AS s ON f.fkcods_fac = s.cods
      WHERE
        f.fkcods_fac IN (${Status.PENDIENTE}, ${Status.ENTREGADO});
    `;
    const res = await pool.query(query);

    return res.rows;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};
