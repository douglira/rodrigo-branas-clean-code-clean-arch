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

  async getNearby(lat: number, lng: number): Promise<any> {
    try {
      const queryString = `
        SELECT
          stb.id,
          stb.name,
          (SELECT ROW_TO_JSON(atb.*) AS address)
        FROM
          sales_service.stores stb INNER JOIN sales_service.addresses atb 
          ON stb.address_id = atb.id
        ORDER BY (
          SELECT (
            (
              (SELECT point(atb.lat::numeric, atb.lng::numeric) FROM sales_service.addresses WHERE id = atb.id) <@>
              (SELECT point($(lat)::numeric, $(lng)::numeric))
            ) * 1.7
          )
        ) ASC
        LIMIT 1
      `;
      const result = await this.db.oneOrNone(queryString, { lat, lng });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
