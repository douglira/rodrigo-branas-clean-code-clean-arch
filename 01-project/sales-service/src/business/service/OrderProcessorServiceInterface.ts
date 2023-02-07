import { OrderProcessorOutput } from '../entities/dto/OrderProcessorRegisterPayload';
import { OrderSolicitationPreviewPayloadInput } from '../entities/dto/OrderSolicitationPreviewPayload';

export const ORDER_PROCESSOR_SERVICE = 'ORDER PROCESSOR SERVICE';

export interface OrderProcessorServiceInterface {
  register(orderSolicitationPreviewInput: OrderSolicitationPreviewPayloadInput): Promise<OrderProcessorOutput>;
}
