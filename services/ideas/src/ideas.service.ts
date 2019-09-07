import { HttpRequest, HttpResponse } from '@cents-ideas/models';
import { HttpStatusCodes } from '@cents-ideas/enums';
import { IdeaCommandHandler } from './idea.command-handler';
import env from './environment';

const { logger } = env;

export class IdeasService {
  constructor(private readonly commandHandler: IdeaCommandHandler) {}

  createEmptyIdea(_req: HttpRequest): Promise<HttpResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        logger.info('create');
        const idea = await this.commandHandler.create();
        return resolve({
          status: HttpStatusCodes.Accepted,
          body: { created: idea.state },
          headers: {},
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  saveIdeaDraft = (req: HttpRequest<{ title?: string; description?: string }>): Promise<HttpResponse> =>
    new Promise(async (resolve, reject) => {
      try {
        logger.info('save draft');
        // TODO where to handle validation log for e.g. id, title ??
        const idea = await this.commandHandler.saveDraft(req.params.id, req.body.title, req.body.description);
        return resolve({
          status: HttpStatusCodes.Accepted,
          body: { saved: idea.state },
          headers: {},
        });
      } catch (error) {
        return reject(error);
      }
    });

  publish = (req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async (resolve, reject) => {
      try {
        logger.info('publish');
        const idea = await this.commandHandler.publish(req.params.id);
        return resolve({
          status: HttpStatusCodes.Accepted,
          body: { published: idea.state },
          headers: {},
        });
      } catch (error) {
        return reject(error);
      }
    });

  // FIXME dto interfaces for payloads
  update = (req: HttpRequest<{ title?: string; description?: string }>): Promise<HttpResponse> =>
    new Promise(async (resolve, reject) => {
      try {
        logger.info('update');
        const idea = await this.commandHandler.update(req.params.id, req.body.title, req.body.description);
        return resolve({
          status: HttpStatusCodes.Accepted,
          body: { unpublish: idea.state },
          headers: {},
        });
      } catch (error) {
        return reject(error);
      }
    });

  unpublish = (req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async (resolve, reject) => {
      try {
        logger.info('unpublish');
        const idea = await this.commandHandler.unpublish(req.params.id);
        return resolve({
          status: HttpStatusCodes.Accepted,
          body: { unpublish: idea.state },
          headers: {},
        });
      } catch (error) {
        return reject(error);
      }
    });

  delete = (req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async (resolve, reject) => {
      try {
        logger.info('delete');
        const idea = await this.commandHandler.delete(req.params.id);
        return resolve({
          status: HttpStatusCodes.Accepted,
          body: { deleted: idea.state },
          headers: {},
        });
      } catch (error) {
        return reject(error);
      }
    });
}
