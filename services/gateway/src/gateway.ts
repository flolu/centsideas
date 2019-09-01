import * as express from 'express';
import * as bodyParser from 'body-parser';

import { CentsCommandments } from '@cents-ideas/enums';

const port: number = 3000;
const app = express();

app.use(bodyParser.json());

app.get('**', (_req, res) => {
  res.send(CentsCommandments);
});

app.listen(port, () => console.log('gateway listening on internal port', port));
