import { Module } from '@nestjs/common';
import { CouponControllerV1 } from './coupon.controller';
import { UseCaseModule } from '../../../../business/usecase/usecase.module';

@Module({
  imports: [UseCaseModule],
  controllers: [CouponControllerV1],
})
export class CouponHandlerModule {}
