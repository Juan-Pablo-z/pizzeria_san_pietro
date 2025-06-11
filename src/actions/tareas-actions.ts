"use server";

import pool from "@/lib/db";


// Obtener todas las tareas (opcionalmente por usuario)
export async function getTareas(userId?: string) {
  try {
    const query = userId
      ? "SELECT * FROM tareas WHERE id_asignado = $1 ORDER BY fecha_creacion DESC"
      : "SELECT * FROM tareas ORDER BY fecha_creacion DESC";
    const result = await pool.query(query, userId ? [userId] : []);
    return result.rows;
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    throw error;
  }
}

// Crear una nueva tarea
export async function createTarea(data: {
  titulo: string;
  descripcion?: string;
  fecha_limite?: string;
  id_asignado?: string;
  id_creador: string;
  id_estado: number;     // 1: pendiente, 2: enProceso, 3: terminada
  id_prioridad: number;  // según tu tabla de prioridades
}) {
  try {
    const {
      titulo,
      descripcion,
      fecha_limite,
      id_asignado,
      id_creador,
      id_estado,
      id_prioridad,
    } = data;

    const result = await pool.query(
      `INSERT INTO tareas (titulo, descripcion, fecha_limite, id_asignado, id_creador, id_estado, id_prioridad)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [titulo, descripcion || null, fecha_limite || null, id_asignado || null, id_creador, id_estado, id_prioridad]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error al crear tarea:", error);
    throw error;
  }
}

// Editar tarea existente
export async function editTarea(id: number, data: Partial<{
  titulo: string;
  descripcion: string;
  fecha_limite: string;
  id_asignado: string;
  id_estado: number;
  id_prioridad: number;
}>) {
  try {
    const fields = Object.entries(data);
    if (fields.length === 0) return;

    const updates = fields.map(([key], i) => `${key} = $${i + 2}`).join(", ");
    const values = fields.map(([, value]) => value);

    const result = await pool.query(
      `UPDATE tareas SET ${updates} WHERE id_tarea = $1 RETURNING *`,
      [id, ...values]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error al editar tarea:", error);
    throw error;
  }
}

// Eliminar tarea
export async function deleteTarea(id: number) {
  try {
    const result = await pool.query("DELETE FROM tareas WHERE id_tarea = $1 RETURNING *", [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    throw error;
  }
}

// Obtener todas las tareas con detalles de usuario, estado y prioridad
export async function getTareasAll() {
  try {
    const result = await pool.query(`
      SELECT 
        t.id_tarea,
        t.titulo,
        t.descripcion,
        t.fecha_creacion,
        t.fecha_limite,
        t.id_asignado,
        t.id_creador,
        creador.nom_user AS nombre_creador,
        asignado.nom_user AS nombre_asignado,
        e.estado AS estado_tarea,
        p.nivel AS prioridad_tarea,
        t.id_estado,
        t.id_prioridad
      FROM tareas t
      LEFT JOIN tmusuarios creador ON t.id_creador = creador.ced_user
      LEFT JOIN tmusuarios asignado ON t.id_asignado = asignado.ced_user
      INNER JOIN estados_tareas e ON t.id_estado = e.id_estado
      INNER JOIN prioridades p ON t.id_prioridad = p.id_prioridad
      ORDER BY t.fecha_creacion DESC
    `);

    return result.rows;
  } catch (error) {
    console.error("Error al obtener todas las tareas:", error);
    throw error;
  }
}