import { Inject, Injectable } from '@nestjs/common';
import { OrderDatabaseInterface, ORDER_DATABASE } from '../../adapters/storage/data/OrderDatabaseInterface';
import { OrderRepositoryInterface } from './OrderRepositoryInterface';
import OrderRepresentation from '../entities/OrderRepresentation';
import OrderSolicitation from '../entities/OrderSolicitation';

@Injectable()
export class OrderRepository implements OrderRepositoryInterface {
  constructor(@Inject(ORDER_DATABASE) private readonly orderDatabase: OrderDatabaseInterface) {}

  async create(orderSolicitaiton: OrderSolicitation): Promise<OrderRepresentation> {
    const order = {
      cpf: orderSolicitaiton.getCpf(),
      totalAmount: orderSolicitaiton.getFinalTotalAmount(),
      freightPrice: orderSolicitaiton.getFreightCost(),
      couponId: orderSolicitaiton.getCouponId(),
      items: orderSolicitaiton.getItems().map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        soldPrice: item.product.basePrice,
      })),
    };
    const result = await this.orderDatabase.register(order);
    return new OrderRepresentation(result.id, result.serial_code);
  }
}
