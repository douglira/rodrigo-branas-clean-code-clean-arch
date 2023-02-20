import { Module } from '@nestjs/common';
import { UserControllerV1 } from './user.controller';
import { UseCaseModule } from '../../../../business/usecase/usecase.module';

@Module({
  imports: [UseCaseModule],
  controllers: [UserControllerV1],
})
export class UserHandlerModule {}
