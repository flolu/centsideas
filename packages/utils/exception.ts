import {RpcStatus, GenericErrorNames} from '@centsideas/enums';

export abstract class Exception extends Error {
  abstract code: RpcStatus;
  abstract name: string;

  private timestamp = new Date().toISOString;

  constructor(public message: string, private details?: any) {
    super(message);
  }

  serialize() {
    return {
      name: this.name,
      code: this.code,
      timestamp: this.timestamp,
      message: this.message,
      details: this.details,
      stack: this.stack,
    };
  }
}

export class UnexpectedException extends Exception {
  code = RpcStatus.UNKNOWN;
  name = GenericErrorNames.Unexpected;

  constructor(message?: string, details?: any) {
    super(message || 'Unexpected error occurred!', details);
  }
}
