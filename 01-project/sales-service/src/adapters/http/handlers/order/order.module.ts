import { Module } from '@nestjs/common';
import { OrderControllerV1 } from './order.controller';
import { UseCaseModule } from '../../../../business/usecase/usecase.module';

@Module({
  imports: [UseCaseModule],
  controllers: [OrderControllerV1],
})
export class OrderHandlerModule {}
