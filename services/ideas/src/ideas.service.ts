import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import {
  HttpRequest,
  HttpResponse,
  IIdeaState,
  IIdeaQueryDto,
  ISaveIdeaDto,
  IUpdateIdeaDraftDto,
} from '@cents-ideas/models';
import { Logger, handleHttpResponseError, NotAuthenticatedError } from '@cents-ideas/utils';

import { IdeaCommandHandler } from './idea.command-handler';

@injectable()
export class IdeasService {
  constructor(private commandHandler: IdeaCommandHandler, private logger: Logger) {}

  createEmptyIdea = (req: HttpRequest): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const _loggerName = 'create';
      try {
        this.logger.info(_loggerName);
        const userId: string = req.locals.userId || '';
        NotAuthenticatedError.validate(userId);
        const idea = await this.commandHandler.create(userId);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  saveDraft = (req: HttpRequest<ISaveIdeaDto, IIdeaQueryDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const _loggerName = 'save draft';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.saveDraft(req.params.id, req.body.title, req.body.description);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  discardDraft = (req: HttpRequest<{}, IIdeaQueryDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const _loggerName = 'discard draft';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.discardDraft(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  commitDraft = (req: HttpRequest<{}, IIdeaQueryDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const _loggerName = 'commit draft';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.commitDraft(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  publish = (req: HttpRequest<{}, IIdeaQueryDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const _loggerName = 'publish';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.publish(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  update = (req: HttpRequest<IUpdateIdeaDraftDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const _loggerName = 'update';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.update(req.params.id, req.body.title, req.body.description);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  unpublish = (req: HttpRequest): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const _loggerName = 'unpublish';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.unpublish(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  delete = (req: HttpRequest<{}, IIdeaQueryDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const _loggerName = 'delete';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.delete(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });
}
