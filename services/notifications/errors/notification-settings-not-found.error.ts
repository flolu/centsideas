import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class NotificationSettingsNotFoundError extends InternalError {
  constructor(id: string) {
    super(`Notification settings with id: ${id} were not found`, {
      name: ErrorNames.NotificationSettingsNotFound,
      code: grpc.status.NOT_FOUND,
    });
  }
}
