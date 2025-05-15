"use server";

import { Status } from "@/enum";
import { groupByWeek } from "@/helpers";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export const getGastosFijos = async () => {
  const session = await auth();
  if (!session) return null;
  try {
    await pool.connect();
    const res = await pool.query(`
      SELECT 
        cod_gf,
        salarios,
        arriendo,
        gas,
        servicios,
        vehiculo,
        banco
      FROM 
        tmgastos_fijos
      ORDER BY
        cod_gf DESC
      `);
    const gastosFijos = res.rows[0];
    
    return gastosFijos;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const createReporteDiario = async (data: any) => {
  const session = await auth();
  if (!session) return null;
  try {
    await pool.connect();

    //* Validar si está creado el reporte diario
    const resReporte = await pool.query(
      `
      SELECT 
        cod_rd
      FROM 
        tmreporte_diario
      WHERE 
        fecha_rd = $1
      `,
      [data.fecha_rd]
    );

    if (resReporte.rows.length > 0) {
      
      throw new Error("Ya existe un reporte diario para esta fecha");
    }

    //* Calcular ventas_rd
    let ventas_rd = data.autogenerarVentas ? 0 : data.ventas_rd;

    if (data.autogenerarVentas) {
      const res = await pool.query(
        `
        SELECT 
          SUM(monto_total) as ventas
        FROM 
          tdfactura
        WHERE 
          fkcods_fac = ${Status.PAGADO} AND
          fecha_fac = $1
        `,
        [data.fecha_rd]
      );
      ventas_rd = res.rows[0].ventas;

      if (!ventas_rd) {
        throw new Error("No hay ventas registradas para esta fecha");
      }
    }

    //* Creación del reporte diario
    const res = await pool.query(
      `
      INSERT INTO 
        tmreporte_diario(
          fecha_rd,
          salarios_rd,
          arriendo_rd,
          gas_rd,
          servicios_rd,
          vehiculo_rd,
          banco_rd,
          compras_rd,
          varios_rd,
          ventas_rd
        )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
      )
      `,
      [
        data.fecha_rd,
        data.salarios_rd,
        data.arriendo_rd,
        data.gas_rd,
        data.servicios_rd,
        data.vehiculo_rd,
        data.banco_rd,
        data.compras_rd,
        data.varios_rd,
        ventas_rd,
      ]
    );

    
    revalidatePath("/plataforma/reportes");
    revalidatePath("/plataforma/reportes/crear");

    return { success: true };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getReportesDateRanges = async () => {
  const session = await auth();
  if (!session) return null;
  try {
    await pool.connect();
    const res = await pool.query(`
      SELECT 
        fecha_rd
      FROM 
        tmreporte_diario
      ORDER BY
        fecha_rd ASC
    `);

    const reportesDates = res.rows.map((row) => new Date(row.fecha_rd));

    if (reportesDates.length === 0) {
      
      return [];
    }

    // Generar rangos de fechas
    const dateRanges: Array<string[]> = [];
    let currentStart = reportesDates[0];

    for (let i = 1; i < reportesDates.length; i++) {
      const currentDate = reportesDates[i];
      const previousDate = reportesDates[i - 1];

      // Verificar si hay un día faltante
      if (
        currentDate.getTime() - previousDate.getTime() >
        24 * 60 * 60 * 1000
      ) {
        // Si hay brecha, cerrar el rango actual
        dateRanges.push([
          currentStart.toISOString().split("T")[0],
          previousDate.toISOString().split("T")[0],
        ]);

        // Iniciar un nuevo rango
        currentStart = currentDate;
      }
    }

    // Agregar el rango final
    dateRanges.push([
      currentStart.toISOString().split("T")[0],
      reportesDates[reportesDates.length - 1].toISOString().split("T")[0],
    ]);

    

    return dateRanges;
  } catch (error: any) {
    console.error(error);
    return [];
  }
};

export const createGastosFijos = async (data: any) => {
  const session = await auth();
  if (!session) return null;
  try {
    await pool.connect();
    const res = await pool.query(
      `
      INSERT INTO 
        tmgastos_fijos(
          salarios,
          arriendo,
          gas,
          servicios,
          vehiculo,
          banco
        )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      `,
      [
        data.salarios,
        data.arriendo,
        data.gas,
        data.servicios,
        data.vehiculo,
        data.banco,
      ]
    );
    
    revalidatePath("/plataforma/reportes");
    revalidatePath("/plataforma/reportes/crear");
    revalidatePath("/plataforma/reportes/gastos-fijos");
    return { success: true };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getReportes = async (startDate: string, endDate: string) => {
  const session = await auth();
  if (!session) return null;
  try {
    await pool.connect();

    // Base query for fetching paginated records
    const query = `
      SELECT
        cod_rd,
        fecha_rd,
        salarios_rd,
        arriendo_rd,
        gas_rd,
        servicios_rd,
        vehiculo_rd,
        banco_rd,
        compras_rd,
        varios_rd,
        ventas_rd
      FROM
        tmreporte_diario
      WHERE
        fecha_rd >= $1 AND
        fecha_rd <= $2 
    `;
    const res = await pool.query(query, [startDate, endDate]);

    
    return groupByWeek(res.rows);
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};
