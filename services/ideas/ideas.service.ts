import { injectable } from 'inversify';

import { HttpStatusCodes } from '@centsideas/enums';
import { HttpRequest, HttpResponse, IIdeaState, Dtos } from '@centsideas/models';

import { IdeasHandler } from './ideas.handler';

@injectable()
export class IdeasService {
  constructor(private commandHandler: IdeasHandler) {}

  // FIXME this is undefined when using `async create() {}`
  create = async (req: HttpRequest<Dtos.ICreateIdeaDto>): Promise<HttpResponse<IIdeaState>> => {
    const { title, description } = req.body;
    const auid = req.locals.userId;

    const idea = await this.commandHandler.create(auid, title, description);

    return {
      status: HttpStatusCodes.Accepted,
      body: idea.persistedState,
    };
  };

  update = async (req: HttpRequest<Dtos.IUpdateIdeaDto>): Promise<HttpResponse<IIdeaState>> => {
    const auid = req.locals.userId;
    const ideaId = req.params.id;
    const { title, description } = req.body;

    const idea = await this.commandHandler.update(auid, ideaId, title, description);

    return {
      status: HttpStatusCodes.Accepted,
      body: idea.persistedState,
    };
  };

  delete = async (req: HttpRequest): Promise<HttpResponse<IIdeaState>> => {
    const auid = req.locals.userId;
    const ideaId = req.params.id;

    const idea = await this.commandHandler.delete(auid, ideaId);

    return {
      status: HttpStatusCodes.Accepted,
      body: idea.persistedState,
    };
  };
}
