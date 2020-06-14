import {injectable} from 'inversify';
import * as http from 'http';
import * as sgMail from '@sendgrid/mail';

import {EventsHandler, EventHandler} from '@centsideas/event-sourcing';
import {AuthenticationEventNames, TokenExpirationTimes} from '@centsideas/enums';
import {PersistedEvent, SessionModels} from '@centsideas/models';
import {SecretsConfig} from '@centsideas/config';
import {SessionId, Email, EmailSignInToken} from '@centsideas/types';

import {MailingConfig} from './mailing.config';

@injectable()
export class MailingServer extends EventsHandler {
  consumerGroupName = 'centsideas.mailing';

  private readonly fromEmail = this.config.get('mailing.from');
  private readonly signInTokenSecret = this.secretesConfig.get('secrets.tokens.signin');

  constructor(private secretesConfig: SecretsConfig, private config: MailingConfig) {
    super();
    http.createServer((_, res) => res.writeHead(200).end()).listen(3000);
    sgMail.setApiKey(this.secretesConfig.get('secrets.sendgrid.api'));
  }

  @EventHandler(AuthenticationEventNames.SignInRequested)
  async signInRequested(event: PersistedEvent<SessionModels.SignInRequestedData>) {
    const token = new EmailSignInToken(
      SessionId.fromString(event.data.sessionId),
      Email.fromString(event.data.email),
    );
    const tokenString = token.sign(this.signInTokenSecret, TokenExpirationTimes.SignInToken);
    const msg = {
      to: event.data.email,
      from: `CentsIdeas <${this.fromEmail}>`,
      subject: 'Confirm your sign in',
      text: `This is your sign in token: ${tokenString}`,
      html: `This is your sign in token: <code>${tokenString}</code>`,
    };
    await sgMail.send(msg);
  }
}
