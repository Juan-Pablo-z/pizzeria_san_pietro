import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';
import { addMinutes } from 'date-fns';
import pool from '@/lib/db';
import { z } from 'zod';

// inicializamos resend con la clave de API
const resend = new Resend(process.env.RESEND_API_KEY!);

const schema = z.object({
email: z.string().email(),
});

export async function POST(req: Request) {
try {
    const body = await req.json();
    const { email } = schema.parse(body);

    // consulta para verificar que el correo existe
    const result = await pool.query(
    'SELECT nom_user FROM tmusuarios WHERE email_user = $1',
    [email]
    );

    const user = result.rows[0];

    if (!user) {
    return NextResponse.json({ error: 'Correo no registrado' }, { status: 404 });
    }

    // se Genera el token único y su expiracion
const token = crypto.randomBytes(32).toString('hex');

// se  Calcula expiración del link
const expires = addMinutes(new Date(), 15);

// se guardo el token con fecha
await pool.query(
`INSERT INTO password_reset_tokens (email, token, expires_at)
VALUES ($1, $2, $3)`,
[email, token, expires]
);






    // enlace de recuperación
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/nueva-clave?token=${token}`;
    console.log(" Enlace de recuperación:", resetLink);

    // se envia el correo de recuperación
    await resend.emails.send({
    from: 'laciel071278@resend.dev',
      to: 'laciel071278@gmail.com', // unico correo permitido por resend
    subject: 'Recuperación de contraseña - San Pietro',
    html: `
        <p>Hola ${user.nom_user},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Este enlace expirará en 15 minutos.</p>
    `});

    return NextResponse.json({ message: 'Correo enviado correctamente' });
} catch (err: any) {
    console.error('❌ Error en password-recovery:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
}
}
