import { EntityError } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';
import { IPushSubscription } from '@centsideas/models';

export class PushSubscriptionInvalidError extends EntityError {
  static validate = (pushSub: IPushSubscription): void => {
    if (!pushSub.endpoint) throw new PushSubscriptionInvalidError(`endpoint is missing`);
    if (!pushSub.keys) throw new PushSubscriptionInvalidError(`keys are missing`);
    if (!pushSub.keys.p256dh) throw new PushSubscriptionInvalidError(`p256dh key is missing`);
    if (!pushSub.keys.auth) throw new PushSubscriptionInvalidError(`auth key is missing`);
  };

  constructor(message: string) {
    super(`Invalid push subscription: ${message}`, HttpStatusCodes.BadRequest);
  }
}
