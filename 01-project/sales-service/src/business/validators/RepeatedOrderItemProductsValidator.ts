import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'hasRepeatedOrderItemProducts', async: false })
export class RepeatedOrderItemProductsValidator implements ValidatorConstraintInterface {
  validate(items: any): boolean {
    return !items.some((item, itemIndex: number, arr) =>
      arr.some(({ productId }, index: number) => productId === item.productId && index != itemIndex),
    );
  }

  defaultMessage(): string {
    return 'Duplicated products';
  }
}
