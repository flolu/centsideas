import { HttpResponse } from '@cents-ideas/models';
import { HttpStatusCodes } from '@cents-ideas/enums';

import { IdeaError } from '.';

// TODO maybe into utils
export const handleHttpResponseError = (error: IdeaError, overrides: Partial<HttpResponse> = {}): HttpResponse => ({
  status: (error && error.status) || HttpStatusCodes.InternalServerError,
  body: { error: error.message },
  headers: {},
  ...overrides,
});
