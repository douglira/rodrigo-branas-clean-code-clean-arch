import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseFilters,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { BusinessExceptionFilter } from '../../exceptions/BusinessExceptionFilter';
import {
  OrderSolicitationPreviewPayloadInput,
  OrderSolicitationPreviewPayloadOutput,
} from '../../../../business/entities/dto/OrderSolicitationPreviewPayload';
import { OrderProcessorOutput } from '../../../../business/entities/dto/OrderProcessorRegisterPayload';
import {
  CHECKOUT_ORDER_SOLICITATION,
  CheckoutOrderSolicitationInterface,
} from '../../../../business/usecase/checkout/CheckoutOrderSolicitationInterface';

@Controller({
  path: 'orders',
  version: '1',
})
@UseFilters(BusinessExceptionFilter)
export class OrderControllerV1 {
  constructor(
    @Inject(CHECKOUT_ORDER_SOLICITATION) private readonly checkoutOrderSolicitation: CheckoutOrderSolicitationInterface,
  ) {}

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async preview(@Body() body: OrderSolicitationPreviewPayloadInput): Promise<OrderSolicitationPreviewPayloadOutput> {
    return this.checkoutOrderSolicitation.preview(body);
  }

  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async checkout(@Body() body: OrderSolicitationPreviewPayloadInput): Promise<OrderProcessorOutput> {
    return this.checkoutOrderSolicitation.execute(body);
  }
}
