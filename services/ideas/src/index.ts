// TODO unit tests
// TODO integration test

import * as express from 'express';
import * as bodyParser from 'body-parser';

import { HttpRequest, HttpResponse } from '@cents-ideas/models';
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

const expressJsonAdapter = (controller: (request: HttpRequest) => Promise<HttpResponse>) => {
  return async (req: express.Request, res: express.Response) => {
    const httpRequest: HttpRequest = req.body;
    const response: HttpResponse = await controller(httpRequest);
    return res.json(response);
  };
};

app.post('', expressJsonAdapter(ideasService.createEmptyIdea));
app.put('/draft/:id', expressJsonAdapter(ideasService.saveIdeaDraft));
app.put('/publish/:id', expressJsonAdapter(ideasService.publish));
app.put('/:id', expressJsonAdapter(ideasService.update));
app.put('/unpublish/:id', expressJsonAdapter(ideasService.unpublish));
app.delete('/:id', expressJsonAdapter(ideasService.delete));

// TODO move projection into own service
app.get('', (_req, res) => res.send('get all ideas'));
app.get('/:id', (_req, res) => res.send('get one idea'));

app.listen(port, () => {
  logger.info('ideas service listening on internal port', port);
});
