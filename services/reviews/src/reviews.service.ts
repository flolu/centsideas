import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import { HttpRequest, HttpResponse } from '@cents-ideas/models';
import { Logger, handleHttpResponseError } from '@cents-ideas/utils';

import { ReviewCommandHandler } from './review.command-handler';
import { ReviewRepository } from './review.repository';

@injectable()
export class ReviewsService {
  constructor(
    private commandHandler: ReviewCommandHandler,
    private logger: Logger,
    private repository: ReviewRepository,
  ) {}
}
