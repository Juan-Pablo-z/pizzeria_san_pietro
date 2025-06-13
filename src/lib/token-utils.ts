import crypto from 'crypto';
import { addMinutes } from 'date-fns';
import pool from '@/lib/db';


export function generateToken() {
return crypto.randomBytes(32).toString('hex');
}

export async function saveTokenToDB(email: string, token: string) {
const expires = addMinutes(new Date(), 15);
await pool.query(
    `INSERT INTO validacion_token (email, token, expires_at) VALUES ($1, $2, $3)`,
    [email, token, expires]
);
}

export async function validateToken(token: string) {
const res = await pool.query(
    `SELECT * FROM validacion_token WHERE token = $1 AND expires_at >= NOW()`,
    [token]
);
return res.rows[0];
}

export async function invalidateToken(token: string) {
await pool.query(`DELETE FROM validacion_token WHERE token = $1`, [token]);
}
