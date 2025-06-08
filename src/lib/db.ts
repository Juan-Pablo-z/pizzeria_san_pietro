import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Cada vez que un cliente se conecta, fija su zona horaria:
pool.on('connect', (client: PoolClient) => {
  client.query(`SET TIME ZONE 'America/Bogota';`)
    .catch((err) => console.error('Error setting timezone:', err));
});

export default pool;
