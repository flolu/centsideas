import {injectable} from 'inversify';
import * as sgMail from '@sendgrid/mail';

import {IUserState} from '@centsideas/models';
import {TopLevelFrontendRoutes, QueryParamKeys} from '@centsideas/enums';

import {NotificationEnvironment} from './notifications.environment';
import {
  getFirstLoginEmail,
  getLoginEmail,
  getRequestEmailChangeEmail,
  getEmailChangedEmail,
} from './emails';
import {IEmailContent} from './models';

@injectable()
export class EmailService {
  private readonly from = this.env.mailing.fromAddress;
  private readonly key = this.env.mailing.apiKey;

  constructor(private env: NotificationEnvironment) {
    sgMail.setApiKey(this.key);
  }

  sendLoginMail(email: string, token: string, firstLogin: boolean, user?: IUserState) {
    const url = `${this.env.frontendUrl}/${TopLevelFrontendRoutes.Login}?${QueryParamKeys.Token}=${token}`;
    return this.sendMail(email, firstLogin ? getFirstLoginEmail(url) : getLoginEmail(url));
  }

  sendRequestEmailChangeEmail(newEmail: string, token: string) {
    const url = `${this.env.frontendUrl}/${TopLevelFrontendRoutes.User}?${QueryParamKeys.ConfirmEmailChangeToken}=${token}`;
    return this.sendMail(newEmail, getRequestEmailChangeEmail(url));
  }

  sendEmailChangedEmail(oldEmail: string, newEmail: string) {
    return this.sendMail(oldEmail, getEmailChangedEmail(newEmail));
  }

  private sendMail(to: string, {subject, text, html}: IEmailContent): Promise<any> {
    const message = {to, from: this.from, subject, text, html};
    return sgMail.send(message);
  }
}
