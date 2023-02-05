import { BusinessException } from '../BusinessException';

export enum CouponExceptionType {
  COUPON_EXPIRED = 'CET1000' as any,
}

export class CouponException extends BusinessException {
  type: CouponExceptionType;

  constructor(args: { type: CouponExceptionType; httpStatus?: number }, error?: Error) {
    super({ code: String(args.type), httpStatus: args.httpStatus }, error);
  }

  getHttpError(): { type: string; code: string; timestamp: string } {
    return {
      type: CouponExceptionType[this.code],
      code: this.code,
      timestamp: new Date().toISOString(),
    };
  }
}
