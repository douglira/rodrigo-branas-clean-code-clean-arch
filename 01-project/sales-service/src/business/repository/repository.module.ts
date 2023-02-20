import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../adapters/storage/database.module';
import { ProductRepository } from './/ProductRepository';
import { PRODUCT_REPOSITORY } from './/ProductRepositoryInterface';
import { COUPON_REPOSITORY } from './CouponRepositoryInterface';
import { CouponRepository } from './CouponRepository';
import { OrderRepository } from './OrderRepository';
import { ORDER_REPOSITORY } from './OrderRepositoryInterface';
import { StoreRepository } from './StoreRepository';
import { STORE_REPOSITORY } from './StoreRepositoryInterface';

@Module({
  imports: [DatabaseModule],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
    { provide: COUPON_REPOSITORY, useClass: CouponRepository },
    { provide: ORDER_REPOSITORY, useClass: OrderRepository },
    { provide: STORE_REPOSITORY, useClass: StoreRepository },
  ],
  exports: [
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
    { provide: COUPON_REPOSITORY, useClass: CouponRepository },
    { provide: ORDER_REPOSITORY, useClass: OrderRepository },
    { provide: STORE_REPOSITORY, useClass: StoreRepository },
  ],
})
export class RepositoryModule {}
