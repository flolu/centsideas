import {Aggregate, PersistedSnapshot, Apply} from '@centsideas/event-sourcing';
import {PersistedEvent} from '@centsideas/models';
import {UserId, Email} from '@centsideas/types';

import * as Errors from './user.errors';
import {PrivateUserCreated} from './private-user-created';
import {EmailChangeRequested} from './email-change-requested';
import {EmailChangeConfirmed} from './email-change-confirmed';

export interface SerializedPrivateUser {
  id: string;
  email: string;
  pendingEmail: string | undefined;
}

export class PrivateUser extends Aggregate<SerializedPrivateUser> {
  protected id!: UserId;
  email!: Email;
  pendingEmail: Email | undefined;

  static buildFrom(events: PersistedEvent[], snapshot?: PersistedSnapshot<SerializedPrivateUser>) {
    const privateUser = new PrivateUser();
    if (snapshot) privateUser.applySnapshot(snapshot, events);
    else privateUser.replay(events);
    return privateUser;
  }

  protected deserialize(data: SerializedPrivateUser) {
    this.id = UserId.fromString(data.id);
    this.email = Email.fromString(data.email);
    this.pendingEmail = data.pendingEmail ? Email.fromString(data.pendingEmail) : undefined;
  }

  protected serialize(): SerializedPrivateUser {
    return {
      id: this.id.toString(),
      email: this.email.toString(),
      pendingEmail: this.pendingEmail?.toString(),
    };
  }

  static create(id: UserId, email: Email) {
    const privateUser = new PrivateUser();
    privateUser.raise(new PrivateUserCreated(id, email));
    return privateUser;
  }

  requestEmailChange(userId: UserId, newEmail: Email) {
    this.checkGeneralConditions(userId);
    this.raise(new EmailChangeRequested(newEmail));
  }

  confirmEmailChange(userId: UserId) {
    this.checkGeneralConditions(userId);
    this.raise(new EmailChangeConfirmed());
  }

  private checkGeneralConditions(userId: UserId) {
    if (!this.id.equals(userId)) throw new Errors.NoPermissionToAccessUser(this.id, userId);
  }

  @Apply(PrivateUserCreated)
  created(event: PrivateUserCreated) {
    this.id = event.id;
    this.email = event.email;
  }

  @Apply(EmailChangeRequested)
  emailChangeRequested(event: EmailChangeRequested) {
    this.pendingEmail = event.newEmail;
  }

  @Apply(EmailChangeConfirmed)
  emailChangeConfirmed() {
    this.email = this.pendingEmail!;
    this.pendingEmail = undefined;
  }
}
