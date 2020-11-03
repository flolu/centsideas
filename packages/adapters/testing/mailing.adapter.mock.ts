import {Email} from '@centsideas/common/types'
import {injectable} from 'inversify'

@injectable()
export class MailingAdapterMock {
  async send(_to: Email, _subject: string, _html: string) {
    // void
  }
}
