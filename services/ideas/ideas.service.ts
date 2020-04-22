import { injectable } from 'inversify';

import { HttpStatusCodes } from '@centsideas/enums';
import { HttpRequest, HttpResponse, IIdeaState, Dtos } from '@centsideas/models';
import { handleHttpResponseError, Logger } from '@centsideas/utils';

import { IdeasHandler } from './ideas.handler';

@injectable()
export class IdeasService {
  constructor(private commandHandler: IdeasHandler) {}

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
        return handleHttpResponseError(error, t);
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
        return handleHttpResponseError(error, t);
      }
    });

  delete = (req: HttpRequest): Promise<HttpResponse<IIdeaState>> =>
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
        return handleHttpResponseError(error, t);
      }
    });
}
