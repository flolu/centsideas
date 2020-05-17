import {RpcStatus, ErrorNames} from '@centsideas/enums';
import {InternalError} from '@centsideas/utils';
import {Dtos} from '@centsideas/models';

export class NotificationSettingsPayloadInvalidError extends InternalError {
  static validate = (settings: Dtos.INotificationSettingsDto): void => {
    if (!('sendPushes' in settings))
      throw new NotificationSettingsPayloadInvalidError(`sendPushes is missing`);
    if (!('sendEmails' in settings))
      throw new NotificationSettingsPayloadInvalidError(`sendEmails is missing`);
  };

  constructor(message: string) {
    super(`Invalid notifications settings: ${message}`, {
      name: ErrorNames.NotificationSettingsPayloadInvalid,
      code: RpcStatus.INVALID_ARGUMENT,
    });
  }
}
