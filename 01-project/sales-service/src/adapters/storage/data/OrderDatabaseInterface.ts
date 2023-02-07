export const ORDER_DATABASE = 'ORDER DATABASE';

export interface OrderDatabaseInterface {
  register(order: any): Promise<any>;
}
