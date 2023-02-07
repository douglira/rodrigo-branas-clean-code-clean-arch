import {
  OrderSolicitationPreviewPayloadInput,
  OrderSolicitationPreviewPayloadOutput,
} from '../entities/dto/OrderSolicitationPreviewPayload';

export const ORDER_SOLICITATION_SERVICE = 'ORDER SOLICITATION SERVICE';

export interface OrderSolicitationServiceInterface {
  calculatePreview(
    orderSolicitationPayload: OrderSolicitationPreviewPayloadInput,
  ): Promise<OrderSolicitationPreviewPayloadOutput>;
}
