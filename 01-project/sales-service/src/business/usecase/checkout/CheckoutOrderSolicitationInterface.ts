import { OrderProcessorRegisterOutput } from '../../entities/dto/OrderProcessorRegisterOutput';
import { OrderSolicitationInput } from '../../entities/dto/OrderSolicitationInput';

export const CHECKOUT_ORDER_SOLICITATION = 'CHECKOUT ORDER SOLICITATION';

export interface CheckoutOrderSolicitationInterface {
  execute(orderSolicitationPayload: OrderSolicitationInput): Promise<OrderProcessorRegisterOutput>;
}
