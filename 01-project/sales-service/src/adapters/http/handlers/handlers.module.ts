import { Module } from '@nestjs/common';
import { CouponHandlerModule } from './coupon/coupon.module';
import { FreightHandlerModule } from './freight/freight.module';
import { OrderHandlerModule } from './order/order.module';

@Module({
  imports: [OrderHandlerModule, FreightHandlerModule, CouponHandlerModule],
})
export class HandlersModule {}
