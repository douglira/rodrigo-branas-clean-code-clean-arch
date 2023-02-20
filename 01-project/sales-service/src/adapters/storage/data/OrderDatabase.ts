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
        const queryInsertOrder =
          'INSERT INTO sales_service.orders (serial_code, created_at, cpf, total_amount, freight_price, coupon_id) VALUES ((select * from sales_service.get_order_serial_number_seq()), now(), $(cpf), $(total_amount), $(freight_price), coalesce($(coupon_id)::uuid, NULL)) RETURNING id, serial_code';
        const orderInsertResult = await t.one(queryInsertOrder, {
          cpf: order.cpf,
          total_amount: order.totalAmount,
          freight_price: order.freightPrice,
          coupon_id: order.couponId,
        });
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

  async getBySerialCode(serialCode: string): Promise<any> {
    try {
      const queryString = `
        SELECT
          otb.id,
          otb.serial_code,
          timezone('UTC', otb.created_at) AS created_at,
          otb.cpf,
          otb.total_amount,
          otb.freight_price,
          COALESCE(ctb."name", NULL) AS coupon_code,
          (
            SELECT JSON_AGG(JSON_BUILD_OBJECT(
              'product_id', products.id,
              'product_title', products.title,
              'quantity', order_items.quantity,
              'sold_price', order_items.sold_price
            ))
              FROM sales_service.order_items 
              INNER JOIN sales_service.orders ON order_items.order_id = orders.id
              INNER JOIN sales_service.products ON order_items.product_id = products.id
              WHERE order_items.order_id = otb.id
          ) AS items
        FROM sales_service.orders otb
        LEFT JOIN sales_service.coupons ctb ON ctb.id = otb.coupon_id
        WHERE otb.serial_code = $(serialCode)
        LIMIT 1
      `;
      const result = await this.db.oneOrNone(queryString, { serialCode });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async findByCpf(cpf: string): Promise<any> {
    try {
      const queryString = `
        SELECT
          otb.id,
          otb.serial_code,
          timezone('UTC', otb.created_at) AS created_at,
          otb.cpf,
          otb.total_amount,
          otb.freight_price,
          COALESCE(ctb."name", NULL) AS coupon_code
        FROM sales_service.orders otb
        LEFT JOIN sales_service.coupons ctb ON ctb.id = otb.coupon_id
        WHERE otb.cpf = $(cpf)
        ORDER BY otb.created_at DESC
      `;
      const result = await this.db.manyOrNone(queryString, { cpf });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
