'use server';

import pool from '@/lib/db';
import crypto from 'crypto';
import { addMinutes } from 'date-fns';
import bcrypt from 'bcryptjs';
import { enviarCorreoRecuperacion } from '@/lib/email';

// 🟢 Recuperar contraseña
export async function recuperarContrasena(email: string) {
  try {
    const result = await pool.query(
      'SELECT nom_user FROM tmusuarios WHERE email_user = $1',
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      // No revelar si el correo existe
      return { success: true };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = addMinutes(new Date(), 15);

    // Limpiar tokens anteriores
    await pool.query(`DELETE FROM validacion_token WHERE email = $1`, [email]);

    // Insertar nuevo token
    await pool.query(
      `INSERT INTO validacion_token (email, token, expires_at)
       VALUES ($1, $2, $3)`,
      [email, token, expires]
    );

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/nueva-clave?token=${token}`;
    await enviarCorreoRecuperacion(email, user.nom_user, resetLink);

    return { success: true };
  } catch (error) {
    console.error('❌ Error en recuperarContrasena:', error);
    return { success: false, error: 'Error interno' };
  }
}

// 🟢 Verificar token
export async function verificarToken(token: string): Promise<{ valid: boolean }> {
  try {
    const result = await pool.query(
      `SELECT 1 FROM validacion_token WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );

    return { valid: !!(result?.rowCount && result.rowCount > 0) };
  } catch (error) {
    console.error('❌ Error en verificarToken:', error);
    return { valid: false };
  }
}

// 🟢 Actualizar contraseña
export async function actualizarContrasena(token: string, nuevaClave: string) {
  try {
    const result = await pool.query(
      `SELECT email FROM validacion_token WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );

    if (!result || result.rowCount === 0) {
      return { success: false, error: 'Token inválido o expirado' };
    }

    const email = result.rows[0].email;
    const hashed = await bcrypt.hash(nuevaClave, 10);

    await pool.query(
      `UPDATE tmusuarios SET password_user = $1 WHERE email_user = $2`,
      [hashed, email]
    );

    await pool.query(`DELETE FROM validacion_token WHERE token = $1`, [token]);

    return { success: true };
  } catch (error) {
    console.error('❌ Error en actualizarContrasena:', error);
    return { success: false, error: 'Error interno' };
  }
}
