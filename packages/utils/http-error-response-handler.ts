import { HttpResponse } from '@centsideas/models';
import { HttpStatusCodes } from '@centsideas/enums';
import { ThreadLogger } from './logger';

export const handleHttpResponseError = (
  error: any,
  t?: ThreadLogger,
  overrides?: Partial<HttpResponse>,
): HttpResponse => {
  if (t) t.error(error.status && error.status < 500 ? error.message : error.stack);

  return {
    status: (error && error.status) || HttpStatusCodes.InternalServerError,
    body: { error: error.message },
    ...(overrides || {}),
  };
};
