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
    new Promise(resolve => {
      Logger.thread('create', async t => {
        try {
          const userId = req.locals.userId || '';
          const ideaId = req.body.ideaId;
          const content = req.body.content;
          const scores = req.body.scores;

          t.debug(`user ${userId} requests to create review for idea ${ideaId}`);
          const review = await this.commandHandler.create(ideaId, userId, content, scores, t);
          t.log(`review created`);

          resolve({
            status: HttpStatusCodes.Accepted,
            body: review.persistedState,
            headers: {},
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          resolve(handleHttpResponseError(error));
        }
      });
    });

  update = (
    req: HttpRequest<IUpdateReviewDto, IQueryReviewDto>,
  ): Promise<HttpResponse<IReviewState>> =>
    new Promise(resolve => {
      Logger.thread('update', async t => {
        try {
          const userId = req.locals.userId || '';
          const reviewId = req.params.id;
          const content = req.body.content;
          const scores = req.body.scores;

          t.debug(`${userId} wants to update review ${reviewId}`);
          const review = await this.commandHandler.update(userId, reviewId, content, scores, t);
          t.log(`review updated`);

          resolve({
            status: HttpStatusCodes.Accepted,
            body: review.persistedState,
            headers: {},
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          resolve(handleHttpResponseError(error));
        }
      });
    });

  delete = (req: HttpRequest<null, IQueryReviewDto>): Promise<HttpResponse<IReviewState>> =>
    new Promise(resolve => {
      Logger.thread('delete', async t => {
        try {
          const userId = req.locals.userId || '';
          const reviewId = req.params.id;

          t.log(`user ${userId} wants to delete ${reviewId}`);
          const review = await this.commandHandler.delete(userId, reviewId, t);
          t.log('review deleted');

          resolve({
            status: HttpStatusCodes.Accepted,
            body: review.persistedState,
            headers: {},
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          resolve(handleHttpResponseError(error));
        }
      });
    });
}
