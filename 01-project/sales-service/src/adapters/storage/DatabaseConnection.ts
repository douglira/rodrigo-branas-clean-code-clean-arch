import { Injectable } from '@nestjs/common';
import { IClient } from 'pg-promise/typescript/pg-subset';
import * as pgPromise from 'pg-promise';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../config/Configuration';

export const CONNECTION_PROVIDER = 'CONNECTION PROVIDER';

@Injectable()
export class DatabaseConnection {
  constructor(private configService: ConfigService) {}
  async getConnection(): Promise<pgPromise.IDatabase<any, IClient>> {
    try {
      const dbConfig = this.configService.get<DatabaseConfig>('database');
      const conn = pgPromise({});
      const db = conn({
        host: dbConfig.postgres.url,
        port: dbConfig.postgres.port,
        user: dbConfig.postgres.auth_user,
        database: dbConfig.postgres.database,
        password: dbConfig.postgres.auth_pswd,
        max: dbConfig.postgres.pool.max,
        idleTimeoutMillis: dbConfig.postgres.pool.idle_timeout_millis,
        connectionTimeoutMillis: dbConfig.postgres.pool.connection_timeout_millis,
      });
      return db;
    } catch (err) {
      console.log('Database connection error', err);
      throw err;
    }
  }
}
