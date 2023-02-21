import { Inject, Injectable } from '@nestjs/common';
import { OrderDatabaseInterface, ORDER_DATABASE } from '../../adapters/storage/data/OrderDatabaseInterface';
import { OrderRepositoryInterface } from './OrderRepositoryInterface';
import OrderRepresentation from '../entities/OrderRepresentation';
import OrderSolicitation from '../entities/OrderSolicitation';
import OrderItem from '../entities/OrderItem';
import Product from '../entities/Product';

@Injectable()
export class OrderRepository implements OrderRepositoryInterface {
  constructor(@Inject(ORDER_DATABASE) private readonly orderDatabase: OrderDatabaseInterface) {}

  async create(orderSolicitaiton: OrderSolicitation): Promise<OrderRepresentation> {
    const order = {
      cpf: orderSolicitaiton.getCpf(),
      totalAmount: orderSolicitaiton.getTotal(),
      freightPrice: orderSolicitaiton.getFreight(),
      couponId: orderSolicitaiton.getCouponId(),
      items: orderSolicitaiton.getItems().map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        soldPrice: item.product.basePrice,
      })),
    };
    const result = await this.orderDatabase.register(order);
    return new OrderRepresentation(result.id, result.serial_code, result.created_at);
  }

  async getBySerialCode(serialCode: string): Promise<OrderRepresentation> {
    const result = await this.orderDatabase.getBySerialCode(serialCode);
    if (result) {
      return new OrderRepresentation(
        result.id,
        result.serial_code,
        result.created_at,
        result.cpf,
        result.total_amount,
        result.freight_price,
        result.coupon_code,
        result.items.map((item) => {
          const orderItem = new OrderItem(new Product(item.product_id, item.product_title), item.quantity);
          orderItem.soldPrice = item.sold_price;
          return orderItem;
        }),
      );
    }
  }

  async findByCpf(cpf: string): Promise<OrderRepresentation[]> {
    const result = await this.orderDatabase.findByCpf(cpf);
    if (result) {
      return result.map((order) => {
        return new OrderRepresentation(
          order.id,
          order.serial_code,
          order.created_at,
          order.cpf,
          order.total_amount,
          order.freight_price,
          order.coupon_code,
        );
      });
    }
  }
}
