import { Module } from '@nestjs/common';
import { CouponDatabase } from './data/CouponDatabase';
import { COUPON_DATABASE } from './data/CouponDatabaseInterface';
import { OrderDatabase } from './data/OrderDatabase';
import { ORDER_DATABASE } from './data/OrderDatabaseInterface';
import { ProductDatabase } from './data/ProductDatabase';
import { PRODUCT_DATABASE } from './data/ProductDatabaseInterface';
import { CONNECTION_PROVIDER, DatabaseConnection } from './DatabaseConnection';

@Module({
  providers: [
    { provide: CONNECTION_PROVIDER, useFactory: () => DatabaseConnection.getConnection() },
    { provide: PRODUCT_DATABASE, useClass: ProductDatabase },
    { provide: COUPON_DATABASE, useClass: CouponDatabase },
    { provide: ORDER_DATABASE, useClass: OrderDatabase },
  ],
  exports: [
    { provide: PRODUCT_DATABASE, useClass: ProductDatabase },
    { provide: COUPON_DATABASE, useClass: CouponDatabase },
    { provide: ORDER_DATABASE, useClass: OrderDatabase },
  ],
})
export class DatabaseModule {}
