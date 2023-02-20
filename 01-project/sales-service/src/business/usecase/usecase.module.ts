import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { CheckoutOrderSolicitation } from './checkout/CheckoutOrderSolicitation';
import { SimulateFreight } from './freight/SimulateFreight';
import { ValidateCouponExpiration } from './coupon/ValidateCouponExpiration';
import { CHECKOUT_ORDER_SOLICITATION } from './checkout/CheckoutOrderSolicitationInterface';
import { SIMULATE_FREIGHT } from './freight/SimulateFreightInterface';
import { VALIDATE_COUPON_EXPIRATION } from './coupon/ValidateCouponExpirationInterface';
import { GetOrder } from './order/GetOrder';
import { GET_ORDER } from './order/GetOrderInterface';
import { LIST_USER_ORDERS } from './order/ListUserOrdersInterface';
import { ListUserOrders } from './order/ListUserOrders';
import { GatewayModule } from '../../adapters/gateway/gateway.module';
import { GENERATE_ORDER_SOLICITATION } from './order/GenerateOrderSolicitationInterace';
import { GenerateOrderSolicitation } from './order/GenerateOrderSolicitation';

@Module({
  imports: [RepositoryModule, GatewayModule],
  providers: [
    { provide: CHECKOUT_ORDER_SOLICITATION, useClass: CheckoutOrderSolicitation },
    { provide: SIMULATE_FREIGHT, useClass: SimulateFreight },
    { provide: VALIDATE_COUPON_EXPIRATION, useClass: ValidateCouponExpiration },
    { provide: GET_ORDER, useClass: GetOrder },
    { provide: LIST_USER_ORDERS, useClass: ListUserOrders },
    { provide: GENERATE_ORDER_SOLICITATION, useClass: GenerateOrderSolicitation },
  ],
  exports: [
    { provide: CHECKOUT_ORDER_SOLICITATION, useClass: CheckoutOrderSolicitation },
    { provide: SIMULATE_FREIGHT, useClass: SimulateFreight },
    { provide: VALIDATE_COUPON_EXPIRATION, useClass: ValidateCouponExpiration },
    { provide: GET_ORDER, useClass: GetOrder },
    { provide: LIST_USER_ORDERS, useClass: ListUserOrders },
    { provide: GENERATE_ORDER_SOLICITATION, useClass: GenerateOrderSolicitation },
  ],
})
export class UseCaseModule {}
