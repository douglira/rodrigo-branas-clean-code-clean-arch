import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { OrderItemInput } from '../entities/dto/OrderItemInput';

@ValidatorConstraint({ name: 'hasRepeatedOrderItemProducts', async: false })
export class RepeatedOrderItemProductsValidator implements ValidatorConstraintInterface {
  validate(items: OrderItemInput[]): boolean {
    return !OrderItemInput.hasRepeatedOrderItem(items);
  }

  defaultMessage(): string {
    return 'Invalid products';
  }
}
