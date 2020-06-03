import * as dotenv from 'dotenv';
import * as path from 'path';
import {promises as fsPromises} from 'fs';

import {Config} from './config';

const ROOT = path.join(__dirname, '../../');
const SERVICES = 'services';
const KUBERNETES = path.join('packages', 'kubernetes');

const cliArgs = process.argv.slice(2);
const envName = cliArgs[0];
// TODO create .env from template if not exist
const {parsed} = dotenv.config({path: path.join(ROOT, envName ? `.${envName}.env` : `.env`)});

// TODO secrets
function main() {
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
