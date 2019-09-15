import { Container } from 'inversify';

const container = new Container();

export const registerProviders = (...providers: any[]): void => {
  providers.forEach(p => {
    if (!(p && p.name)) {
      throw new Error(`Provider: ${p} could not be registered`);
    }
    container.bind(p.name).to(p);
  });
};

export const getProvider = (provider: any): any => container.get(provider.name);
