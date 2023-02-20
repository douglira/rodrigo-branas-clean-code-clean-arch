import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { GetOrderInterface } from './GetOrderInterface';
import { GetOrderInput } from '../../entities/dto/GetOrderInput';
import { GetOrderOutput } from '../../entities/dto/GetOrderOutput';
import { ORDER_REPOSITORY, OrderRepositoryInterface } from '../../repository/OrderRepositoryInterface';
import {
  OrderRepresentationException,
  OrderRepresentationExceptionType,
} from '../../exceptions/OrderRepresentationException';

@Injectable()
export class GetOrder implements GetOrderInterface {
  constructor(@Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepositoryInterface) {}

  async execute(input: GetOrderInput): Promise<GetOrderOutput> {
    const orderRepresentation = await this.orderRepository.getBySerialCode(input.serialCode);
    if (!orderRepresentation)
      throw new OrderRepresentationException({
        type: OrderRepresentationExceptionType.NOT_FOUND_DATABASE,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    return new GetOrderOutput(
      orderRepresentation.totalAmount,
      orderRepresentation.freightPrice,
      orderRepresentation.couponCode,
      orderRepresentation.serialCode,
      orderRepresentation.items,
      orderRepresentation.createdAt,
    );
  }
}
