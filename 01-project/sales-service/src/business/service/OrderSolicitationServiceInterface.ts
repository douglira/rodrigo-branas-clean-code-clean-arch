import {
  OrderSolicitationPreviewPayloadInput,
  OrderSolicitationPreviewPayloadOutput,
} from '../entities/dto/OrderSolicitationPreviewPayload';
import OrderSolicitation from '../entities/OrderSolicitation';

export const ORDER_SOLICITATION_SERVICE = 'ORDER SOLICITATION SERVICE';

export interface OrderSolicitationServiceInterface {
  calculatePreview(
    orderSolicitationPayload: OrderSolicitationPreviewPayloadInput,
  ): Promise<OrderSolicitationPreviewPayloadOutput>;
  generate(orderSolicitationPayload: OrderSolicitationPreviewPayloadInput): Promise<OrderSolicitation>;
}
