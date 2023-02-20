import { Validate } from 'class-validator';
import { RepeatedOrderItemProductsValidator } from '../../validators/RepeatedOrderItemProductsValidator';

export type FreightItemInput = {
  product: { id: string; width: number; height: number; depth: number; weight: number };
  quantity: number;
};

export class FreightCalculatorInput {
  @Validate(RepeatedOrderItemProductsValidator)
  items: FreightItemInput[];
  addresseePostalCode: string;
}
