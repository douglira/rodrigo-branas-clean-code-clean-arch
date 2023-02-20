import { Module } from '@nestjs/common';
import { HandlersModule } from './adapters/http/handlers/handlers.module';
import { DatabaseModule } from './adapters/storage/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/Configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [configuration],
    }),
    HandlersModule,
    DatabaseModule,
  ],
})
export class AppModule {}
