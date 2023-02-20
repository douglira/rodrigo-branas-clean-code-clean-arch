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
  Get,
  Param,
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
import { GET_ORDER, GetOrderInterface } from '../../../../business/usecase/order/GetOrderInterface';
import { GetOrderInput } from '../../../../business/entities/dto/GetOrderInput';
import { GetOrderOutput } from '../../../../business/entities/dto/GetOrderOutput';

@Controller({
  path: 'orders',
  version: '1',
})
@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(BusinessExceptionFilter)
export class OrderControllerV1 {
  constructor(
    @Inject(CHECKOUT_ORDER_SOLICITATION) private readonly checkoutOrderSolicitation: CheckoutOrderSolicitationInterface,
    @Inject(GET_ORDER) private readonly getOrder: GetOrderInterface,
  ) {}

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  async preview(@Body() body: OrderSolicitationPreviewPayloadInput): Promise<OrderSolicitationPreviewPayloadOutput> {
    return this.checkoutOrderSolicitation.preview(body);
  }

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  async checkout(@Body() body: OrderSolicitationPreviewPayloadInput): Promise<OrderProcessorOutput> {
    return this.checkoutOrderSolicitation.execute(body);
  }

  @Get(':serialCode')
  async get(@Param('serialCode') serialCode: string): Promise<GetOrderOutput> {
    return this.getOrder.execute(new GetOrderInput(serialCode));
  }
}
