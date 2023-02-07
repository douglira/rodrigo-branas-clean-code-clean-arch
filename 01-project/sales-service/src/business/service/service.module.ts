import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../adapters/http/handlers/order/repository.module';
import { FreightService } from './FreightService';
import { FREIGHT_SERVICE } from './FreightServiceInterface';
import { OrderSolicitationService } from './OrderSolicitationService';
import { ORDER_SOLICITATION_SERVICE } from './OrderSolicitationServiceInterface';

@Module({
  imports: [RepositoryModule],
  providers: [
    { provide: ORDER_SOLICITATION_SERVICE, useClass: OrderSolicitationService },
    { provide: FREIGHT_SERVICE, useClass: FreightService },
  ],
  exports: [
    { provide: ORDER_SOLICITATION_SERVICE, useClass: OrderSolicitationService },
    { provide: FREIGHT_SERVICE, useClass: FreightService },
  ],
})
export class ServiceModule {}
