import { Pool } from 'pg';

export const databaseInstance = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PSW || 'postgres',
    database: process.env.DB_NAME || 'passarela_db',
    port: Number(process.env.DB_PORT) || 5432,
});
