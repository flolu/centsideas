import { injectable } from 'inversify';

import { UserRepository } from './user.repository';

@injectable()
export class UserCommandHandler {
  constructor(private repository: UserRepository) {}
}
