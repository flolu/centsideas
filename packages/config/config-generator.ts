import * as dotenv from 'dotenv';
import * as path from 'path';
import {promises as fsPromises} from 'fs';

import {Config} from './config';

const ROOT = path.join(__dirname, '../../');
const DOT_ENV_NAME = '.env';
const SERVICES = 'services';
const KUBERNETES = path.join('packages', 'kubernetes');
const DOT_ENV = path.join(ROOT, DOT_ENV_NAME);
const TEMPLATE = path.join(ROOT, `.template${DOT_ENV_NAME}`);

const cliArgs = process.argv.slice(2);
const envName = cliArgs[0];
const {parsed} = dotenv.config({
  path: path.join(ROOT, envName ? `.${envName}${DOT_ENV_NAME}` : DOT_ENV_NAME),
});

// TODO secrets
async function main() {
  try {
    await fsPromises.access(DOT_ENV);
  } catch (error) {
    const template = await fsPromises.readFile(TEMPLATE);
    await fsPromises.writeFile(DOT_ENV, template);
  }

  if (!parsed) return;
  let services = Object.keys(parsed)
    .map(k => k.substring(0, k.indexOf('.')))
    .filter(k => !!k);
  services = services.filter((k, i) => services.indexOf(k) === i);

  services.forEach(async service => {
    class ServiceConfig extends Config {
      constructor() {
        super(service, envName);
      }
    }
    const config = new ServiceConfig();
    if (service === 'global') await writeK8sConfigFile(service, config.config, KUBERNETES);
    else await writeK8sConfigFile(service, config.config);
  });
}
async function writeK8sConfigFile(
  service: string,
  configs: Record<string, string>,
  directory = path.join(SERVICES, service),
) {
  const file = path.join(ROOT, directory, `${service}-config.yaml`);
  let dataString = '';
  Object.keys(configs).forEach(key => {
    dataString += `  ${key}: "${configs[key]}"\n`;
  });
  const fileContent = generateK8sConfig(`${service}-config`, dataString);

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

main();
