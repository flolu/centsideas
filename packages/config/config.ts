import {config} from 'dotenv';

config({path: '.env'});

export abstract class Config {
  private config: Record<string, string> = {};

  private readonly sharedImportsKey = 'shared.imports';
  private readonly sharedExportsKey = 'shared.exports';

  constructor(namespace: string) {
    const internalKeys = this.keysStartingWith(`${namespace}.`);

    const sharedImports: string[] = this.getArrayFromEnv(`${namespace}.${this.sharedImportsKey}`);
    const sharedKeys: string[] = [];
    sharedImports.forEach(name => {
      const exportedKeys = this.getArrayFromEnv(`${name}.${this.sharedExportsKey}`);
      sharedKeys.push(...exportedKeys.map(k => `${name}.${k}`));
    });

    this.setConfig(internalKeys);
    this.setConfig(sharedKeys);
  }

  get(identifier: string, fallback?: string) {
    const value = this.config[identifier] || fallback;
    if (!value) throw new Error(`No value for config ${identifier} found!`);
    return value;
  }

  getArray(identifier: string, fallback?: string[]) {
    const conf = this.config[identifier];
    if (!conf) return fallback || [];
    if (conf.split(' ').length) return conf.split(' ');
    return [conf];
  }

  get identifiers() {
    return Object.keys(this.config);
  }

  private getArrayFromEnv(key: string): string[] {
    const env = process.env[key];
    if (!env) return [];
    if (env.split(' ').length) return env.split(' ');
    return [env];
  }

  private keysStartingWith(searchString: string) {
    return Object.keys(process.env).filter(key => key.startsWith(searchString));
  }

  private setConfig(keys: string[]) {
    keys.forEach(key => {
      const configKey = key;
      if (configKey.includes(this.sharedExportsKey)) return;
      if (configKey.includes(this.sharedImportsKey)) return;

      this.config[configKey] = process.env[key] || '';
    });
  }
}
