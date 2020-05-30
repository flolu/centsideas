/* tslint:disable:no-console */

// tslint:disable-next-line:no-var-requires
require('../../misc/register-aliases').registerAliases('../');

import {config} from 'dotenv';
import * as chalk from 'chalk';

import {IEnvironment} from './environment.model';
import {setupDotEnvFile, setupTemplateFile} from './utils';
import {templatePaths, genPaths, dotenvFilePath} from './paths';

config({path: dotenvFilePath});

export async function setupEnv(environment: IEnvironment) {
  try {
    await setupDotEnvFile(environment);

    console.log(chalk.greenBright('✔'), chalk.bold(dotenvFilePath));

    await setupTemplateFile(templatePaths.k8sConfig, genPaths.k8sConfig, environment);
    console.log(chalk.greenBright('✔'), chalk.bold(genPaths.k8sConfig));

    await setupTemplateFile(templatePaths.k8sSecret, genPaths.k8sSecret, environment);
    console.log(chalk.greenBright('✔'), chalk.bold(genPaths.k8sSecret));
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log(chalk.red('somethin went wrong while setting up env'));
  }
}
