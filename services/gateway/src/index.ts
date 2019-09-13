import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Identifier } from '@cents-ideas/utils';
import env, { logger } from './environment';
import { ExpressAdapter } from './express-adapter';

const expressAdapter = new ExpressAdapter();
const port: number = env.port;
const app = express();
const ideasApiRoot = env.api.ideas.root;
const ideasHost = env.hosts.ideas;

logger.debug('initialized with env: ', env);

app.use(bodyParser.json());

// FIXME change from get to appropriate methods
app.get(
  `${ideasApiRoot}/create`,
  (req, res, next) => {
    req.body = {};
    next();
  },
  expressAdapter.makeJsonAdapter(`${ideasHost}/create`),
);
app.get(`${ideasApiRoot}/save-draft/:id`, expressAdapter.makeJsonAdapter(`${ideasHost}/save-draft`));
app.get(`${ideasApiRoot}/publish/:id`, expressAdapter.makeJsonAdapter(`${ideasHost}/publish`));
app.get(`${ideasApiRoot}/update/:id`, expressAdapter.makeJsonAdapter(`${ideasHost}/update`));
app.get(`${ideasApiRoot}/unpublish/:id`, expressAdapter.makeJsonAdapter(`${ideasHost}/unpublish`));
app.get(`${ideasApiRoot}/delete/:id`, expressAdapter.makeJsonAdapter(`${ideasHost}/delete`));

app.get(`${ideasApiRoot}/debug/events/:id`, expressAdapter.makeJsonAdapter(`${ideasHost}/debug/events`));

app.get(`${ideasApiRoot}/get-all`, expressAdapter.makeJsonAdapter(`${ideasHost}/queries/get-all`));
app.get(`${ideasApiRoot}/get-one`, expressAdapter.makeJsonAdapter(`${ideasHost}/queries/get-one`));

app.listen(port, () => logger.info('gateway listening on internal port', port));
