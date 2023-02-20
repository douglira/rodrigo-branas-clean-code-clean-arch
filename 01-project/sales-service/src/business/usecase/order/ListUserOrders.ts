import { Inject, Injectable } from '@nestjs/common';
import { ListUserOrdersInterface } from './ListUserOrdersInterface';
import { ListUserOrdersInput } from '../../entities/dto/ListUserOrdersInput';
import { ListUserOrdersOutput } from '../../entities/dto/ListUserOrdersOutput';
import { ORDER_REPOSITORY, OrderRepositoryInterface } from '../../repository/OrderRepositoryInterface';

@Injectable()
export class ListUserOrders implements ListUserOrdersInterface {
  constructor(@Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepositoryInterface) {}
  async execute(input: ListUserOrdersInput): Promise<ListUserOrdersOutput> {
    const orders = await this.orderRepository.findByCpf(input.cpf);
    const output = new ListUserOrdersOutput();
    if (orders) {
      for (const order of orders) {
        output.addOrder({
          total: order.totalAmount,
          freight: order.freightPrice,
          coupon: order.couponCode,
          serialCode: order.serialCode,
          createdAt: order.createdAt,
        });
      }
    }
    return output;
  }
}
