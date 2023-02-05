import { BusinessException } from './BusinessException';

export enum CouponExceptionType {
  COUPON_EXPIRED = 'CET1000' as any,
}

export class CouponException extends BusinessException {
  constructor(args: { type: CouponExceptionType; httpStatus?: number }, error?: Error) {
    super({ type: CouponExceptionType[args.type], code: String(args.type), httpStatus: args.httpStatus }, error);
  }
}
