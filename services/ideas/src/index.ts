// FIXME unit, integration, performance tests

import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { expressJsonAdapter } from '@cents-ideas/utils';
import { registerProviders, getProvider, Logger } from '@cents-ideas/utils';
import { MessageBroker } from '@cents-ideas/event-sourcing';

import { IdeasService } from './ideas.service';
import { IdeaCommandHandler } from './idea.command-handler';
import { IdeaRepository } from './idea.repository';
import env from './environment';

registerProviders(IdeaCommandHandler, IdeaRepository, IdeasService, MessageBroker);

const port: number = env.port;
const app = express();
const { logger } = env;
const ideasService: IdeasService = getProvider(IdeasService);

app.use(bodyParser.json());

app.post('/create', expressJsonAdapter(ideasService.createEmptyIdea));
app.post('/save-draft', expressJsonAdapter(ideasService.saveDraft));
app.post('/publish', expressJsonAdapter(ideasService.publish));
app.post('/update', expressJsonAdapter(ideasService.update));
app.post('/unpublish', expressJsonAdapter(ideasService.unpublish));
app.post('/delete', expressJsonAdapter(ideasService.delete));

app.listen(port, () => logger.info('ideas service listening on internal port', port));
