import { HttpRequest, HttpResponse } from '@cents-ideas/models';
import { HttpStatusCodes } from '@cents-ideas/enums';
import { IdeaCommandHandler } from './idea.command-handler';

export class IdeasService {
  constructor(private readonly commandHandler: IdeaCommandHandler) {}

  createEmptyIdea(_req: HttpRequest): Promise<HttpResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const idea = await this.commandHandler.create();
        return resolve({
          status: HttpStatusCodes.Accepted,
          body: { created: idea },
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
        // TODO where to handle validation log for e.g. id, title ??
        const idea = await this.commandHandler.saveDraft(req.params.id, req.body.title, req.body.description);
        return resolve({
          status: HttpStatusCodes.Accepted,
          body: { saved: idea },
          headers: {},
        });
      } catch (error) {
        return reject(error);
      }
    });

  publish = (req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async (resolve, reject) => {
      try {
        const idea = await this.commandHandler.publish(req.params.id);
        return resolve({
          status: HttpStatusCodes.Accepted,
          body: { published: idea },
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
        const idea = await this.commandHandler.update(req.params.id, req.body.title, req.body.description);
        return resolve({
          status: HttpStatusCodes.Accepted,
          body: { unpublish: idea },
          headers: {},
        });
      } catch (error) {
        return reject(error);
      }
    });

  unpublish = (req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async (resolve, reject) => {
      try {
        const idea = await this.commandHandler.unpublish(req.params.id);
        return resolve({
          status: HttpStatusCodes.Accepted,
          body: { unpublish: idea },
          headers: {},
        });
      } catch (error) {
        return reject(error);
      }
    });

  delete = (req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async (resolve, reject) => {
      try {
        const idea = await this.commandHandler.delete(req.params.id);
        return resolve({
          status: HttpStatusCodes.Accepted,
          body: { deleted: idea },
          headers: {},
        });
      } catch (error) {
        return reject(error);
      }
    });
}
