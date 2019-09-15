// FIXME unit tests
// FIXME integration test

import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';

export const TYPES = {
  IdeaRepository: Symbol.for('IdeaRepository'),
  IdeaCommandHandler: Symbol.for('IdeaCommandHandler'),
  IdeasService: Symbol.for('IdeasService'),
};

import { HttpRequest, HttpResponse } from '@cents-ideas/models';
import { IdeasService } from './ideas.service';
import env from './environment';
import { Container } from 'inversify';
import { IdeaCommandHandler } from './idea.command-handler';
import { IdeaRepository } from './idea.repository';

const port: number = env.port;
const app = express();

const container = new Container();
container.bind(TYPES.IdeaCommandHandler).to(IdeaCommandHandler);
container.bind(TYPES.IdeaRepository).to(IdeaRepository);
container.bind(TYPES.IdeasService).to(IdeasService);

const ideasService = container.get<IdeasService>(TYPES.IdeasService);

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

// FIXME move projection into own microservice (or just another service... read model not needed until it has significant performance boost)
app.post('/queries/get-all', (_req, res) => res.send('get all ideas'));
app.post('/queries/get-one', (_req, res) => res.send('get one idea'));

app.listen(port, () => logger.info('ideas service listening on internal port', port));
