import {promises as fsPromises} from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

import {Config} from './config';

const DOT_ENV_NAME = '.env';
const SERVICES = 'services';
const K8S_CONFIG = '-config';
const GLOBAL = 'global';
const SECRETS = 'secrets';

const ROOT = path.join(__dirname, '../../');
const KUBERNETES = path.join('packages', 'kubernetes');
const DOT_ENV = path.join(ROOT, DOT_ENV_NAME);
const TEMPLATE = path.join(ROOT, `.template${DOT_ENV_NAME}`);

const cliArgs = process.argv.slice(2);
const envName = cliArgs[0];

async function main() {
  await upsertDotEnvFile();
  const {parsed} = dotenv.config({
    path: path.join(ROOT, envName ? `.${envName}${DOT_ENV_NAME}` : DOT_ENV_NAME),
  });
  if (!parsed) return;

  const services = discoverServices(parsed);
  services.forEach(async service => {
    class ServiceConfig extends Config {
      constructor() {
        super(service, envName);
      }
    }
    const config = new ServiceConfig();
    if (service === GLOBAL) await writeK8sConfigFile(service, config.config, KUBERNETES);
    else if (service === SECRETS) await writeK8sSecretFile(config.config, KUBERNETES);
    else await writeK8sConfigFile(service, config.config);
  });
}

async function upsertDotEnvFile() {
  try {
    await fsPromises.access(DOT_ENV);
  } catch (error) {
    const template = await fsPromises.readFile(TEMPLATE);
    await fsPromises.writeFile(DOT_ENV, template);
  }
}

function discoverServices(parsed: dotenv.DotenvParseOptions) {
  const services = Object.keys(parsed)
    .map(k => k.substring(0, k.indexOf('.')))
    .filter(k => !!k);
  return services.filter((k, i) => services.indexOf(k) === i);
}

async function writeK8sConfigFile(
  service: string,
  configs: Record<string, string>,
  directory = path.join(SERVICES, service),
) {
  const file = path.join(ROOT, directory, `${service}${K8S_CONFIG}.yaml`);
  let dataString = '';
  Object.keys(configs).forEach(key => {
    dataString += `  ${key}: "${configs[key]}"\n`;
  });
  const fileContent = generateK8sConfig(`${service}${K8S_CONFIG}`, dataString);
  await fsPromises.writeFile(file, fileContent);
}

async function writeK8sSecretFile(configs: Record<string, string>, directory: string) {
  const file = path.join(ROOT, directory, `${SECRETS}.yaml`);
  let dataString = '';
  Object.keys(configs).forEach(key => {
    dataString += `  ${key}: "${configs[key]}"\n`;
  });
  const fileContent = generateK8sSecret(SECRETS, dataString);
  await fsPromises.writeFile(file, fileContent);
}

function generateK8sConfig(name: string, data: string) {
  return `apiVersion: v1
kind: ConfigMap
metadata:
  name: ${name}
data:
${data}`;
}

function generateK8sSecret(name: string, data: string) {
  return `apiVersion: v1
kind: Secret
metadata:
  name: ${name}
type: Opaque
stringData:
${data}
`;
}

main();
