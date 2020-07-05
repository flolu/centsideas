import {promises as fsPromises} from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

import {Config} from './config';

const BASE_DIR = path.join('env');
const GLOBAL = 'global';
const SERVICES = 'services';
const K8S_CONFIG = '-config';
const SECRETS = 'secrets';
const KUBERNETES = path.join('packages', 'kubernetes');

const environment = process.argv.slice(2)[0];
if (environment === 'template') throw new Error('You cannot name an environment "template"!');

async function main2() {
  await upsertEnvFiles();

  const parsedConfig = parseEnvFile(`.${environment}.config.env`);
  const parsedSecrets = parseEnvFile(`.${environment}.secrets.env`);
  if (!parsedConfig) throw new Error(`Could not find .${environment}.config.env`);
  if (!parsedSecrets) throw new Error(`Could not find .${environment}.secrets.env`);

  /**
   * config
   */
  const services = discoverServices(parsedConfig);
  services.forEach(async service => {
    class ServiceConfig extends Config {
      constructor() {
        super(service, environment);
      }
    }
    const serviceConfig = new ServiceConfig();
    if (service === GLOBAL) await writeK8sConfigFile(service, serviceConfig.config, KUBERNETES);
    else await writeK8sConfigFile(service, serviceConfig.config);
  });

  /**
   * secrets
   */
  class Secrets extends Config {
    constructor() {
      super(SECRETS, environment);
    }
  }
  const {config} = new Secrets();
  await writeK8sSecretFile(config, KUBERNETES);
}

async function upsertEnvFiles() {
  try {
    await fsPromises.access(path.join(BASE_DIR, `.${environment}.secrets.env`));
  } catch (error) {
    const template = await fsPromises.readFile(path.join(BASE_DIR, '.template.secrets.env'));
    await fsPromises.writeFile(path.join(BASE_DIR, `.${environment}.secrets.env`), template);
  }

  /**
   * create env file for docker-compose with all
   * environment variables
   */
  if (environment === 'dev') {
    const devConfig = await fsPromises.readFile(path.join(BASE_DIR, '.dev.config.env'));
    const devSecrets = await fsPromises.readFile(path.join(BASE_DIR, '.dev.secrets.env'));
    await fsPromises.writeFile(
      path.join(BASE_DIR, '.docker-compose.env'),
      devSecrets + '\n'.repeat(3) + devConfig,
    );
  }
}

function parseEnvFile(file: string) {
  return dotenv.config({path: path.join(ROOT, path.join(BASE_DIR, file))}).parsed;
}

const ROOT = path.join(__dirname, '../../');

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

main2();
