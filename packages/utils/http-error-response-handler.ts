import { HttpResponse } from '@centsideas/models';
import { HttpStatusCodes } from '@centsideas/enums';
import { Logger } from './logger';

export const handleHttpResponseError = (
  error: any,
  overrides?: Partial<HttpResponse>,
): HttpResponse => {
  Logger.error(error.status && error.status < 500 ? error.message : error.stack);

  return {
    status: (error && error.status) || HttpStatusCodes.InternalServerError,
    body: { error: error.message },
    ...(overrides || {}),
  };
};
