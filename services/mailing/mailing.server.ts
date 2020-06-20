import {injectable} from 'inversify';
import * as http from 'http';
import * as sgMail from '@sendgrid/mail';

import {EventsHandler, EventHandler} from '@centsideas/event-sourcing';
import {
  AuthenticationEventNames,
  TokenExpirationTimes,
  PrivateUserEventNames,
} from '@centsideas/enums';
import {PersistedEvent, SessionModels, UserModels} from '@centsideas/models';
import {SecretsConfig} from '@centsideas/config';
import {
  SessionId,
  Email,
  EmailSignInToken,
  ChangeEmailToken,
  UserId,
  UserDeletionToken,
} from '@centsideas/types';

import {MailingConfig} from './mailing.config';

@injectable()
export class MailingServer extends EventsHandler {
  consumerGroupName = 'centsideas.mailing';

  private readonly fromEmail = `CentsIdeas <${this.config.get('mailing.from')}>`;

  constructor(private secretesConfig: SecretsConfig, private config: MailingConfig) {
    super();
    http.createServer((_, res) => res.writeHead(200).end()).listen(3000);
    sgMail.setApiKey(this.secretesConfig.get('secrets.sendgrid.api'));
  }

  // TODO acknowledge kafka messages, such that the message will be resent if processing hasn't finished or retyable error was thrown?!
  @EventHandler(AuthenticationEventNames.SignInRequested)
  async signInRequested(event: PersistedEvent<SessionModels.SignInRequestedData>) {
    const token = new EmailSignInToken(
      SessionId.fromString(event.data.sessionId),
      Email.fromString(event.data.email),
    );
    const tokenString = token.sign(
      this.secretesConfig.get('secrets.tokens.signin'),
      TokenExpirationTimes.SignIn,
    );
    const msg = {
      to: event.data.email,
      from: this.fromEmail,
      subject: 'Confirm your sign in',
      text: `This is your sign in token: ${tokenString}`,
      html: `This is your sign in token: <code>${tokenString}</code>`,
    };
    await sgMail.send(msg);
  }

  @EventHandler(PrivateUserEventNames.EmailChangeRequested)
  async emailChangeRequested(event: PersistedEvent<UserModels.EmailChangeRequestedData>) {
    const token = new ChangeEmailToken(
      UserId.fromString(event.data.userId),
      Email.fromString(event.data.newEmail),
    );
    const tokenString = token.sign(
      this.secretesConfig.get('secrets.tokens.change_email'),
      TokenExpirationTimes.EmailChange,
    );
  }

  @EventHandler(PrivateUserEventNames.EmailChangeRequested)
  async userDeletionRequested(event: PersistedEvent<UserModels.DeletionRequestedData>) {
    const token = new UserDeletionToken(UserId.fromString(event.data.userId));
    const tokenString = token.sign(
      this.secretesConfig.get('secrets.tokens.delete_user'),
      TokenExpirationTimes.UserDeletion,
    );
    // TODO fetch email of user via adapter
    const msg = {
      to: 'TODO',
      from: this.fromEmail,
      subject: 'Do you really want to delete your account?',
      text: `This is your account deletion token: ${tokenString}`,
      html: `This is your account deletion token: <code>${tokenString}</code>`,
    };
    await sgMail.send(msg);
  }

  // TODO send personal data?
}
