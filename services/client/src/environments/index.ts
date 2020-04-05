import { prod } from './env.prod';
import { dev } from './env.dev';
import { IEnv } from './env.model';

const isProd = false;

export const env: IEnv = isProd ? prod : dev;
