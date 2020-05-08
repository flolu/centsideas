import { RpcStatus, ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class NotificationSettingsNotFoundError extends InternalError {
  constructor(id: string) {
    super(`Notification settings with id: ${id} were not found`, {
      name: ErrorNames.NotificationSettingsNotFound,
      code: RpcStatus.NOT_FOUND,
    });
  }
}
