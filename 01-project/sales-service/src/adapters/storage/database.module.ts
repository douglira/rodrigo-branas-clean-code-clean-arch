import { Module } from '@nestjs/common';
import { ProductDatabase } from './data/ProductDatabase';
import { PRODUCT_DATABASE } from './data/ProductDatabaseInterface';
import { CONNECTION_PROVIDER, DatabaseConnection } from './DatabaseConnection';

@Module({
  providers: [
    {
      provide: CONNECTION_PROVIDER,
      useFactory: () => DatabaseConnection.getConnection(),
    },
    { provide: PRODUCT_DATABASE, useClass: ProductDatabase },
  ],
  exports: [{ provide: PRODUCT_DATABASE, useClass: ProductDatabase }],
})
export class DatabaseModule {}
