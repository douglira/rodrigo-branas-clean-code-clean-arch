import { Controller, Post, Body, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OrderSolicitationServiceInterface,
  ORDER_SOLICITATION_SERVICE,
} from './../../../../business/service/OrderSolicitationServiceInterface';
import {
  OrderSolicitationPreviewPayloadRequest,
  OrderSolicitationPreviewPayloadResponse,
} from './dto/OrderSolicitationPreviewPayload';

@Controller({
  path: 'orders',
  version: '1',
})
export class OrderControllerV1 {
  constructor(
    @Inject(ORDER_SOLICITATION_SERVICE)
    private readonly orderSolicitation: OrderSolicitationServiceInterface,
  ) {}

  @Post('solicitation-preview')
  @UsePipes(new ValidationPipe({ transform: true }))
  async solicitationPreview(
    @Body() body: OrderSolicitationPreviewPayloadRequest,
  ): Promise<OrderSolicitationPreviewPayloadResponse> {
    const orderSolicitationCalculated = await this.orderSolicitation.calculatePreview(
      OrderSolicitationPreviewPayloadRequest.build(body),
    );
    return new OrderSolicitationPreviewPayloadResponse(orderSolicitationCalculated.getFinalTotalAmount());
  }
}
