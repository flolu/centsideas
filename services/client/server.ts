import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import { enableProdMode } from '@angular/core';
import * as compression from 'compression';
import * as express from 'express';
import { join } from 'path';
import { argv } from 'yargs';

import { AppServerModule } from './app/app.server.module';

enableProdMode();

process.env.angularEnvironment = JSON.stringify({
  gatewayHost: process.env.GATEWAY_HOST || 'https://api.cents-ideas.flolu.com',
});

const app = express();
const PORT = argv.port || process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'services/client/pwa');

app.use(compression());
app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }) as any);
app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.get('*.*', express.static(DIST_FOLDER, { maxAge: '1y' }));
app.get('/alive', (_req, res) => res.status(200).send('client is alive'));
app.get('*', (req, res) => res.render('index', { req, res }));

app.listen(PORT, () => console.log(`🚀 Node Express server listening on http://localhost:${PORT}`));
