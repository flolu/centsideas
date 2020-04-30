/* tslint:disable:no-console */
import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';
import { config } from 'dotenv';
import * as webpush from 'web-push';

// tslint:disable-next-line:no-var-requires
require('../../misc/register-aliases').registerAliases('../');
config({ path: path.resolve(__dirname, '../../', '.env') });

import environment, { dynamicKeysList, generatableKeyList } from './index';
import { IEnvironment } from './environment.model';
// import { Environments } from '@centsideas/enums';

async function setupTemplateFile(templatePath: string, envFilePath: string) {
  const template = await fs.promises.readFile(templatePath);
  let comment = '';
  if (path.extname(templatePath) === '.ts') {
    comment = `/**\n * This file was automatically generated based of\n * ${templatePath}\n */\n\n`;
  }
  if (path.extname(templatePath) === '.yaml') {
    comment = `# This file was automatically generated based of\n# /${templatePath}\n\n`;
  }
  let envFile = comment + template.toString();

  for (const key in environment) {
    const search = '${' + key + '}';
    const value = environment[key as keyof IEnvironment];
    envFile = envFile.replace(search, value.toString());
  }
  await fs.promises.writeFile(envFilePath, envFile);
}
function generateSecret() {
  return Array(10)
    .fill(null)
    .map(() => Math.random().toString(36).substr(2))
    .join('');
}

async function setupDotEnvFile() {
  const filler = '___';
  let file = `environment=dev\n\n`;

  const vapidKeys = webpush.generateVAPIDKeys();

  // TODO don't delete env vars that have been added to .env??? or maybe do delete them?!

  for (const key of dynamicKeysList) {
    let value = environment[key];
    if (!value || value === filler) {
      if (generatableKeyList.includes(key)) {
        value = generateSecret();
      }
      if (key === 'vapidPublicKey') {
        value = vapidKeys.publicKey;
      }
      if (key === 'vapidPrivateKey') {
        value = vapidKeys.privateKey;
      }
    }
    file += `${key}=${value || filler}\n`;
  }

  await fs.promises.writeFile(path.join(__dirname, '../../', '.env'), file);
}

const main = async () => {
  try {
    await setupDotEnvFile();

    console.log(chalk.greenBright('✔'), chalk.bold(path.join('.env')));

    const clientEnvPath = path.join('services', 'client', 'environment', 'environment.ts');
    await setupTemplateFile(
      path.resolve('services', 'client', 'environment', 'environment.template.ts'),
      clientEnvPath,
    );
    console.log(chalk.greenBright('✔'), chalk.bold(clientEnvPath));

    const adminClientEnvPath = path.join(
      'services',
      'admin-client',
      'environment',
      'environment.ts',
    );
    await setupTemplateFile(
      path.resolve('services', 'admin-client', 'environment', 'environment.template.ts'),
      adminClientEnvPath,
    );
    console.log(chalk.greenBright('✔'), chalk.bold(adminClientEnvPath));

    const k8sConfigPath = path.join('packages', 'kubernetes', 'config.yaml');
    await setupTemplateFile(
      path.join('packages', 'kubernetes', 'config.template.yaml'),
      k8sConfigPath,
    );
    console.log(chalk.greenBright('✔'), chalk.bold(k8sConfigPath));

    const k8sSecretPath = path.join('packages', 'kubernetes', 'secret.yaml');
    await setupTemplateFile(
      path.join('packages', 'kubernetes', 'secret.template.yaml'),
      k8sSecretPath,
    );
    console.log(chalk.greenBright('✔'), chalk.bold(k8sSecretPath));
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log(chalk.red('somethin went wrong while setting up env'));
  }
};

main();
