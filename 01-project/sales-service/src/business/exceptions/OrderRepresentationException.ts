import { BusinessException } from './BusinessException';

export enum OrderRepresentationExceptionType {
  NOT_FOUND_DATABASE = 'ORET1000' as any,
}

export class OrderRepresentationException extends BusinessException {
  constructor(args: { type: OrderRepresentationExceptionType; httpStatus?: number }, error?: Error) {
    super(
      { type: OrderRepresentationExceptionType[args.type], code: String(args.type), httpStatus: args.httpStatus },
      error,
    );
  }
}
