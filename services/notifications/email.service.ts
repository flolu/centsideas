import { injectable } from 'inversify';
import * as sgMail from '@sendgrid/mail';

import { IUserState } from '@centsideas/models';
import {
  TopLevelFrontendRoutes,
  AuthFrontendRoutes,
  QueryParamKeys,
  UserFrontendRoutes,
} from '@centsideas/enums';

import { NotificationEnvironment } from './notifications.environment';
import { LoginEmail, RequestEmailChangeEmail, EmailChangedEmail } from './emails';

@injectable()
export class EmailService {
  private readonly from = this.env.mailing.fromAddress;
  private readonly key = this.env.mailing.apiKey;

  constructor(private env: NotificationEnvironment) {}

  sendLoginMail(email: string, token: string, firstLogin: boolean, user?: IUserState) {
    const url = `${this.env.frontendUrl}/${TopLevelFrontendRoutes.Auth}/${AuthFrontendRoutes.Login}?${QueryParamKeys.Token}=${token}`;
    // TODO email class / util function to simplify this part
    if (firstLogin)
      return this.sendMail(
        email,
        LoginEmail.sujectFirst,
        LoginEmail.htmlFirst(url),
        LoginEmail.textFirst(url),
      );
    else return this.sendMail(email, LoginEmail.suject, LoginEmail.html(url), LoginEmail.text(url));
  }

  sendRequestEmailChangeEmail(newEmail: string, token: string) {
    const url = `${this.env.frontendUrl}/${TopLevelFrontendRoutes.User}/${UserFrontendRoutes.Me}?${QueryParamKeys.ConfirmEmailChangeToken}=${token}`;
    return this.sendMail(
      newEmail,
      RequestEmailChangeEmail.subject,
      RequestEmailChangeEmail.html(url),
      RequestEmailChangeEmail.text(url),
    );
  }

  sendEmailChangedEmail(oldEmail: string, newEmail: string) {
    return this.sendMail(
      oldEmail,
      EmailChangedEmail.subject,
      EmailChangedEmail.html(newEmail),
      EmailChangedEmail.text(newEmail),
    );
  }

  private sendMail(to: string, subject: string, html: string, text: string): Promise<any> {
    const message = { to, from: this.from, subject, text, html };
    // FIXME maybe it's sufficient to set the key once in the constructor
    sgMail.setApiKey(this.key);
    return sgMail.send(message);
  }
}
