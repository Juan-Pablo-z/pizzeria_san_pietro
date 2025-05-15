"use server";

import { Recargo } from "@/interfaces";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";

export const getRecargos = async () => {
  const session = await auth();
  if (!session) return null;
  try {
    await pool.connect();
    const res = await pool.query(`
      SELECT
        cod_rec,
        recargo_cliente,
        fkcod_tc_rec
      FROM
        tmrecargos;
    `);
    const recargos: Recargo[] = res.rows;
    
    return recargos;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
