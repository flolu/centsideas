import * as dotenv from 'dotenv';

export abstract class Config {
  config: Record<string, string> = {};
  private parsed: Record<string, string> = {};

  private readonly sharedImportsKey = 'shared.imports';
  private readonly sharedExportsKey = 'shared.exports';

  constructor(namespace: string, dotenvName?: string) {
    const {parsed} = dotenv.config({path: dotenvName ? `.${dotenvName}.env` : '.env'});
    this.parsed = parsed || {};

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
    const value = this.config[identifier] || this.getEnvVar(identifier) || fallback;
    if (!value) throw new Error(`No value for config ${identifier} found!`);
    return value;
  }

  getNumber(identifier: string, fallback?: string) {
    const value = this.get(identifier, fallback);
    return Number(value);
  }

  getArray(identifier: string, fallback?: string[]) {
    const value = this.get(identifier);
    if (!value) return fallback || [];
    if (value.split(';').length) return value.split(';');
    return [value];
  }

  get identifiers() {
    return Object.keys(this.config);
  }

  private getArrayFromEnv(key: string): string[] {
    const env = this.getEnvVar(key);
    if (!env) return [];
    if (env.split(' ').length) return env.split(' ');
    return [env];
  }

  private keysStartingWith(searchString: string) {
    const all = [
      ...Object.keys(this.parsed).filter(key => key.startsWith(searchString)),
      ...Object.keys(process.env).filter(key => key.startsWith(searchString)),
    ];
    return all.filter((key, index) => all.indexOf(key) === index);
  }

  private setConfig(keys: string[]) {
    keys.forEach(key => {
      const configKey = key;
      if (configKey.includes(this.sharedExportsKey)) return;
      if (configKey.includes(this.sharedImportsKey)) return;

      this.config[configKey] = this.getEnvVar(key);
    });
  }

  private getEnvVar(key: string) {
    return this.parsed[key] || process.env[key] || '';
  }
}
