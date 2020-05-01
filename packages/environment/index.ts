import { Environments } from '@centsideas/enums';
import { generateEnv } from './utils';
import { defaultProdEnv, defaultStagingEnv, defaultDevEnv } from './defaults';

export * from './global.environment';

let defaults = defaultDevEnv;
if (process.env.environment === Environments.Staging) defaults = defaultStagingEnv;
if (process.env.environment === Environments.Prod) defaults = defaultProdEnv;

const environment = generateEnv(defaults);
export default environment;
