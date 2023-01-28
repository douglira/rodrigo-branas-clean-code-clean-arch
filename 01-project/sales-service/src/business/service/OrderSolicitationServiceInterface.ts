import OrderSolicitation from '../model/OrderSolicitation';

export const ORDER_SOLICITATION_SERVICE = 'ORDER SOLICITATION SERVICE';

export interface OrderSolicitationServiceInterface {
  calculatePreview(orderSolicitation: OrderSolicitation): Promise<OrderSolicitation>;
}
