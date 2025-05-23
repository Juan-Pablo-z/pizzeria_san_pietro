import { Cargo } from "@/interfaces";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import { Client } from "pg";

export const getCargos = async () => {
  const session = await auth();
  if (!session) return null;
  try {
    const res = await pool.query(`
      SELECT
        cod_car,
        dcar
      FROM
        tmcargos;
    `);
    const cargos: Cargo[] = res.rows;
    return cargos;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
