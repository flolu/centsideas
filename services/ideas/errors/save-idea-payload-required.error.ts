import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class SaveIdeaPayloadRequiredError extends InternalError {
  static validate = (title: string, description: string): void => {
    if (!(title && description)) throw new SaveIdeaPayloadRequiredError(!title, !description);
  };

  constructor(titleMissing: boolean, descriptionMissing: boolean) {
    const message = `Title and description are required to save an idea. Missing: ${
      titleMissing ? 'title' : ''
    } ${descriptionMissing ? ', description' : ''}`;

    super(message, {
      name: ErrorNames.SaveIdeaPayloadRequired,
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}
