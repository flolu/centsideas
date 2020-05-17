import {setupEnv} from '../setup';
import {generateEnv} from '../utils';
import {defaultStagingEnv} from '../defaults';

const env = generateEnv(defaultStagingEnv);
setupEnv(env);
