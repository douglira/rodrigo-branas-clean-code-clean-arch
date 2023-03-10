import OrderRepresentation from '../entities/OrderRepresentation';
import OrderSolicitation from '../entities/OrderSolicitation';

export const ORDER_REPOSITORY = 'ORDER REPOSITORY';

export interface OrderRepositoryInterface {
  create(orderSolicitation: OrderSolicitation): Promise<OrderRepresentation>;
  getBySerialCode(serialCode: string): Promise<OrderRepresentation>;
  findByCpf(cpf: string): Promise<OrderRepresentation[]>;
}
