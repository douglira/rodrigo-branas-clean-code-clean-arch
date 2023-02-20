import { Validate } from 'class-validator';
import { RepeatedOrderItemProductsValidator } from '../../validators/RepeatedOrderItemProductsValidator';
import { OrderItemInput } from './OrderItemInput';

export class FreightCalculatorInput {
  @Validate(RepeatedOrderItemProductsValidator)
  items: OrderItemInput[];
  addresseePostalCode: string;
  storeId: string;
}
