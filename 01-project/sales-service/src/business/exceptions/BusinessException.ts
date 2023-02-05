import { HttpStatus } from '@nestjs/common';

export abstract class BusinessException extends Error {
  httpStatus: number;
  protected type: string;
  protected code: string;
  protected error: Error | undefined;

  constructor(args: { type: string; code: string; httpStatus?: number }, error?: Error) {
    super(args.code || (error && error.message));
    this.type = args.type;
    this.code = args.code;
    this.error = error;
    this.httpStatus = args.httpStatus || HttpStatus.CONFLICT;
  }

  getHttpError(): { type: string; code: string; timestamp: string } {
    return {
      type: this.type,
      code: this.code,
      timestamp: new Date().toISOString(),
    };
  }
}
