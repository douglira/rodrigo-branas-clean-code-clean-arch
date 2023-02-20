import { Module } from '@nestjs/common';
import { CouponHandlerModule } from './coupon/coupon.module';
import { FreightHandlerModule } from './freight/freight.module';
import { OrderHandlerModule } from './order/order.module';
import { UserHandlerModule } from './user/user.module';

@Module({
  imports: [OrderHandlerModule, FreightHandlerModule, CouponHandlerModule, UserHandlerModule],
})
export class HandlersModule {}
