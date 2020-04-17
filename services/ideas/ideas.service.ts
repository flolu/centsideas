import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import { HttpRequest, HttpResponse, IIdeaState, Dtos } from '@cents-ideas/models';
import { handleHttpResponseError, Logger } from '@cents-ideas/utils';

import { IdeaCommandHandler } from './idea.command-handler';

@injectable()
export class IdeasService {
  constructor(private commandHandler: IdeaCommandHandler) {}

  create = (req: HttpRequest<Dtos.ICreateIdeaDto>): Promise<HttpResponse<IIdeaState>> =>
    Logger.thread('create', async t => {
      try {
        const { title, description } = req.body;
        const auid = req.locals.userId;

        const idea = await this.commandHandler.create(auid, title, description, t);
        t.log('idea with title', idea.persistedState.title, 'was created');
        return {
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
        };
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
      }
    });

  update = (req: HttpRequest<Dtos.IUpdateIdeaDto>): Promise<HttpResponse<IIdeaState>> =>
    Logger.thread('update', async t => {
      try {
        const auid = req.locals.userId;
        const ideaId = req.params.id;
        const { title, description } = req.body;

        const idea = await this.commandHandler.update(auid, ideaId, title, description, t);
        t.log('idea', idea.persistedState.id, 'successfully updated');

        return {
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
        };
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
      }
    });

  delete = (req: HttpRequest<{}, Dtos.IIdeaQueryDto>): Promise<HttpResponse<IIdeaState>> =>
    Logger.thread('delete', async t => {
      try {
        const auid = req.locals.userId;
        const ideaId = req.params.id;

        const idea = await this.commandHandler.delete(auid, ideaId, t);
        t.log('deleted idea', idea.persistedState.id);

        return {
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
        };
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack);
        return handleHttpResponseError(error);
      }
    });
}
