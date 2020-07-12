import {injectable} from 'inversify';
import * as http from 'http';
import * as sgMail from '@sendgrid/mail';

import {EventsHandler, EventHandler} from '@centsideas/event-sourcing';
import {
  AuthenticationEventNames,
  TokenExpirationTimes,
  PrivateUserEventNames,
  UserEventNames,
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
import {Logger} from '@centsideas/utils';

import {MailingConfig} from './mailing.config';
import {UserReadAdapter} from './user-read.adapter';

@injectable()
export class MailingServer extends EventsHandler {
  consumerGroupName = 'centsideas.mailing';

  private readonly fromEmail = `CentsIdeas <${this.config.get('mailing.from')}>`;

  constructor(
    private secretesConfig: SecretsConfig,
    private config: MailingConfig,
    private _logger: Logger,
    private userReadAdapter: UserReadAdapter,
  ) {
    super();
    http.createServer((_, res) => res.writeHead(this.connected ? 200 : 500).end()).listen(3000);
    sgMail.setApiKey(this.secretesConfig.get('secrets.sendgrid.api'));
  }

  // FIXME acknowledge kafka messages, such that the message will be resent if processing hasn't finished or retyable error was thrown?!
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
      UserId.fromString(event.streamId),
      Email.fromString(event.data.newEmail),
    );
    const tokenString = token.sign(
      this.secretesConfig.get('secrets.tokens.change_email'),
      TokenExpirationTimes.EmailChange,
    );
    const msg = {
      to: event.data.newEmail,
      from: this.fromEmail,
      subject: 'Your email change request',
      text: `This is your email change token: ${tokenString}`,
      html: `This is your email change token: <code>${tokenString}</code>`,
    };
    await sgMail.send(msg);
  }

  @EventHandler(UserEventNames.DeletionRequested)
  async userDeletionRequested(event: PersistedEvent<UserModels.DeletionRequestedData>) {
    const userId = UserId.fromString(event.streamId);
    const token = new UserDeletionToken(userId);
    const tokenString = token.sign(
      this.secretesConfig.get('secrets.tokens.delete_user'),
      TokenExpirationTimes.UserDeletion,
    );
    const emailResponse = await this.userReadAdapter.getEmailById(userId);
    const email = Email.fromString(emailResponse.email);
    const msg = {
      to: email.toString(),
      from: this.fromEmail,
      subject: 'Do you really want to delete your account?',
      text: `This is your account deletion token: ${tokenString}`,
      html: `This is your account deletion token: <code>${tokenString}</code>`,
    };
    await sgMail.send(msg);
  }
}
