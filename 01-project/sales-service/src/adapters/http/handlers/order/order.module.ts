import { Module } from '@nestjs/common';
import { OrderControllerV1 } from './order.controller';
import { OrderSolicitationService } from './../../../../business/service/OrderSolicitationService';
import { ORDER_SOLICITATION_SERVICE } from './../../../../business/service/OrderSolicitationServiceInterface';
import { RepositoryModule } from './repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [OrderControllerV1],
  providers: [{ useClass: OrderSolicitationService, provide: ORDER_SOLICITATION_SERVICE }],
})
export class OrderModule {}
