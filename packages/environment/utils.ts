/* tslint:disable:no-console */

import * as webpush from 'web-push';
import * as fs from 'fs';
import * as path from 'path';

import { IEnvironment } from './environment.model';
import { dynamicKeysList, generatableKeyList } from './keys';
import { genPaths, dotenvFilePath } from './paths';
import chalk = require('chalk');

const filler = '___';

async function setupTemplateFile(
  templatePath: string,
  envFilePath: string,
  environment: IEnvironment,
) {
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
    while (envFile.includes(search)) {
      const value = environment[key as keyof IEnvironment];
      envFile = envFile.replace(search, value.toString() || filler);
    }
  }
  await fs.promises.writeFile(envFilePath, envFile);
}

async function setupDotEnvFile(environment: IEnvironment) {
  // let file = `environment=${environment.environment}\n\n`;
  let file = '';
  const vapidKeys = webpush.generateVAPIDKeys();

  for (const key of dynamicKeysList) {
    let value = environment[key];

    if (!value || value === filler) {
      if (generatableKeyList.includes(key)) value = generateSecret();
      if (key === 'vapidPublicKey') value = vapidKeys.publicKey;
      if (key === 'vapidPrivateKey') value = vapidKeys.privateKey;
    }

    file += `${key}=${value || filler}\n`;
  }

  await fs.promises.writeFile(dotenvFilePath, file);
}

function generateSecret() {
  return Array(10)
    .fill(null)
    .map(() => Math.random().toString(36).substr(2))
    .join('');
}

function generateEnv(defaultEnv: IEnvironment) {
  const env: IEnvironment = { ...defaultEnv };

  for (const key in defaultEnv) {
    // @ts-ignore
    if (typeof process === 'undefined') break;

    // @ts-ignore
    const envVar = process.env[key];
    if (envVar) (env as any)[key] = envVar;
  }

  return env;
}

function removeGeneratedFiles() {
  for (const key in genPaths) {
    const pathToDelete: string = (genPaths as Record<string, string>)[key];
    if (fs.existsSync(pathToDelete)) {
      fs.unlinkSync(pathToDelete);
      console.log(chalk.redBright('-'), chalk.bold(pathToDelete));
    }
  }
}

export { setupTemplateFile, setupDotEnvFile, generateEnv, removeGeneratedFiles };
