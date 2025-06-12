"use server";

import { Cargos } from "@/enum/cargos.enum";
import pool from "@/lib/db";
import { sendAssignmentEmail } from "@/lib/sendAssignmentEmail"; // Ajusta la ruta si es diferente



// Obtener todas las tareas (opcionalmente por usuario)
export async function getTareas(userId: string) {
  try {
    const result = await pool.query(
      `
      SELECT 
        t.id_tarea,
        t.titulo,
        t.descripcion,
        t.fecha_creacion,
        t.fecha_limite,
        t.id_estado,
        t.id_prioridad,
        t.id_asignado,
        t.id_creador,
        u.nom_user AS nombre_asignado
      FROM tareas t
      LEFT JOIN tmusuarios u ON t.id_asignado = u.ced_user
      WHERE t.id_asignado = $1
      ORDER BY t.fecha_creacion DESC
      `,
      [userId]
    );
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
  fecha_creacion?: string;
  fecha_limite?: string;
  id_asignado?: string;
  id_creador: string;
  id_estado: number;
  id_prioridad: number;
}) {
  try {
    const {
      titulo,
      descripcion,
      fecha_creacion,
      fecha_limite,
      id_asignado,
      id_creador,
      id_estado,
      id_prioridad,
    } = data;

    const result = await pool.query(
      `INSERT INTO tareas (
         titulo,
         descripcion,
         fecha_creacion,
         fecha_limite,
         id_asignado,
         id_creador,
         id_estado,
         id_prioridad
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        titulo,
        descripcion || null,
        fecha_creacion || null,
        fecha_limite || null,
        id_asignado || null,
        id_creador,
        id_estado,
        id_prioridad,
      ]
    );

    const tarea = result.rows[0];

    if (id_asignado) {
      const resUser = await pool.query(
        `SELECT nom_user, email_user FROM tmusuarios WHERE ced_user = $1`,
        [id_asignado]
      );

      const user = resUser.rows[0];

      if (user?.email_user) {
        await sendAssignmentEmail({
          to: user.email_user,
          nombre: user.nom_user,
          tarea: {
            titulo: tarea.titulo,
            descripcion: tarea.descripcion || "",
          },
        });
      }
    }

    return tarea;
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

// Obtener tareas según el rol del usuario
export async function getTareasPorRol(userId: string, cargo: number) {
  try {
    if (cargo === Cargos.ADMIN || cargo === Cargos.SUPER_ADMIN) {
      return await getTareasAll(); // Todas las tareas con detalles
    } else {
      return await getTareas(userId); // Solo las del usuario asignado
    }
  } catch (error) {
    console.error("Error al obtener tareas según el rol:", error);
    throw error;
  }
}

// Cambiar el estado de una tarea
export async function cambiarEstadoTarea(id_tarea: number, id_estado: number) {
  try {
    const result = await pool.query(
      `UPDATE tareas SET id_estado = $1 WHERE id_tarea = $2 RETURNING *`,
      [id_estado, id_tarea]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error al cambiar el estado de la tarea:", error);
    throw error;
  }
}

// Obtener tareas filtradas por nombre y rango de fechas
export async function getTareasFiltradas({
  nombre,
  fechaInicio,
  fechaFin,
}: {
  nombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
}) {
  try {
    let query = `
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
      WHERE 1=1
    `;

    const params: any[] = [];
    let i = 1;

    if (nombre) {
      query += ` AND LOWER(asignado.nom_user) LIKE LOWER($${i})`;
      params.push(`%${nombre}%`);
      i++;
    }

    if (fechaInicio && fechaFin) {
      query += ` AND t.fecha_creacion BETWEEN $${i} AND $${i + 1}`;
      params.push(fechaInicio, fechaFin);
      i += 2;
    }

    query += ` ORDER BY t.fecha_creacion DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Error al obtener tareas filtradas:", error);
    throw error;
  }
}

