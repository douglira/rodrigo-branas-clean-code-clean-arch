import { Inject, Injectable } from '@nestjs/common';
import { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { CONNECTION_PROVIDER } from '../DatabaseConnection';
import { ProductDatabaseInterface } from './ProductDatabaseInterface';

@Injectable()
export class ProductDatabase implements ProductDatabaseInterface {
  constructor(@Inject(CONNECTION_PROVIDER) private readonly db: IDatabase<any, IClient>) {}

  async findByIds(ids: string[]): Promise<any> {
    try {
      const queryString = `SELECT * FROM sales_service.products p WHERE p.id IN (${ids
        .map((_, index) => `$${index + 1}`)
        .join(',')})`;
      const result = await this.db.any(queryString, ids);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
