// tslint:disable-next-line:no-var-requires
const moduleAlias = require('module-alias');
import * as fs from 'fs';

export const registerAliases = () => {
  const paths: string[] = fs.readdirSync('./packages');
  paths.forEach(addPackageAlias);
};

const addPackageAlias = (name: string) => {
  moduleAlias.addAlias(`@cents-ideas/${name}`, `${__dirname}../../../packages/${name}`);
};
