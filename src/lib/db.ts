import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Configura esto si tu base de datos requiere SSL
  },
});

export default pool;