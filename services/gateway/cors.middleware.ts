import * as cors from 'cors';

import env from './environment';

let whitelist = [env.frontendUrl];
if (env.environment === 'dev')
  whitelist = [
    ...whitelist,
    'http://localhost:4000',
    'http://localhost:5432',
    'http://127.0.0.1:4000',
    'http://127.0.0.1:5432',
  ];

const checkOrigin = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
) => {
  if (!origin || whitelist.includes(origin)) return callback(null, true);
  callback(new Error('Not allowed by CORS'));
};

export const corsMiddleware: any = cors({ origin: checkOrigin, credentials: true });
