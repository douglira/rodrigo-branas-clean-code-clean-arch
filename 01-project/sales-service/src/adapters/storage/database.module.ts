import { Module } from '@nestjs/common';
import { CouponDatabase } from './data/CouponDatabase';
import { COUPON_DATABASE } from './data/CouponDatabaseInterface';
import { OrderDatabase } from './data/OrderDatabase';
import { ORDER_DATABASE } from './data/OrderDatabaseInterface';
import { ProductDatabase } from './data/ProductDatabase';
import { PRODUCT_DATABASE } from './data/ProductDatabaseInterface';
import { CONNECTION_PROVIDER, DatabaseConnection } from './DatabaseConnection';
import { ConfigService } from '@nestjs/config';
import { StoreDatabase } from './data/StoreDatabase';
import { STORE_DATABASE } from './data/StoreDatabaseInterface';

@Module({
  providers: [
    {
      provide: CONNECTION_PROVIDER,
      useFactory: (configService: ConfigService) => new DatabaseConnection(configService).getConnection(),
      inject: [ConfigService],
    },
    { provide: PRODUCT_DATABASE, useClass: ProductDatabase },
    { provide: COUPON_DATABASE, useClass: CouponDatabase },
    { provide: ORDER_DATABASE, useClass: OrderDatabase },
    { provide: STORE_DATABASE, useClass: StoreDatabase },
  ],
  exports: [
    { provide: PRODUCT_DATABASE, useClass: ProductDatabase },
    { provide: COUPON_DATABASE, useClass: CouponDatabase },
    { provide: ORDER_DATABASE, useClass: OrderDatabase },
    { provide: STORE_DATABASE, useClass: StoreDatabase },
  ],
})
export class DatabaseModule {}
