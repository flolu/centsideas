import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, registerProviders, getProvider } from '@cents-ideas/utils';

import env from './environment';
import { ExpressAdapter } from './express-adapter';

process.env.LOGGER_PREFIX = '⛩️';
registerProviders(Logger, ExpressAdapter);

// FIXME inject in some kind of main class to prevent duplicate initialization, same with other services
// FIXME maybe some kind of module file like angular (e.g. common module has logger)
const logger: Logger = getProvider(Logger);
const expressAdapter: ExpressAdapter = getProvider(ExpressAdapter);
const { port } = env;
const app = express();
const ideasApiRoot = env.api.ideas.root;
const ideasHost = env.hosts.ideas;

logger.debug('initialized with env: ', env);

app.use(bodyParser.json());

app.post(`${ideasApiRoot}`, expressAdapter.makeJsonAdapter(`${ideasHost}/create`));
app.put(`${ideasApiRoot}/:id`, expressAdapter.makeJsonAdapter(`${ideasHost}/update`));
app.put(`${ideasApiRoot}/save-draft/:id`, expressAdapter.makeJsonAdapter(`${ideasHost}/save-draft`));
app.put(`${ideasApiRoot}/publish/:id`, expressAdapter.makeJsonAdapter(`${ideasHost}/publish`));
app.put(`${ideasApiRoot}/unpublish/:id`, expressAdapter.makeJsonAdapter(`${ideasHost}/unpublish`));
app.delete(`${ideasApiRoot}/:id`, expressAdapter.makeJsonAdapter(`${ideasHost}/delete`));

app.get(`${ideasApiRoot}/get-all`, expressAdapter.makeJsonAdapter(`${ideasHost}/queries/get-all`));
app.get(`${ideasApiRoot}/get-one`, expressAdapter.makeJsonAdapter(`${ideasHost}/queries/get-one`));

app.listen(port, () => logger.info('gateway listening on internal port', port));
