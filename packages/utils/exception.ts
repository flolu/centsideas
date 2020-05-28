import {RpcStatus, GenericErrorNames} from '@centsideas/enums';

export abstract class Exception extends Error {
  abstract code: RpcStatus;
  abstract name: string;

  public timestamp = new Date().toISOString();

  constructor(public message: string, public details?: any) {
    super(message);
  }
}

export class UnexpectedException extends Exception {
  code = RpcStatus.UNKNOWN;
  name = GenericErrorNames.Unexpected;

  constructor(message?: string, details?: any) {
    super(message || 'Unexpected error occurred!', details);
  }
}
