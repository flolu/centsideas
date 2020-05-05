import { Container, interfaces } from 'inversify';

/**
 * `skipBaseClassChecks: true`
 * https://github.com/inversify/InversifyJS/blob/master/wiki/inheritance.md#workaround-e-skip-base-class-injectable-checks
 * is needed because of the abstract `EventRepository` class
 */
const container = new Container({ skipBaseClassChecks: true });

// TODO dont export all methods individually instead expose one api

export const registerProviders = (...providers: any[]) =>
  providers.forEach(p => container.bind(p).toSelf());

export const registerFactory = (identifier: any, factory: (context: interfaces.Context) => any) =>
  container.bind(identifier).toFactory(factory);

export const registerConstant = (identifier: any, constant: any) =>
  container.bind(identifier).toConstantValue(constant);

export const getProvider = (provider: any): any => container.get(provider);

export const overrideProvider = (provider: any, newProvider: any) => {
  container.unbind(provider);
  container.bind(provider).to(newProvider);
};

export const getContainer = () => container;
