import { Module } from '@nestjs/common';
import { FreightHandlerModule } from './freight/freight.module';
import { OrderHandlerModule } from './order/order.module';

@Module({
  imports: [OrderHandlerModule, FreightHandlerModule],
})
export class HandlersModule {}
