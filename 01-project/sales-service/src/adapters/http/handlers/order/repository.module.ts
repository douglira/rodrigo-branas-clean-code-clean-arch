import { Module } from '@nestjs/common';
import { DatabaseModule } from './../../../storage/database.module';
import { ProductRepository } from './../../../../business/repository/ProductRepository';
import { PRODUCT_REPOSITORY } from './../../../../business/repository/ProductRepositoryInterface';
import { COUPON_REPOSITORY } from '../../../../business/repository/CouponRepositoryInterface';
import { CouponRepository } from '../../../../business/repository/CouponRepository';

@Module({
  imports: [DatabaseModule],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
    { provide: COUPON_REPOSITORY, useClass: CouponRepository },
  ],
  exports: [
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
    { provide: COUPON_REPOSITORY, useClass: CouponRepository },
  ],
})
export class RepositoryModule {}
