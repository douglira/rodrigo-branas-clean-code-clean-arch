import { BusinessException } from './BusinessException';

export enum OrderSolicitationExceptionType {
  INVALID_QUANTITY = 'OSET0001' as any,
  PRODUCTS_LIST_DIFFER_ITEMS_LIST = 'OSET0002' as any,
  PRODUCT_NOT_FOUND = 'OSET0003' as any,
  DUPLICATED_PRODUCT = 'OSET0004' as any,
  POSTAL_CODE_INVALID = 'OSET0005' as any,
}

export class OrderSolicitationException extends BusinessException {
  constructor(args: { type: OrderSolicitationExceptionType; httpStatus?: number }, error?: Error) {
    super(
      { type: OrderSolicitationExceptionType[args.type], code: String(args.type), httpStatus: args.httpStatus },
      error,
    );
  }
}
