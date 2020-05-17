import {setupEnv} from '../setup';
import {generateEnv} from '../utils';
import {defaultProdEnv} from '../defaults';

const env = generateEnv(defaultProdEnv);
setupEnv(env);
