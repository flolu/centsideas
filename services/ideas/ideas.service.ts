import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import {
  HttpRequest,
  HttpResponse,
  IIdeaState,
  IIdeaQueryDto,
  ISaveIdeaDto,
} from '@cents-ideas/models';
import { handleHttpResponseError, ThreadLogger } from '@cents-ideas/utils';

import { IdeaCommandHandler } from './idea.command-handler';

@injectable()
export class IdeasService {
  constructor(private commandHandler: IdeaCommandHandler) {}

  create = (req: HttpRequest<ISaveIdeaDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(resolve => {
      ThreadLogger.thread('create', async t => {
        try {
          const idea = await this.commandHandler.create(
            req.locals.userId,
            req.body.title,
            req.body.description,
            t,
          );
          t.log('idea with title', idea.persistedState.title, 'was created');
          resolve({
            status: HttpStatusCodes.Accepted,
            body: idea.persistedState,
            headers: {},
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          resolve(handleHttpResponseError(error));
        }
      });
    });

  update = (req: HttpRequest<ISaveIdeaDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(resolve => {
      ThreadLogger.thread('update', async t => {
        try {
          const idea = await this.commandHandler.update(
            req.locals.userId,
            req.params.id,
            req.body.title,
            req.body.description,
            t,
          );
          t.log('idea', idea.persistedState.id, 'successfully updated');
          resolve({
            status: HttpStatusCodes.Accepted,
            body: idea.persistedState,
            headers: {},
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          resolve(handleHttpResponseError(error));
        }
      });
    });

  delete = (req: HttpRequest<{}, IIdeaQueryDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(resolve => {
      ThreadLogger.thread('delete', async t => {
        try {
          const idea = await this.commandHandler.delete(req.locals.userId, req.params.id, t);
          t.log('deleted idea', idea.persistedState.id);
          resolve({
            status: HttpStatusCodes.Accepted,
            body: idea.persistedState,
            headers: {},
          });
        } catch (error) {
          t.error(error.status && error.status < 500 ? error.message : error.stack);
          resolve(handleHttpResponseError(error));
        }
      });
    });
}
