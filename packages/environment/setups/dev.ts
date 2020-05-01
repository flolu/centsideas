import { setupEnv } from '../setup';
import { generateEnv } from '../utils';
import { defaultDevEnv } from '../defaults';

const env = generateEnv(defaultDevEnv);
setupEnv(env);
