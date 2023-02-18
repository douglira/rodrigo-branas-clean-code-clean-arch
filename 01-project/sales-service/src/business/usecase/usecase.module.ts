import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { CheckoutOrderSolicitation } from './checkout/CheckoutOrderSolicitation';
import { SimulateFreight } from './freight/SimulateFreight';
import { ValidateCouponExpiration } from './coupon/ValidateCouponExpiration';
import { CHECKOUT_ORDER_SOLICITATION } from './checkout/CheckoutOrderSolicitationInterface';
import { SIMULATE_FREIGHT } from './freight/SimulateFreightInterface';
import { VALIDATE_COUPON_EXPIRATION } from './coupon/ValidateCouponExpirationInterface';

@Module({
  imports: [RepositoryModule],
  providers: [
    { provide: CHECKOUT_ORDER_SOLICITATION, useClass: CheckoutOrderSolicitation },
    { provide: SIMULATE_FREIGHT, useClass: SimulateFreight },
    { provide: VALIDATE_COUPON_EXPIRATION, useClass: ValidateCouponExpiration },
  ],
  exports: [
    { provide: CHECKOUT_ORDER_SOLICITATION, useClass: CheckoutOrderSolicitation },
    { provide: SIMULATE_FREIGHT, useClass: SimulateFreight },
    { provide: VALIDATE_COUPON_EXPIRATION, useClass: ValidateCouponExpiration },
  ],
})
export class UseCaseModule {}
