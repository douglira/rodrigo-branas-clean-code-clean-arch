import { Inject, Injectable } from '@nestjs/common';
import { IDatabase } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { CONNECTION_PROVIDER } from '../DatabaseConnection';
import { OrderDatabaseInterface } from './OrderDatabaseInterface';

@Injectable()
export class OrderDatabase implements OrderDatabaseInterface {
  constructor(@Inject(CONNECTION_PROVIDER) private readonly db: IDatabase<any, IClient>) {}

  async register(order: any): Promise<any> {
    try {
      const result = await this.db.tx(async (t) => {
        const queryString =
          'INSERT INTO sales_service.orders (serial_code, created_at, cpf, total_amount, freight_price, coupon_id) VALUES ($1, now(), $2, $3, $4, $5) RETURNING id, serial_code';
        const orderInsertResult = await t.one(queryString, [
          order.serialCode,
          order.cpf,
          order.totalAmount,
          order.freightPrice,
          order.couponId,
        ]);
        const orderItemsQueries = [];
        for (const item of order.items) {
          const queryString =
            'INSERT INTO sales_service.order_items (product_id, order_id, quantity, sold_price) VALUES ($1, $2, $3, $4)';
          orderItemsQueries.push(
            t.none(queryString, [item.productId, orderInsertResult.id, item.quantity, item.soldPrice]),
          );
        }
        await t.batch(orderItemsQueries);
        return orderInsertResult;
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
