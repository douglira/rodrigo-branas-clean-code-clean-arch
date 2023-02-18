import { OrderProcessorOutput } from '../../entities/dto/OrderProcessorRegisterPayload';
import {
  OrderSolicitationPreviewPayloadInput,
  OrderSolicitationPreviewPayloadOutput,
} from '../../entities/dto/OrderSolicitationPreviewPayload';

export const CHECKOUT_ORDER_SOLICITATION = 'CHECKOUT ORDER SOLICITATION';

export interface CheckoutOrderSolicitationInterface {
  preview(
    orderSolicitationPayload: OrderSolicitationPreviewPayloadInput,
  ): Promise<OrderSolicitationPreviewPayloadOutput>;
  execute(orderSolicitationPayload: OrderSolicitationPreviewPayloadInput): Promise<OrderProcessorOutput>;
}
