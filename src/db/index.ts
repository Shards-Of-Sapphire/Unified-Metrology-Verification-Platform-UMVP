import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolConfig } from 'pg';
import * as schema from './schema.ts';


declare global {
  var _postgresPool: Pool | undefined;
}

export function isDbConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL ||
    (process.env.SQL_HOST && process.env.SQL_DB_NAME && process.env.SQL_USER)
  );
}

export const createPool = (): Pool => {
  if (!global._postgresPool) {
    const connectionString = process.env.DATABASE_URL;
    let poolConfig: PoolConfig;

    if (connectionString) {
      const needsSsl =
        connectionString.includes('sslmode=require') ||
        connectionString.includes('neon.tech') ||
        connectionString.includes('supabase.co') ||
        connectionString.includes('aivencloud.com') ||
        connectionString.includes('render.com') ||
        process.env.SQL_SSL === 'true';

      poolConfig = {
        connectionString,
        ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
        max: 10,
        connectionTimeoutMillis: 15000,
      };
    } else {
      const host = process.env.SQL_HOST || 'localhost';
      const port = parseInt(process.env.SQL_PORT || '5432', 10);
      const user = process.env.SQL_USER || 'postgres';
      const password = process.env.SQL_PASSWORD || '';
      const database = process.env.SQL_DB_NAME || 'postgres';
      const needsSsl = process.env.SQL_SSL === 'true';

      poolConfig = {
        host,
        port,
        user,
        password,
        database,
        ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
        max: 10,
        connectionTimeoutMillis: 15000,
      };
    }

    global._postgresPool = new Pool(poolConfig);

    global._postgresPool.on('error', (err) => {
      console.warn('PostgreSQL idle client notice:', err.message);
    });
  }
  return global._postgresPool;
};

export const pool = createPool();
export const db = drizzle(pool, { schema });

export async function testDbConnection(): Promise<{
  connected: boolean;
  version?: string;
  database?: string;
  error?: string;
}> {
  try {
    const res = await pool.query('SELECT current_database(), version();');
    return {
      connected: true,
      database: res.rows[0]?.current_database,
      version: res.rows[0]?.version,
    };
  } catch (err: any) {
    return {
      connected: false,
      error: err?.message || 'Database connection failed',
    };
  }
}

