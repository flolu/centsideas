// FIXME unit tests
// FIXME integration test

import * as express from 'express';
import * as bodyParser from 'body-parser';

import { HttpRequest, HttpResponse } from '@cents-ideas/models';
import { HttpStatusCodes } from '@cents-ideas/enums';
import { IdeaCommandHandler } from './idea.command-handler';
import { IdeaRepository } from './idea.repository';
import { IdeasService } from './ideas.service';
import env from './environment';

const port: number = env.port;
const app = express();
const repository = new IdeaRepository();
const commandHandler = new IdeaCommandHandler(repository);
const ideasService = new IdeasService(commandHandler);
const { logger } = env;

app.use(bodyParser.json());

const expressJsonAdapter = (controller: (request: HttpRequest) => Promise<HttpResponse>) => async (
  req: express.Request,
  res: express.Response,
) => {
  const httpRequest: HttpRequest = req.body;
  const response: HttpResponse = await controller(httpRequest);
  return res.json(response);
};

app.post('/create', expressJsonAdapter(ideasService.createEmptyIdea));
app.post('/save-draft', expressJsonAdapter(ideasService.saveDraft));
app.post('/publish', expressJsonAdapter(ideasService.publish));
app.post('/update', expressJsonAdapter(ideasService.update));
app.post('/unpublish', expressJsonAdapter(ideasService.unpublish));
app.post('/delete', expressJsonAdapter(ideasService.delete));

// FIXME only access with admin password or so
app.post(
  '/debug/events',
  expressJsonAdapter(
    async (req: HttpRequest) =>
      new Promise(async (resolve, reject) => {
        logger.info('[debug] get events');
        try {
          const events = await repository.getStream(req.params.id);
          resolve({
            status: HttpStatusCodes.Accepted,
            body: events,
            headers: {},
          });
        } catch (error) {
          reject(error);
        }
      }),
  ),
);
app.post(
  '/debug/snapshots',
  expressJsonAdapter(
    async (req: HttpRequest) =>
      new Promise(async (resolve, reject) => {
        logger.info('[debug] get snapshots');
        try {
          const snapshots = await repository.getSnapshots(req.params.id);
          resolve({
            status: HttpStatusCodes.Accepted,
            body: snapshots,
            headers: {},
          });
        } catch (error) {
          reject(error);
        }
      }),
  ),
);

// FIXME move projection into own microservice (or just another service... read model not needed until it has significant performance boost)
app.post('/queries/get-all', (_req, res) => res.send('get all ideas'));
app.post('/queries/get-one', (_req, res) => res.send('get one idea'));

app.listen(port, () => logger.info('ideas service listening on internal port', port));
