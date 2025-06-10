"use server";

import { auth } from "@/lib/auth";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import pool from "@/lib/db";

export const getUsers = async () => {
  const session = await auth();
  if (!session) return null;
  try {
    await pool.connect();
    const res = await pool.query(`
      SELECT 
        u.ced_user,
        u.nom_user,
        u.email_user,
        u.fkcod_car_user,
        c.dcar
      FROM 
        tmusuarios AS u
      JOIN 
        tmcargos AS c 
          ON u.fkcod_car_user = c.cod_car
      `);
    const users = res.rows;
    
    return users;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const deleteUser = async (ced_emple: string) => {
  const session = await auth();
  if (!session) return null;

  try {
    await pool.query(
      `DELETE FROM tmusuarios WHERE ced_user = $1`,
      [ced_emple]
    );
  } catch (error: any) {
    console.error("❌ Error al eliminar usuario:", error);
    throw new Error(error.message);
  }
};


export const createUser = async (data: {
  ced_user: string;
  nom_user: string;
  email_user: string;
  password_user: string;
  fkcod_car_user: number;
}) => {
  const session = await auth();
  if (!session) return null;
  const { ced_user, nom_user, email_user, password_user, fkcod_car_user } =
    data;

  try {
    await pool.connect();

    // Validar el correo y la cedula
    const res = await pool.query(
      `SELECT * FROM tmusuarios WHERE ced_user = $1 OR email_user = $2`,
      [ced_user, email_user]
    );

    const userExists = res.rows[0];

    if (userExists) {
      if (userExists.ced_user === ced_user) {
        throw new Error("La cédula ya está registrada");
      }
      if (userExists.email_user === email_user) {
        throw new Error("El correo ya está registrado");
      }
    }

    const encryptedPassword = await bcrypt.hash(password_user, 10);

    // Insertar el usuario
    const insertUser = `
      INSERT INTO tmusuarios (ced_user, nom_user, email_user, password_user, fkcod_car_user)
      VALUES ($1, $2, $3, $4, $5);
    `;
    const insertUserValues = [
      ced_user,
      nom_user,
      email_user,
      encryptedPassword,
      fkcod_car_user,
    ];

    await pool.query(insertUser, insertUserValues);

    
  } catch (error: any) {
    console.log(error);
    throw new Error("Error al crear el usuario");
  }
};

export const getUserByCed = async (ced: string) => {
  const session = await auth();
  if (!session) return null;

  try {
    await pool.connect();

    const query = `
      SELECT 
        u.ced_user,
        u.nom_user,
        u.email_user,
        u.fkcod_car_user
      FROM 
        tmusuarios AS u
      WHERE ced_user = $1
    `;
    const values = [ced];

    const res = await pool.query(query, values);
    

    if (!res.rows.length) {
      throw new Error("Usuario no encontrado");
    }

    return res.rows[0];
  } catch (error: any) {
    console.log(error);
    throw new Error("Error al obtener el usuario");
  }
};

export const updateUser = async (
  ced_user: string,
  data: {
    nom_user?: string;
    email_user?: string;
    password_user?: string;
    fkcod_car_user?: number;
  }
) => {
  const session = await auth();
  if (!session) return null;

  const nom_user = data.nom_user || null;
  const email_user = data.email_user || null;
  const fkcod_car_user = data.fkcod_car_user || null;

  try {
    await pool.connect();

    // Validar si el usuario existe
    const checkUserQuery = `SELECT * FROM tmusuarios WHERE ced_user = $1`;
    const checkUserValues = [ced_user];
    const userRes = await pool.query(checkUserQuery, checkUserValues);

    if (!userRes.rows.length) {
      throw new Error("Usuario no encontrado");
    }

    // Validar si el correo ya está registrado en otro usuario
    if (email_user) {
      const checkEmailQuery = `
        SELECT * FROM tmusuarios 
        WHERE email_user = $1 AND ced_user != $2
      `;
      const checkEmailValues = [email_user, ced_user];
      const emailRes = await pool.query(checkEmailQuery, checkEmailValues);

      if (emailRes.rows.length) {
        throw new Error("El correo ya está registrado en otro usuario");
      }
    }

    const password_user = data.password_user
      ? await bcrypt.hash(data.password_user, 10)
      : null;

    // Actualizar el usuario
    const updateUserQuery = `
      UPDATE tmusuarios
      SET
        nom_user = COALESCE($1, nom_user),
        email_user = COALESCE($2, email_user),
        password_user = COALESCE($3, password_user),
        fkcod_car_user = COALESCE($4, fkcod_car_user)
      WHERE ced_user = $5
    `;
    const updateUserValues = [
      nom_user,
      email_user,
      password_user,
      fkcod_car_user,
      ced_user,
    ];

    await pool.query(updateUserQuery, updateUserValues);
    

    revalidatePath("/plataforma/usuarios");
    revalidatePath("/plataforma/usuarios/editar/" + ced_user);
  } catch (error: any) {
    console.log(error);
    throw new Error("Error al actualizar el usuario");
  }
};

export const encryptExistingPasswords = async () => {
  const session = await auth();
  if (!session) return null;

  try {
    await pool.connect();

    const users = await pool.query(`SELECT * FROM tmusuarios`);

    for (const user of users.rows) {
      const { ced_user, password_user } = user;
      const encryptedPassword = await bcrypt.hash(password_user, 10);

      await pool.query(
        `UPDATE tmusuarios SET password_user = $1 WHERE ced_user = $2`,
        [encryptedPassword, ced_user]
      );
    }

    
  } catch (error: any) {
    console.log(error);
    throw new Error("Error al encriptar las contraseñas");
  }
};
