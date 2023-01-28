import { Module } from '@nestjs/common';
import { HandlersModule } from './adapters/http/handlers/handlers.module';
import { DatabaseModule } from './adapters/storage/database.module';

@Module({
  imports: [HandlersModule, DatabaseModule],
})
export class AppModule {}
