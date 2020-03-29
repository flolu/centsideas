import { HttpResponse } from '@cents-ideas/models';
import { HttpStatusCodes } from '@cents-ideas/enums';

export const handleHttpResponseError = (
  error: any,
  overrides: Partial<HttpResponse> = {},
): HttpResponse => ({
  status: (error && error.status) || HttpStatusCodes.InternalServerError,
  body: { error: error.message },
  headers: {},
  ...overrides,
});
