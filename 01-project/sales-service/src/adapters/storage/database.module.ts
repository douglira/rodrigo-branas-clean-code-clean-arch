import { Module } from '@nestjs/common';
import { CouponDatabase } from './data/CouponDatabase';
import { COUPON_DATABASE } from './data/CouponDatabaseInterface';
import { ProductDatabase } from './data/ProductDatabase';
import { PRODUCT_DATABASE } from './data/ProductDatabaseInterface';
import { CONNECTION_PROVIDER, DatabaseConnection } from './DatabaseConnection';

@Module({
  providers: [
    { provide: CONNECTION_PROVIDER, useFactory: () => DatabaseConnection.getConnection() },
    { provide: PRODUCT_DATABASE, useClass: ProductDatabase },
    { provide: COUPON_DATABASE, useClass: CouponDatabase },
  ],
  exports: [
    { provide: PRODUCT_DATABASE, useClass: ProductDatabase },
    { provide: COUPON_DATABASE, useClass: CouponDatabase },
  ],
})
export class DatabaseModule {}
