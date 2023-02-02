import { Injectable } from '@nestjs/common';
import { IClient } from 'pg-promise/typescript/pg-subset';
import * as pgPromise from 'pg-promise';

export const CONNECTION_PROVIDER = 'CONNECTION PROVIDER';

@Injectable()
export class DatabaseConnection {
  public static async getConnection(): Promise<pgPromise.IDatabase<any, IClient>> {
    try {
      const conn = pgPromise({});
      const db = conn({
        host: '0.0.0.0',
        port: 5432,
        user: 'postgres',
        database: 'sales_service',
        password: 'default',
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
      return db;
    } catch (err) {
      console.log('Database connection error', err);
      throw err;
    }
  }
}
