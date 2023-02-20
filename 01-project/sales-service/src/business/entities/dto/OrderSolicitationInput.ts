import { Validate } from 'class-validator';
import { CpfValidator } from '../../validators/CpfValidator';
import { RepeatedOrderItemProductsValidator } from '../../validators/RepeatedOrderItemProductsValidator';

export class OrderSolicitationInput {
  @Validate(CpfValidator)
  cpf: string;

  @Validate(RepeatedOrderItemProductsValidator)
  orderItems: Array<{ productId: string; quantity: number }>;

  coupon: string;
  addresseePostalCode: string;

  constructor(orderItems?: Array<{ productId: string; quantity: number }>, coupon?: string) {
    this.orderItems = orderItems;
    this.coupon = coupon;
  }
}
