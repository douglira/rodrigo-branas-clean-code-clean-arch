import { Module } from '@nestjs/common';
import { DatabaseModule } from './../../../storage/database.module';
import { ProductRepository } from './../../../../business/repository/ProductRepository';
import { PRODUCT_REPOSITORY } from './../../../../business/repository/ProductRepositoryInterface';

@Module({
  imports: [DatabaseModule],
  providers: [{ provide: PRODUCT_REPOSITORY, useClass: ProductRepository }],
  exports: [{ provide: PRODUCT_REPOSITORY, useClass: ProductRepository }],
})
export class RepositoryModule {}
