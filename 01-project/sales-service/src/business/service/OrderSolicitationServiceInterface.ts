import {
  OrderSolicitationPreviewPayloadRequest,
  OrderSolicitationPreviewPayloadResponse,
} from '../../adapters/http/handlers/order/dto/OrderSolicitationPreviewPayload';

export const ORDER_SOLICITATION_SERVICE = 'ORDER SOLICITATION SERVICE';

export interface OrderSolicitationServiceInterface {
  calculatePreview(
    orderSolicitationPayload: OrderSolicitationPreviewPayloadRequest,
  ): Promise<OrderSolicitationPreviewPayloadResponse>;
}
