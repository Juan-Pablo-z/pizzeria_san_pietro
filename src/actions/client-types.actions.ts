"use server";

import { ClientType } from "@/interfaces";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";

export const getClientTypes = async () => {
  const session = await auth();
  if (!session) return null;
  try {
    await pool.connect();
    const res = await pool.query(`
      SELECT
        tc.cod_tc,
        tc.dtipo_cliente
      FROM
        tmtipo_clientes AS tc;
    `);
    const recargos: ClientType[] = res.rows;
    
    return recargos;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};