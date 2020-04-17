import { Event } from '@cents-ideas/event-sourcing';
import { UserEvents } from '@cents-ideas/enums';
import { IUserState, IRefreshTokenRevokedEvent } from '@cents-ideas/models';

export class RefreshTokenRevokedEvent extends Event<IRefreshTokenRevokedEvent> {
  static readonly eventName: string = UserEvents.RefreshTokenRevoked;

  constructor(userId: string, newTokenId: string, reason: string) {
    super(
      RefreshTokenRevokedEvent.eventName,
      { userId, reason, newRefreshTokenId: newTokenId },
      userId,
    );
  }

  static commit(state: IUserState, event: RefreshTokenRevokedEvent): IUserState {
    state.refreshTokenId = event.data.newRefreshTokenId;
    state.updatedAt = event.timestamp;
    return state;
  }
}
