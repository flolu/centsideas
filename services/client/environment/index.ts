import { InjectionToken } from '@angular/core';

export interface IClientEnvironment {
  gatewayUrl: string;
  vapidPublicKey: string;
}

export const ENVIRONMENT = new InjectionToken<IClientEnvironment>('CLIENT_ENVIRONMENT');

export * from './environment';
