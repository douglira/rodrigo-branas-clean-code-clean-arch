import { Inject, Injectable } from '@nestjs/common';
import { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { CONNECTION_PROVIDER } from '../DatabaseConnection';
import { StoreDatabaseInterface } from './StoreDatabaseInterface';

@Injectable()
export class StoreDatabase implements StoreDatabaseInterface {
  constructor(@Inject(CONNECTION_PROVIDER) private readonly db: IDatabase<any, IClient>) {}

  async get(storeId: string): Promise<any> {
    try {
      const queryString = `
        SELECT
          stb.id,
          stb."name",
          (SELECT ROW_TO_JSON(atb.*) AS address)
        FROM sales_service.stores stb
        INNER JOIN sales_service.addresses atb
          ON atb.id = stb.address_id
        WHERE stb.id = $(storeId)
        LIMIT 1
      `;
      const result = await this.db.oneOrNone(queryString, { storeId });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
