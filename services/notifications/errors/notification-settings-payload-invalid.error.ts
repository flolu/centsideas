import { EntityError } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';
import { Dtos } from '@centsideas/models';

export class NotificationSettingsPayloadInvalid extends EntityError {
  static validate = (settings: Dtos.INotificationSettingsDto): void => {
    if (!('sendPushes' in settings))
      throw new NotificationSettingsPayloadInvalid(`sendPushes is missing`);
    if (!('sendEmails' in settings))
      throw new NotificationSettingsPayloadInvalid(`sendEmails is missing`);
  };

  constructor(message: string) {
    super(`Invalid notifications settings: ${message}`, HttpStatusCodes.BadRequest);
  }
}
