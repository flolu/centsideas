import { RpcStatus, ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';

export class NoNotificationSettingsWithUserIdFoundError extends InternalError {
  constructor(userId: string) {
    super(`Notification settings for user with id ${userId} were not found`, {
      name: ErrorNames.NoNotificationSettingsWithUserIdFound,
      code: RpcStatus.NOT_FOUND,
    });
  }
}
