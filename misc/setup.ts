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

const main = async () => {
  await setupEnvFile(path.join('misc', '.env.dev.template'), path.join('.env.dev'));
  await setupEnvFile(path.join('misc', '.env.prod.template'), path.join('.env.prod'));
  return;
};

main();
