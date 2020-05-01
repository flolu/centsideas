import { Container } from 'inversify';

// TODO fancier inversify usage!?

/**
 * `skipBaseClassChecks: true`
 * https://github.com/inversify/InversifyJS/blob/master/wiki/inheritance.md#workaround-e-skip-base-class-injectable-checks
 * is needed because of the abstract `EventRepository` class
 */
const container = new Container({ skipBaseClassChecks: true });

export const registerProviders = (...providers: any[]): void => {
  providers.forEach(p => {
    if (!p) {
      throw new Error(`Provider: ${p} could not be registered`);
    }
    container.bind(p).to(p);
  });
};
export const getProvider = (provider: any): any => {
  return container.get(provider);
};

export const overrideProvider = (provider: any, newProvider: any) => {
  container.unbind(provider);
  container.bind(provider).to(newProvider);
};
