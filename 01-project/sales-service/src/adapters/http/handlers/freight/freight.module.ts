import { Module } from '@nestjs/common';
import { ServiceModule } from '../../../../business/service/service.module';
import { FreightControllerV1 } from './freight.controller';

@Module({
  imports: [ServiceModule],
  controllers: [FreightControllerV1],
})
export class FreightHandlerModule {}
