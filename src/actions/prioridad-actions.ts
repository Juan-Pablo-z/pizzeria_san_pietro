"use server";
import pool from "@/lib/db";



export async function getPrioridades() {
  try {
    const result = await pool.query(
      `SELECT id_prioridad, nivel FROM prioridades ORDER BY id_prioridad`
    );
    return result.rows;
  } catch (error) {
    console.error('Error al obtener prioridades:', error);
    return [];
  }
}