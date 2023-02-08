import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { FreightService } from './FreightService';
import { FREIGHT_SERVICE } from './FreightServiceInterface';
import { OrderItemService } from './OrderItemService';
import { ORDER_ITEM_SERVICE } from './OrderItemServiceInterface';
import { OrderProcessorService } from './OrderProcessorService';
import { ORDER_PROCESSOR_SERVICE } from './OrderProcessorServiceInterface';
import { OrderSolicitationService } from './OrderSolicitationService';
import { ORDER_SOLICITATION_SERVICE } from './OrderSolicitationServiceInterface';

@Module({
  imports: [RepositoryModule],
  providers: [
    { provide: ORDER_SOLICITATION_SERVICE, useClass: OrderSolicitationService },
    { provide: FREIGHT_SERVICE, useClass: FreightService },
    { provide: ORDER_PROCESSOR_SERVICE, useClass: OrderProcessorService },
    { provide: ORDER_ITEM_SERVICE, useClass: OrderItemService },
  ],
  exports: [
    { provide: ORDER_SOLICITATION_SERVICE, useClass: OrderSolicitationService },
    { provide: FREIGHT_SERVICE, useClass: FreightService },
    { provide: ORDER_PROCESSOR_SERVICE, useClass: OrderProcessorService },
    { provide: ORDER_ITEM_SERVICE, useClass: OrderItemService },
  ],
})
export class ServiceModule {}
