import { injectable } from 'inversify';

import { HttpStatusCodes } from '@centsideas/enums';
import { HttpRequest, HttpResponse, IReviewState, Dtos } from '@centsideas/models';
import { Logger, handleHttpResponseError } from '@centsideas/utils';

import { ReviewsHandler } from './reviews.handler';

@injectable()
export class ReviewsService {
  constructor(private commandHandler: ReviewsHandler) {}

  create = (req: HttpRequest<Dtos.ICreateReviewDto>): Promise<HttpResponse<IReviewState>> =>
    Logger.thread('create', async t => {
      try {
        const auid = req.locals.userId || '';
        const { ideaId, content, scores } = req.body;

        t.debug(`user ${auid} requests to create review for idea ${ideaId}`);
        const review = await this.commandHandler.create(ideaId, auid, content, scores, t);
        t.log(`review created`);

        return {
          status: HttpStatusCodes.Accepted,
          body: review.persistedState,
        };
      } catch (error) {
        return handleHttpResponseError(error, t);
      }
    });

  update = (req: HttpRequest<Dtos.IUpdateReviewDto>): Promise<HttpResponse<IReviewState>> =>
    Logger.thread('update', async t => {
      try {
        const auid = req.locals.userId || '';
        const reviewId = req.params.id;
        const { content, scores } = req.body;

        t.debug(`${auid} wants to update review ${reviewId}`);
        const review = await this.commandHandler.update(auid, reviewId, content, scores, t);
        t.log(`review updated`);

        return {
          status: HttpStatusCodes.Accepted,
          body: review.persistedState,
        };
      } catch (error) {
        return handleHttpResponseError(error, t);
      }
    });

  delete = (req: HttpRequest): Promise<HttpResponse<IReviewState>> =>
    Logger.thread('delete', async t => {
      try {
        const userId = req.locals.userId || '';
        const reviewId = req.params.id;

        t.log(`user ${userId} wants to delete ${reviewId}`);
        const review = await this.commandHandler.delete(userId, reviewId, t);
        t.log('review deleted');

        return {
          status: HttpStatusCodes.Accepted,
          body: review.persistedState,
        };
      } catch (error) {
        return handleHttpResponseError(error, t);
      }
    });
}
