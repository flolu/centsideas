import * as fs from 'fs';

const EXAMPLE_ENV_FILE_PATH: string = '.env.example';
const DEVELOPMENT_ENV_FILE_PATH: string = '.env';

const setupEnvFile = async () => {
  try {
    await fs.promises.readFile(DEVELOPMENT_ENV_FILE_PATH);
  } catch (error) {
    const exampleEnvFile = await fs.promises.readFile(EXAMPLE_ENV_FILE_PATH);
    await fs.promises.writeFile(DEVELOPMENT_ENV_FILE_PATH, exampleEnvFile);
  }
};

setupEnvFile();
