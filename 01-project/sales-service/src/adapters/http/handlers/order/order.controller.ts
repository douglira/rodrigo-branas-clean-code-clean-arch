import {
  Controller,
  Post,
  Body,
  Inject,
  UsePipes,
  ValidationPipe,
  UseFilters,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BusinessExceptionFilter } from '../../exceptions/BusinessExceptionFilter';
import {
  OrderSolicitationServiceInterface,
  ORDER_SOLICITATION_SERVICE,
} from './../../../../business/service/OrderSolicitationServiceInterface';
import {
  OrderSolicitationPreviewPayloadInput,
  OrderSolicitationPreviewPayloadOutput,
} from '../../../../business/entities/dto/OrderSolicitationPreviewPayload';

@Controller({
  path: 'orders',
  version: '1',
})
@UseFilters(BusinessExceptionFilter)
export class OrderControllerV1 {
  constructor(
    @Inject(ORDER_SOLICITATION_SERVICE)
    private readonly orderSolicitation: OrderSolicitationServiceInterface,
  ) {}

  @Post('solicitation-preview')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async solicitationPreview(
    @Body() body: OrderSolicitationPreviewPayloadInput,
  ): Promise<OrderSolicitationPreviewPayloadOutput> {
    return this.orderSolicitation.calculatePreview(body);
  }
}
