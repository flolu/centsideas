import { Container } from 'inversify';

/**
 * `skipBaseClassChecks: true`
 * https://github.com/inversify/InversifyJS/blob/master/wiki/inheritance.md#workaround-e-skip-base-class-injectable-checks
 * is needed because of the abstract `EventRepository` class
 */
const container = new Container({ skipBaseClassChecks: true });

export const registerProviders = (...providers: any[]) =>
  providers.forEach(p => container.bind(p).toSelf());

export const getProvider = (provider: any): any => container.get(provider);

export const overrideProvider = (provider: any, newProvider: any) => {
  container.unbind(provider);
  container.bind(provider).to(newProvider);
};

export const getContainer = () => container;
