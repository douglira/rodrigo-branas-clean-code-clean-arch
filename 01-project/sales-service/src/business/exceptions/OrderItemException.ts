import { BusinessException } from './BusinessException';

export enum OrderItemExceptionType {
  INVALID_QUANTITY = 'OIET1000' as any,
}

export class OrderItemException extends BusinessException {
  constructor(args: { type: OrderItemExceptionType; httpStatus?: number }, error?: Error) {
    super({ type: OrderItemExceptionType[args.type], code: String(args.type), httpStatus: args.httpStatus }, error);
  }
}
