import {injectable} from 'inversify';

import {Email} from '@centsideas/types';

@injectable()
export class UserReadAdapter {
  async getUserByEmail(email: Email) {
    // TODO implement and make sure this fetch is synced
    return null as any;
  }

  async getUserByGoogleId(id: string) {
    // TODO implement and make sure this fetch is synced
    return null as any;
  }
}
