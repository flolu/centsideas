import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import { HttpRequest, HttpResponse, IIdeaState } from '@cents-ideas/models';
import { Logger, handleHttpResponseError } from '@cents-ideas/utils';

import { IQueryIdeaDto, ISaveIdeaDto, IUpdateIdeaDraftDto } from './dtos/ideas.dto';
import { IdeaCommandHandler } from './idea.command-handler';
import { IdeaRepository } from './idea.repository';

@injectable()
export class IdeasService {
  constructor(private commandHandler: IdeaCommandHandler, private logger: Logger, private repository: IdeaRepository) {}

  createEmptyIdea = (_req: HttpRequest): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const _loggerName = 'create';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.create();
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

  saveDraft = (req: HttpRequest<ISaveIdeaDto, IQueryIdeaDto>): Promise<HttpResponse<IIdeaState>> =>
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

  discardDraft = (req: HttpRequest<{}, IQueryIdeaDto>): Promise<HttpResponse<IIdeaState>> =>
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

  commitDraft = (req: HttpRequest<{}, IQueryIdeaDto>): Promise<HttpResponse<IIdeaState>> =>
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

  publish = (req: HttpRequest<{}, IQueryIdeaDto>): Promise<HttpResponse<IIdeaState>> =>
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

  delete = (req: HttpRequest<{}, IQueryIdeaDto>): Promise<HttpResponse<IIdeaState>> =>
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
