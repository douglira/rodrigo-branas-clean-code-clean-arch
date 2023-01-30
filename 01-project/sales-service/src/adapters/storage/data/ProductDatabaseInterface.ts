export const PRODUCT_DATABASE = 'PRODUCT DATABASE';

export interface ProductDatabaseInterface {
  findByIds(ids: string[]): Promise<any>;
}
