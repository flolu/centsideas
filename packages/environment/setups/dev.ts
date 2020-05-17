import {setupEnv} from '../setup';
import {generateEnv} from '../utils';
import {defaultDevEnv} from '../defaults';

// FIXME would be gorgous to handle this with bazel (to prevent unnecessary reprocessing)
const env = generateEnv(defaultDevEnv);
setupEnv(env);
