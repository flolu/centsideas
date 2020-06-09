import {injectable} from 'inversify';
import * as sgMail from '@sendgrid/mail';

import {SecretsConfig} from '@centsideas/config';

import {MailingConfig} from './mailing.config';

@injectable()
export class EmailService {
  private readonly from = this.config.get('mailing.from');

  constructor(private secretsConfig: SecretsConfig, private config: MailingConfig) {
    sgMail.setApiKey(this.secretsConfig.get('secrets.sendgrid.api'));
  }

  sendMail(
    to: string,
    {subject, text, html}: {subject: string; text: string; html: string},
  ): Promise<any> {
    const message = {to, from: this.from, subject, text, html};
    return sgMail.send(message);
  }
}
