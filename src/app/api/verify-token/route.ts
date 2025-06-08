import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
token: z.string(),
});

export async function POST(req: Request) {
try {
    const body = await req.json();
    const { token } = schema.parse(body);

const result = await pool.query(
  `SELECT * FROM password_reset_tokens
WHERE token = $1 AND expires_at > NOW()`,
[token]
);

console.log(' Resultado de consulta:', result.rows);



    const isValid = !!result?.rowCount && result.rowCount > 0;


    return NextResponse.json({ valid: isValid });
} catch (err) {
    console.error(' Error al verificar token:', err);
    return NextResponse.json({ valid: false }, { status: 400 });
}
}
