import { BusinessException } from './BusinessException';

export enum MeasurementsExceptionType {
  INVALID_MEASUREMENTS = 'MET1000' as any,
}

export class MeasurementsException extends BusinessException {
  constructor(args: { type: MeasurementsExceptionType; httpStatus?: number }, error?: Error) {
    super({ type: MeasurementsExceptionType[args.type], code: String(args.type), httpStatus: args.httpStatus }, error);
  }
}
