import { Module } from '@nestjs/common';
import { ServiceModule } from '../../../../business/service/service.module';
import { OrderControllerV1 } from './order.controller';

@Module({
  imports: [ServiceModule],
  controllers: [OrderControllerV1],
})
export class OrderModule {}
