import { Module } from '@nestjs/common';
import { ServiceModule } from '../../../../business/service/service.module';
import { CouponControllerV1 } from './coupon.controller';

@Module({
  imports: [ServiceModule],
  controllers: [CouponControllerV1],
})
export class CouponHandlerModule {}
