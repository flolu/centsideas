import {injectable} from 'inversify'

@injectable()
export class UserWriteAdapterMock {
  async getPublicEvents(_from?: number) {
    return []
  }

  async getPrivateEvents(_from?: number) {
    return []
  }
}
