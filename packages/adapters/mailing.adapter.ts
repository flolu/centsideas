import * as sgMail from '@sendgrid/mail'
import {injectable} from 'inversify'

import {Config} from '@centsideas/config'
import {Email} from '@centsideas/common/types'

@injectable()
export class MailingAdapter {
  private readonly from = this.config.get('mailing.from.noreply')
  private readonly key = this.config.get('secrets.sendgrid.key')

  constructor(private readonly config: Config) {
    sgMail.setApiKey(this.key)
  }

  // FIXME render email html content with angular https://stackoverflow.com/questions/64275578
  send(to: Email, subject: string, html: string) {
    const message = {to: to.toString(), from: this.from, subject, text: html, html}
    return sgMail.send(message)
  }
}
