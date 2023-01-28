import { Inject, Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { CONNECTION_PROVIDER } from '../DatabaseConnection';
import { ProductDatabaseInterface } from './ProductDatabaseInterface';

@Injectable()
export class ProductDatabase implements ProductDatabaseInterface {
  constructor(@Inject(CONNECTION_PROVIDER) private readonly connection: PoolClient) {}

  async getAll(): Promise<any> {
    const result = await this.connection.query('SELECT * FROM sales_service.products');
    this.connection.release();
    return result.rows;
  }
}
