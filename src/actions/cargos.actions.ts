import { Cargo } from "@/interfaces";
import { auth } from "@/lib/auth";
import { Client } from "pg";

export const getCargos = async () => {
  const session = await auth();
  if (!session) return null;
  try {
    const client = new Client();
    await client.connect();
    const res = await client.query(`
      SELECT
        cod_car,
        dcar
      FROM
        tmcargos;
    `);
    const cargos: Cargo[] = res.rows;
    await client.end();
    return cargos;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
