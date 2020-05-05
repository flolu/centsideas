import * as grpc from '@grpc/grpc-js';

import { ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';
import { IPushSubscription } from '@centsideas/models';

export class PushSubscriptionInvalidError extends InternalError {
  static validate = (pushSub: IPushSubscription): void => {
    if (!pushSub) throw new PushSubscriptionInvalidError(`payload is required`);
    if (!pushSub.endpoint) throw new PushSubscriptionInvalidError(`endpoint is missing`);
    if (!pushSub.keys) throw new PushSubscriptionInvalidError(`keys are missing`);
    if (!pushSub.keys.p256dh) throw new PushSubscriptionInvalidError(`p256dh key is missing`);
    if (!pushSub.keys.auth) throw new PushSubscriptionInvalidError(`auth key is missing`);
  };

  constructor(message: string) {
    super(`Invalid push subscription: ${message}`, {
      name: ErrorNames.PushSubscriptionInvalid,
      code: grpc.status.INVALID_ARGUMENT,
    });
  }
}
