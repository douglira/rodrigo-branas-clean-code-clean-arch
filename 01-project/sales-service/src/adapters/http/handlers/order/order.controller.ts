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
import { OrderSolicitationInput } from '../../../../business/entities/dto/OrderSolicitationInput';
import { OrderSolicitationPreviewOutput } from '../../../../business/entities/dto/OrderSolicitationPreviewOutput';
import { OrderProcessorRegisterOutput } from '../../../../business/entities/dto/OrderProcessorRegisterOutput';
import {
  CHECKOUT_ORDER_SOLICITATION,
  CheckoutOrderSolicitationInterface,
} from '../../../../business/usecase/checkout/CheckoutOrderSolicitationInterface';
import { GET_ORDER, GetOrderInterface } from '../../../../business/usecase/order/GetOrderInterface';
import { GetOrderInput } from '../../../../business/entities/dto/GetOrderInput';
import { GetOrderOutput } from '../../../../business/entities/dto/GetOrderOutput';
import {
  GENERATE_ORDER_SOLICITATION,
  GenerateOrderSolicitationInterface,
} from '../../../../business/usecase/order/GenerateOrderSolicitationInterace';

@Controller({
  path: 'orders',
  version: '1',
})
@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(BusinessExceptionFilter)
export class OrderControllerV1 {
  constructor(
    @Inject(GENERATE_ORDER_SOLICITATION) private readonly generateOrderSolicitation: GenerateOrderSolicitationInterface,
    @Inject(CHECKOUT_ORDER_SOLICITATION) private readonly checkoutOrderSolicitation: CheckoutOrderSolicitationInterface,
    @Inject(GET_ORDER) private readonly getOrder: GetOrderInterface,
  ) {}

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  async preview(@Body() body: OrderSolicitationInput): Promise<OrderSolicitationPreviewOutput> {
    const orderSolicitation = await this.generateOrderSolicitation.execute(body);
    return new OrderSolicitationPreviewOutput(orderSolicitation.getTotal(), orderSolicitation.getFreight());
  }

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  async checkout(@Body() body: OrderSolicitationInput): Promise<OrderProcessorRegisterOutput> {
    return this.checkoutOrderSolicitation.execute(body);
  }

  @Get(':serialCode')
  async get(@Param('serialCode') serialCode: string): Promise<GetOrderOutput> {
    return this.getOrder.execute(new GetOrderInput(serialCode));
  }
}
