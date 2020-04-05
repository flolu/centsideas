import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import {
  HttpRequest,
  HttpResponse,
  IIdeaState,
  IIdeaQueryDto,
  ISaveIdeaDto,
} from '@cents-ideas/models';
import {
  Logger,
  handleHttpResponseError,
  NotAuthenticatedError,
  NoPermissionError,
} from '@cents-ideas/utils';

import { IdeaCommandHandler } from './idea.command-handler';

@injectable()
export class IdeasService {
  constructor(private commandHandler: IdeaCommandHandler, private logger: Logger) {}

  create = (req: HttpRequest<ISaveIdeaDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const t = this.logger.thread('create');
      try {
        const idea = await this.commandHandler.create(
          req.locals.userId,
          req.body.title,
          req.body.description,
          t,
        );
        t.log('idea with title', idea.persistedState.title, 'was created').complete();
        resolve({
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
          headers: {},
        });
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack).complete();
        resolve(handleHttpResponseError(error));
      }
    });

  update = (req: HttpRequest<ISaveIdeaDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const t = this.logger.thread('update');
      try {
        const idea = await this.commandHandler.update(
          req.locals.userId,
          req.params.id,
          req.body.title,
          req.body.description,
          t,
        );
        t.log('idea', idea.persistedState.id, 'successfully updated').complete();
        resolve({
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
          headers: {},
        });
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack).complete();
        resolve(handleHttpResponseError(error));
      }
    });

  delete = (req: HttpRequest<{}, IIdeaQueryDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const t = this.logger.thread('delete');
      try {
        const idea = await this.commandHandler.delete(req.locals.userId, req.params.id, t);
        t.log('deleted idea', idea.persistedState.id).complete();
        resolve({
          status: HttpStatusCodes.Accepted,
          body: idea.persistedState,
          headers: {},
        });
      } catch (error) {
        t.error(error.status && error.status < 500 ? error.message : error.stack).complete();
        resolve(handleHttpResponseError(error));
      }
    });
}
