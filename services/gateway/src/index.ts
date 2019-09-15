import * as express from 'express';
import * as bodyParser from 'body-parser';

import env, { logger } from './environment';
import { ExpressAdapter } from './express-adapter';

const expressAdapter = new ExpressAdapter();
const port: number = env.port;
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
