import { HttpStatus } from '@nestjs/common';

export abstract class BusinessException extends Error {
  httpStatus: number;
  protected code: string;
  protected error: Error | undefined;

  constructor(args: { code: string; httpStatus?: number }, error?: Error) {
    super(args.code || (error && error.message));
    this.code = args.code;
    this.error = error;
    this.httpStatus = args.httpStatus || HttpStatus.INTERNAL_SERVER_ERROR;
  }
  abstract getHttpError(): { type: string; code: string; timestamp: string };
}
