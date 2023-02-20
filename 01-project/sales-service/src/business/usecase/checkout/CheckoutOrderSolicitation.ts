import { Inject, Injectable } from '@nestjs/common';
import { OrderSolicitationInput } from '../../entities/dto/OrderSolicitationInput';
import { OrderProcessorRegisterOutput } from '../../entities/dto/OrderProcessorRegisterOutput';
import {
  GENERATE_ORDER_SOLICITATION,
  GenerateOrderSolicitationInterface,
} from '../order/GenerateOrderSolicitationInterace';
import { ORDER_REPOSITORY, OrderRepositoryInterface } from '../../repository/OrderRepositoryInterface';

@Injectable()
export class CheckoutOrderSolicitation {
  constructor(
    @Inject(GENERATE_ORDER_SOLICITATION) private readonly generateOrderSolicitation: GenerateOrderSolicitationInterface,
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  async execute(input: OrderSolicitationInput): Promise<OrderProcessorRegisterOutput> {
    const orderSolicitation = await this.generateOrderSolicitation.execute(input);
    const orderRepresentation = await this.orderRepository.create(orderSolicitation);
    return new OrderProcessorRegisterOutput(orderRepresentation.getSerialCode());
  }
}
