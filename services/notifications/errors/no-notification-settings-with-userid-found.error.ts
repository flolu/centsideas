import { HttpStatusCodes } from '@centsideas/enums';
import { EntityError } from '@centsideas/utils';

export class NoNotificationSettingsWithUserIdFoundError extends EntityError {
  constructor(userId: string) {
    super(
      `Notification settings for user with id ${userId} were not found`,
      HttpStatusCodes.NotFound,
    );
  }
}
