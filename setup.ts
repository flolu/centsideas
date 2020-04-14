import * as fs from 'fs';
import * as path from 'path';

const EXAMPLE_ENV_FILE_PATH: string = '.env.template';
const DEVELOPMENT_ENV_FILE_PATH: string = '.env';
const setupEnvFile = async () => {
  try {
    await fs.promises.readFile(DEVELOPMENT_ENV_FILE_PATH);
  } catch (error) {
    const exampleEnvFile = await fs.promises.readFile(EXAMPLE_ENV_FILE_PATH);
    await fs.promises.writeFile(DEVELOPMENT_ENV_FILE_PATH, exampleEnvFile);
  }
  return;
};

const EXAMPLE_K8S_SECRET_FILE_PATH: string = path.join('kubernetes', 'secret.template.yaml');
const DEVELOPMENT_K8S_SECRET_FILE_PATH: string = path.join('kubernetes', 'secret.yaml');
const setupKubernetesSecretFile = async () => {
  try {
    await fs.promises.readFile(DEVELOPMENT_K8S_SECRET_FILE_PATH);
  } catch (error) {
    const exampleEnvFile = await fs.promises.readFile(EXAMPLE_K8S_SECRET_FILE_PATH);
    await fs.promises.writeFile(DEVELOPMENT_K8S_SECRET_FILE_PATH, exampleEnvFile);
  }
  return;
};

const main = async () => {
  await Promise.all([setupEnvFile(), setupKubernetesSecretFile()]);
  return;
};

main();
