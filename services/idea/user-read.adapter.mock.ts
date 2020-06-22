import {injectable} from 'inversify';

import {UserId, Timestamp} from '@centsideas/types';
import {UserModels} from '@centsideas/models';

@injectable()
export class UserReadAdapterMock {
  async getUserById(user: UserId) {
    const mockUser: UserModels.UserView = {
      id: user.toString(),
      username: 'mock',
      createdAt: Timestamp.now().toString(),
      updatedAt: Timestamp.now().toString(),
      deletedAt: undefined,
      lastEventVersion: 1,
    };
    return mockUser;
  }
}
