import Product from '../entities/Product';

export const PRODUCT_REPOSITORY = 'PRODUCT REPOSITORY';

export interface ProductRepositoryInterface {
  findByIds(ids: string[]): Promise<Product[]>;
}
