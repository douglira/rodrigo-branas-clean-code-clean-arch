import { BusinessException } from './BusinessException';

export enum OrderSolicitationExceptionType {
  INVALID_QUANTITY = 'OSET1000' as any,
  PRODUCTS_LIST_DIFFER_ITEMS_LIST = 'OSET1001' as any,
  PRODUCT_NOT_FOUND = 'OSET1002' as any,
}

export class OrderSolicitationException extends BusinessException {
  constructor(args: { type: OrderSolicitationExceptionType; httpStatus?: number }, error?: Error) {
    super(
      { type: OrderSolicitationExceptionType[args.type], code: String(args.type), httpStatus: args.httpStatus },
      error,
    );
  }
}