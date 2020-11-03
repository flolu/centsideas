import {injectable} from 'inversify'

import {userReadMocks} from '@centsideas/adapters/testing'

@injectable()
export class GoogleApiAdapterMock {
  get signInUrl() {
    return ''
  }

  async getAccessToken(_code: string) {
    return ''
  }

  async getUserInfo(_accessToken: string) {
    return userReadMocks.email2
  }
}
