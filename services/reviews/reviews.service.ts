import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import {
  HttpRequest,
  HttpResponse,
  IReviewState,
  ICreateReviewDto,
  IQueryReviewDto,
  IUpdateReviewDto,
} from '@cents-ideas/models';
import { Logger, handleHttpResponseError } from '@cents-ideas/utils';

import { ReviewCommandHandler } from './review.command-handler';

@injectable()
export class ReviewsService {
  constructor(private commandHandler: ReviewCommandHandler) {}

  create = (req: HttpRequest<ICreateReviewDto>): Promise<HttpResponse<IReviewState>> =>
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
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
      }
    });

  update = (
    req: HttpRequest<IUpdateReviewDto, IQueryReviewDto>,
  ): Promise<HttpResponse<IReviewState>> =>
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
        // TODO pass thread logger into handle http response error to save this duplicate line in every controller
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
      }
    });

  delete = (req: HttpRequest<null, IQueryReviewDto>): Promise<HttpResponse<IReviewState>> =>
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
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
      }
    });
}
