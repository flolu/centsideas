import { Container } from 'inversify';

const container = new Container();

export const registerProviders = (...providers: any[]): void => {
  providers.forEach(p => {
    if (!p) {
      throw new Error(`Provider: ${p} could not be registered`);
    }
    container.bind(p).to(p);
  });
};

export const getProvider = (provider: any): any => container.get(provider);

export const overrideProvider = (provider: any, newProvider: any) => {
  container.unbind(provider);
  container.bind(provider).to(newProvider);
};
