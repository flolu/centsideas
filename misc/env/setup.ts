import * as fs from 'fs';
import * as path from 'path';

async function setupEnvFile(templatePath: string, envFilePath: string) {
  try {
    await fs.promises.readFile(envFilePath);
  } catch (_error) {
    const template = await fs.promises.readFile(templatePath);
    await fs.promises.writeFile(envFilePath, template);
  }
}

// TODO also handle envsub in this script instead of having many cluttery npm scripts

const main = async () => {
  await setupEnvFile(path.join('misc', 'env', '.env.dev.template'), path.join('.env.dev'));
  await setupEnvFile(path.join('misc', 'env', '.env.prod.template'), path.join('.env.prod'));
  await setupEnvFile(
    path.join('misc', 'env', '.env.microk8s.template'),
    path.join('.env.microk8s'),
  );
  return;
};

main();
