import { Inject, Injectable } from '@nestjs/common';
import { ProductDatabaseInterface, PRODUCT_DATABASE } from '../../adapters/storage/data/ProductDatabaseInterface';
import { ProductRepositoryInterface } from './ProductRepositoryInterface';
import Product from '../entities/Product';
import { Measurements } from '../entities/Measurements';

@Injectable()
export class ProductRepository implements ProductRepositoryInterface {
  constructor(@Inject(PRODUCT_DATABASE) private readonly productDatabase: ProductDatabaseInterface) {}

  private factoryProductByProductsData(productsData: any): Product[] {
    const products = new Array<Product>();
    productsData.forEach((productData) => {
      const measurements = new Measurements(
        productData.width,
        productData.height,
        productData.depth,
        productData.weight,
      );
      products.push(new Product(productData.id, productData.title, productData.base_price, measurements));
    });
    return products;
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const result = await this.productDatabase.findByIds(ids);
    return this.factoryProductByProductsData(result);
  }
}
