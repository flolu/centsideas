import { RpcStatus } from '@centsideas/enums';

interface InternalErrorOptions {
  name: string;
  code: RpcStatus;
  details?: string;
}

export class InternalError extends Error {
  code = RpcStatus.UNKNOWN;
  timestamp = new Date().toISOString();
  service = process.env.service || process.env.SERVICE || '';
  details = '';

  constructor(message: string, options?: InternalErrorOptions) {
    super(message);

    if (!options) return;
    this.name = options.name;
    this.code = options.code;
    this.details = options.details || this.details;
  }

  static isUnexpected(name: string) {
    return !name || name?.toLowerCase() === 'error' || name?.includes('unexpected');
  }
}
