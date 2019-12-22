import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import { HttpRequest, HttpResponse } from '@cents-ideas/models';
import { Logger, handleHttpResponseError } from '@cents-ideas/utils';

import { UserCommandHandler } from './user.command-handler';

@injectable()
export class UsersService {
  constructor(private commandHandler: UserCommandHandler, private logger: Logger) {}
}
