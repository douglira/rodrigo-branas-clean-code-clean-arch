import OrderSolicitation from '../../entities/OrderSolicitation';
import { OrderSolicitationInput } from '../../entities/dto/OrderSolicitationInput';

export const GENERATE_ORDER_SOLICITATION = 'GENERATE ORDER SOLICITATION';

export interface GenerateOrderSolicitationInterface {
  execute(input: OrderSolicitationInput): Promise<OrderSolicitation>;
}
