import { injectable } from 'inversify';

import { sanitizeHtml } from '@cents-ideas/utils';

import {
  IdeaAlreadyDeletedError,
  IdeaAlreadyPublishedError,
  IdeaAlreadyUnpublishedError,
  IdeaDescriptionLengthError,
  IdeaIdRequiredError,
  IdeaTitleLengthError,
  SaveIdeaPayloadRequiredError,
} from './errors';
import { Review } from './review.entity';
import { ReviewRepository } from './review.repository';
import { ReviewDeletedError } from './errors/idea.deleted.error';

export interface IIdeaCommandHandler {}

@injectable()
export class ReviewCommandHandler implements IIdeaCommandHandler {
  constructor(private repository: ReviewRepository) {}
}
