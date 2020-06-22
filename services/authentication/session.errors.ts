import {Exception} from '@centsideas/utils';
import {RpcStatus, AuthenticationErrorNames} from '@centsideas/enums';
import {SessionId} from '@centsideas/types';

export class SessionAlreadyConfirmed extends Exception {
  code = RpcStatus.FAILED_PRECONDITION;
  name = AuthenticationErrorNames.SessionAlreadyConfirmed;

  constructor() {
    super(`Session already confirmed. Session cannot be confirmed twice.`);
  }
}

export class SessionRevoked extends Exception {
  code = RpcStatus.FAILED_PRECONDITION;
  name = AuthenticationErrorNames.SessionRevoked;

  constructor() {
    super(`Session was revoked.`);
  }
}

export class SessionSignedOut extends Exception {
  code = RpcStatus.FAILED_PRECONDITION;
  name = AuthenticationErrorNames.SessionSignedOut;

  constructor() {
    super(`You have already signed out of this session.`);
  }
}

export class SessionUnconfirmed extends Exception {
  code = RpcStatus.FAILED_PRECONDITION;
  name = AuthenticationErrorNames.SessionUnconfirmed;

  constructor() {
    super(`This session hasn't bee confirmed yet.`);
  }
}

export class SessionNotFound extends Exception {
  name = AuthenticationErrorNames.SessionNotFound;
  code = RpcStatus.NOT_FOUND;

  constructor(id: SessionId) {
    super(`Session with id ${id.toString()} was not found`);
  }
}
