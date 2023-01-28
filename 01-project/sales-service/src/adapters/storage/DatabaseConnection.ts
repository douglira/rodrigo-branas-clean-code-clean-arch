import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

export const CONNECTION_PROVIDER = 'CONNECTION PROVIDER';

@Injectable()
export class DatabaseConnection {
  public static async getConnection(): Promise<PoolClient> {
    try {
      const conn = new Pool({
        host: '0.0.0.0',
        port: 5432,
        user: 'postgres',
        database: 'sales_service',
        password: 'default',
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      const client = await conn.connect();
      return client;
    } catch (err) {
      console.log('ERRROOOOOOOOO', err);
      throw err;
    }
  }
}
