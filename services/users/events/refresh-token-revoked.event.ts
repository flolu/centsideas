import { Event } from '@centsideas/event-sourcing';
import { UserEvents } from '@centsideas/enums';
import { IUserState, IRefreshTokenRevokedEvent } from '@centsideas/models';

export class RefreshTokenRevokedEvent extends Event<IRefreshTokenRevokedEvent> {
  static readonly eventName: string = UserEvents.RefreshTokenRevoked;

  constructor(userId: string, payload: IRefreshTokenRevokedEvent) {
    super(RefreshTokenRevokedEvent.eventName, { ...payload, userId }, userId);
  }

  static commit(state: IUserState, event: RefreshTokenRevokedEvent): IUserState {
    state.refreshTokenId = event.data.newRefreshTokenId;
    state.updatedAt = event.timestamp;
    return state;
  }
}
