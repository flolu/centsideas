// tslint:disable-next-line:no-var-requires
const moduleAlias = require('module-alias');
import * as fs from 'fs';
import * as path from 'path';

export const registerAliases = (rootDir: string = '') => {
  const paths: string[] = fs.readdirSync(path.join('packages'));
  paths.forEach(name =>
    moduleAlias.addAlias(`@centsideas/${name}`, path.join(__dirname, rootDir, 'packages', name)),
  );
};
