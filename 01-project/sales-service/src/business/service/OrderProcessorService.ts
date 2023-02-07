import { Inject, Injectable } from '@nestjs/common';
import { OrderProcessorOutput } from '../entities/dto/OrderProcessorRegisterPayload';
import { OrderSolicitationPreviewPayloadInput } from '../entities/dto/OrderSolicitationPreviewPayload';
import { OrderRepositoryInterface, ORDER_REPOSITORY } from '../repository/OrderRepositoryInterface';
import { OrderProcessorServiceInterface } from './OrderProcessorServiceInterface';
import { OrderSolicitationServiceInterface, ORDER_SOLICITATION_SERVICE } from './OrderSolicitationServiceInterface';

@Injectable()
export class OrderProcessorService implements OrderProcessorServiceInterface {
  constructor(
    @Inject(ORDER_SOLICITATION_SERVICE) private readonly orderSolicitationService: OrderSolicitationServiceInterface,
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  async register(orderSolicitationPayload: OrderSolicitationPreviewPayloadInput): Promise<OrderProcessorOutput> {
    const orderSolicitation = await this.orderSolicitationService.generate(orderSolicitationPayload);
    const orderRepresentation = await this.orderRepository.create(orderSolicitation);
    return new OrderProcessorOutput(orderRepresentation.getSerialCode());
  }
}
