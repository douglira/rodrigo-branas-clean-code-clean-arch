import { Inject, Injectable } from '@nestjs/common';
import { ProductDatabaseInterface, PRODUCT_DATABASE } from '../../adapters/storage/data/ProductDatabaseInterface';
import { ProductRepositoryInterface } from './ProductRepositoryInterface';
import Product from '../model/Product';

@Injectable()
export class ProductRepository implements ProductRepositoryInterface {
  constructor(@Inject(PRODUCT_DATABASE) private readonly productDatabase: ProductDatabaseInterface) {}

  async getAll(): Promise<Product[]> {
    const result = await this.productDatabase.getAll();
    const products = new Array<Product>();
    result.forEach((p: any) => {
      products.push(new Product(p.id, p.title, p.base_price));
    });
    return products;
  }
}
