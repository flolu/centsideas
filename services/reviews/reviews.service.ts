import { injectable } from 'inversify';

import { HttpStatusCodes } from '@centsideas/enums';
import { HttpRequest, HttpResponse, IReviewState, Dtos } from '@centsideas/models';

import { ReviewsHandler } from './reviews.handler';

@injectable()
export class ReviewsService {
  constructor(private commandHandler: ReviewsHandler) {}

  create = async (req: HttpRequest<Dtos.ICreateReviewDto>): Promise<HttpResponse<IReviewState>> => {
    const auid = req.locals.userId || '';
    const { ideaId, content, scores } = req.body;

    const review = await this.commandHandler.create(ideaId, auid, content, scores);

    return {
      status: HttpStatusCodes.Accepted,
      body: review.persistedState,
    };
  };

  update = async (req: HttpRequest<Dtos.IUpdateReviewDto>): Promise<HttpResponse<IReviewState>> => {
    const auid = req.locals.userId || '';
    const reviewId = req.params.id;
    const { content, scores } = req.body;

    const review = await this.commandHandler.update(auid, reviewId, content, scores);

    return {
      status: HttpStatusCodes.Accepted,
      body: review.persistedState,
    };
  };

  delete = async (req: HttpRequest): Promise<HttpResponse<IReviewState>> => {
    const userId = req.locals.userId || '';
    const reviewId = req.params.id;

    const review = await this.commandHandler.delete(userId, reviewId);

    return {
      status: HttpStatusCodes.Accepted,
      body: review.persistedState,
    };
  };
}
