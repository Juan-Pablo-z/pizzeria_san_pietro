import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
token: z.string(),
password: z.string().min(6),
});

export async function POST(req: Request) {
try {
    const body = await req.json();
    const { token, password } = schema.parse(body);

    // 1. Buscar token válido
    const result = await pool.query(
    `SELECT email FROM password_reset_tokens
    WHERE token = $1 AND expires_at > NOW()`,
    [token]
    );

    if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 });
    }

    const email = result.rows[0].email;

    // 2. Hashear nueva contraseña
    const hashed = await bcrypt.hash(password, 10);

    // 3. Actualizar contraseña del usuario
    await pool.query(
    `UPDATE tmusuarios SET password_user = $1 WHERE email_user = $2`,
    [hashed, email]
    );

    // 4. Eliminar token
    await pool.query(
    `DELETE FROM password_reset_tokens WHERE token = $1`,
    [token]
    );

    return NextResponse.json({ message: 'Contraseña actualizada' });
} catch (err) {
    console.error(' Error al actualizar contraseña:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
}
}
