import { Inject, Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { CONNECTION_PROVIDER } from '../DatabaseConnection';
import { ProductDatabaseInterface } from './ProductDatabaseInterface';

@Injectable()
export class ProductDatabase implements ProductDatabaseInterface {
  constructor(@Inject(CONNECTION_PROVIDER) private readonly connection: PoolClient) {}

  async findByIds(ids: string[]): Promise<any> {
    try {
      const queryString = `SELECT * FROM sales_service.products p WHERE p.id IN (${ids
        .map((_, index) => `$${index + 1}`)
        .join(',')})`;
      const result = await this.connection.query(queryString, ids);
      return result.rows;
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
