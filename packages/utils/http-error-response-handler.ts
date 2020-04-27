import { HttpResponse } from '@centsideas/models';
import { HttpStatusCodes } from '@centsideas/enums';

import { Logger } from './logger';

export const handleHttpResponseError = (
  error: any,
  overrides?: Partial<HttpResponse>,
): HttpResponse => {
  if (!(error.status && error.status < 500)) Logger.error(error);

  return {
    status: (error && error.status) || HttpStatusCodes.InternalServerError,
    body: { error: error.message },
    ...(overrides || {}),
  };
};
