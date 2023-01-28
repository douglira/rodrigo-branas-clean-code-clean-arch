export const PRODUCT_DATABASE = 'PRODUCT DATABASE';

export interface ProductDatabaseInterface {
  getAll(): Promise<any>;
}
