import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import { HttpRequest, HttpResponse } from '@cents-ideas/models';
import { Logger } from '@cents-ideas/utils';

import { IQueryIdeaDto, ISaveIdeaDto, IUpdateIdeaDraftDto } from './dtos/ideas.dto';
import { handleHttpResponseError } from './errors/http-response-error-handler';
import { IdeaCommandHandler } from './idea.command-handler';
import { IdeaRepository } from './idea.repository';

@injectable()
export class IdeasService {
  constructor(private commandHandler: IdeaCommandHandler, private logger: Logger, private repository: IdeaRepository) {}

  createEmptyIdea = (_req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'create';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.create();
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { created: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  saveDraft = (req: HttpRequest<ISaveIdeaDto, IQueryIdeaDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'save draft';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.saveDraft(req.params.id, req.body.title, req.body.description);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { saved: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  discardDraft = (req: HttpRequest<{}, IQueryIdeaDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'discard draft';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.discardDraft(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { updated: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  commitDraft = (req: HttpRequest<{}, IQueryIdeaDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'commit draft';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.commitDraft(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { updated: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  publish = (req: HttpRequest<{}, IQueryIdeaDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'publish';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.publish(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { published: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  update = (req: HttpRequest<IUpdateIdeaDraftDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'update';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.update(req.params.id, req.body.title, req.body.description);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { unpublish: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  unpublish = (req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'unpublish';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.unpublish(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { unpublish: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  delete = (req: HttpRequest<{}, IQueryIdeaDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'delete';
      try {
        this.logger.info(_loggerName);
        const idea = await this.commandHandler.delete(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { deleted: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });

  // TODO  move to projection database
  getAllIdeas = (_req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'get all';
      try {
        this.logger.info(_loggerName);
        const ideas = await this.repository.listAll();
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { found: ideas.map(i => i.persistedState) },
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });
  getIdeaById = (req: HttpRequest<{}, IQueryIdeaDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'get all';
      try {
        this.logger.info(_loggerName);
        const idea = await this.repository.findById(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { found: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
        resolve(handleHttpResponseError(error));
      }
    });
}
