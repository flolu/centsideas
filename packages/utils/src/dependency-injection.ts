// FIXME throw appropriate error
import { Container } from 'inversify';

const container = new Container();

export const registerProviders = (...providers: any[]): void => {
  providers.forEach(p => container.bind(p.name).to(p));
};

export const getProvider = (provider): any => container.get(provider.name);
