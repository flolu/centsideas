import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import {
  HttpRequest,
  HttpResponse,
  IReviewState,
  ICreateReviewDto,
  IQueryReviewDto,
  ISaveReviewDto,
  IUpdateReviewDto,
} from '@cents-ideas/models';
import { Logger, handleHttpResponseError } from '@cents-ideas/utils';

import { ReviewCommandHandler } from './review.command-handler';

@injectable()
export class ReviewsService {
  constructor(private commandHandler: ReviewCommandHandler, private logger: Logger) {}

  createEmptyReview = (req: HttpRequest<ICreateReviewDto>): Promise<HttpResponse<IReviewState>> =>
    new Promise(async resolve => {
      const _loggerName = 'create';
      try {
        this.logger.debug(_loggerName, req.body);
        const review = await this.commandHandler.create(req.body.ideaId);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: review.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  saveDraft = (req: HttpRequest<ISaveReviewDto, IQueryReviewDto>): Promise<HttpResponse<IReviewState>> =>
    new Promise(async resolve => {
      const _loggerName = 'save draft';
      try {
        const review = await this.commandHandler.saveDraft(req.params.id, req.body.content, req.body.scores);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: review.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  publish = (req: HttpRequest<{}, IQueryReviewDto>): Promise<HttpResponse<IReviewState>> =>
    new Promise(async resolve => {
      const _loggerName = 'publish';
      try {
        const review = await this.commandHandler.publish(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: review.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  unpublish = (req: HttpRequest<{}, IQueryReviewDto>): Promise<HttpResponse<IReviewState>> =>
    new Promise(async resolve => {
      const _loggerName = 'unpublish';
      try {
        const review = await this.commandHandler.unpublish(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: review.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  update = (req: HttpRequest<IUpdateReviewDto, IQueryReviewDto>): Promise<HttpResponse<IReviewState>> =>
    new Promise(async resolve => {
      const _loggerName = 'update';
      try {
        const review = await this.commandHandler.update(req.params.id, req.body.content, req.body.scores);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: review.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });
}
