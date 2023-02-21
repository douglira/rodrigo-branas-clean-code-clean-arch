import { Inject, Injectable } from '@nestjs/common';
import { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { CONNECTION_PROVIDER } from '../DatabaseConnection';
import { CouponDatabaseInterface } from './CouponDatabaseInterface';

@Injectable()
export class CouponDatabase implements CouponDatabaseInterface {
  constructor(@Inject(CONNECTION_PROVIDER) private readonly db: IDatabase<any, IClient>) {}

  async findByName(name: string): Promise<any> {
    try {
      const queryString = `SELECT c.id, c."name", c.discount, timezone('UTC', c.expires_in) as expires_in FROM sales_service.coupons c WHERE c."name" = $(code) LIMIT 1`;
      const result = await this.db.any(queryString, { code: name });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
