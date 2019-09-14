// FIXME unit tests
// FIXME integration test

import * as express from 'express';
import * as bodyParser from 'body-parser';

import { HttpRequest, HttpResponse } from '@cents-ideas/models';
import { IdeaCommandHandler } from './idea.command-handler';
import { IdeaRepository } from './idea.repository';
import { IdeasService } from './ideas.service';
import env from './environment';
import { IdeasDebugService } from './ideas-debug.service';

const port: number = env.port;
const app = express();
// FIXME dependency injection
const repository = new IdeaRepository();
const commandHandler = new IdeaCommandHandler(repository);
const ideasService = new IdeasService(commandHandler);
const ideasDebugService = new IdeasDebugService(repository);
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

app.post('/debug/events', expressJsonAdapter(ideasDebugService.getEvents));
app.post('/debug/snapshots', expressJsonAdapter(ideasDebugService.getSnapshots));

// FIXME move projection into own microservice (or just another service... read model not needed until it has significant performance boost)
app.post('/queries/get-all', (_req, res) => res.send('get all ideas'));
app.post('/queries/get-one', (_req, res) => res.send('get one idea'));

app.listen(port, () => logger.info('ideas service listening on internal port', port));
