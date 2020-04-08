import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import * as compression from 'compression';
import { join } from 'path';

import { enableProdMode } from '@angular/core';

enableProdMode();

const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'services/client/src/prodapp');

import { AppServerModule } from './app/app.server.module';

app.use(compression());

app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }) as any);

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.get('*.*', express.static(DIST_FOLDER, { maxAge: '1y' }));

app.get('/alive', (_req, res) => {
  res.status(200).send('client is alive');
});

app.get('*', (req, res) => {
  res.render('index', { req, res });
});

app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
