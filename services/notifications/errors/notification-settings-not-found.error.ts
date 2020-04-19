import { HttpStatusCodes } from '@centsideas/enums';
import { EntityError } from '@centsideas/utils';

export class NotificationSettingsNotFoundError extends EntityError {
  constructor(id: string) {
    super(`Notification settings with id: ${id} were not found`, HttpStatusCodes.NotFound);
  }
}
