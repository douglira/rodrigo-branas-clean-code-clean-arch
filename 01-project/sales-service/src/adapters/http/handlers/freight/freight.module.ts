import { Module } from '@nestjs/common';
import { FreightControllerV1 } from './freight.controller';
import { UseCaseModule } from '../../../../business/usecase/usecase.module';

@Module({
  imports: [UseCaseModule],
  controllers: [FreightControllerV1],
})
export class FreightHandlerModule {}
