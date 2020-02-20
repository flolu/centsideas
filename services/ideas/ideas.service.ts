import { injectable } from 'inversify';

import { HttpStatusCodes } from '@cents-ideas/enums';
import { HttpRequest, HttpResponse, IIdeaState, IIdeaQueryDto, ISaveIdeaDto } from '@cents-ideas/models';
import { Logger, handleHttpResponseError } from '@cents-ideas/utils';

import { IdeaCommandHandler } from './idea.command-handler';

@injectable()
export class IdeasService {
  constructor(private commandHandler: IdeaCommandHandler, private logger: Logger) {}

  create = (req: HttpRequest<ISaveIdeaDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const _loggerName = 'create';
      try {
        this.logger.debug(_loggerName);
        const userId: string = req.locals.userId || '';
        const idea = await this.commandHandler.create(userId, req.body.title, req.body.description);
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

  update = (req: HttpRequest<ISaveIdeaDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const _loggerName = 'update';
      try {
        this.logger.debug(_loggerName);
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

  delete = (req: HttpRequest<{}, IIdeaQueryDto>): Promise<HttpResponse<IIdeaState>> =>
    new Promise(async resolve => {
      const _loggerName = 'delete';
      try {
        this.logger.debug(_loggerName);
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
