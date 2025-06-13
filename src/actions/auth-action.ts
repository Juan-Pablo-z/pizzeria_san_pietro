"use server";

import { modulesRedirectHelper } from "@/helpers";
import { auth, signIn, signOut } from "@/lib/auth";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export const loginUser = async (data: any) => {
  try {
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    return response;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const loginEmail = async (data: { password: string; email: string }) => {
  try {
    await pool.connect();

    const res = await pool.query(
      `
      SELECT 
        u.ced_user,
        u.nom_user,
        u.email_user,
        u.fkcod_car_user,
        u.password_user,
        c.dcar
      FROM tmusuarios AS u
      JOIN tmcargos AS c 
        ON u.fkcod_car_user = c.cod_car
      WHERE email_user = $1
      `,
      [data.email]
    );

    const user = res.rows[0];

    if (!user) {
      throw new Error("Credenciales incorrectas");
    }

    // validar contraseña encriptada

    const match = await bcrypt.compare(data.password, user.password_user);

    if (!match) {
      throw new Error("Credenciales incorrectas");
    }

    const { password_user, ...rest } = user;

    return rest || null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    await signOut();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo cerrar sesión",
    };
  }
};

export const moduleRedirect = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const { user } = session;

  const redirectPath = modulesRedirectHelper(user.fkcod_car_user);

  if (redirectPath) {
    redirect(redirectPath);
  }

  return null;
};
