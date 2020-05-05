import * as grpc from '@grpc/grpc-js';

interface InternalErrorOptions {
  name: string;
  code: grpc.status;
  details?: string;
}

export class InternalError extends Error {
  code = grpc.status.UNKNOWN;
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
}
