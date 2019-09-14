import { HttpStatusCodes } from '@cents-ideas/enums';
import { HttpResponse, HttpRequest } from '@cents-ideas/models';
import env from './environment';
import { handleHttpResponseError } from './errors/http-response-error-handler';
import { IdeaRepository } from './idea.repository';
import { IQueryIdeaDto } from './dtos/ideas.dto';

const { logger } = env;

export class IdeasDebugService {
  constructor(private readonly repository: IdeaRepository) {}

  getEvents = async (req: HttpRequest<{}, IQueryIdeaDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = `get all events of: ${req.params.id}`;
      try {
        logger.debug(_loggerName);
        const events = await this.repository.getAllEventsFromStream(req.params.id);
        resolve({
          status: HttpStatusCodes.Ok,
          body: events,
          headers: {},
        });
      } catch (error) {
        logger.error(_loggerName, error);
        resolve(handleHttpResponseError(error));
      }
    });

  getSnapshots = async (req: HttpRequest<{}, IQueryIdeaDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = `get latest snapshot of: ${req.params.id}`;
      try {
        logger.debug(_loggerName);
        const snapshots = await this.repository.getLastSnapshotOfStream(req.params.id);
        resolve({
          status: HttpStatusCodes.Ok,
          body: snapshots,
          headers: {},
        });
      } catch (error) {
        logger.error(_loggerName, error);
        resolve(handleHttpResponseError(error));
      }
    });
}
