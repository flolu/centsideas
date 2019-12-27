import { HttpRequest } from '../http-request';

export const makeFakeHttpRequest = (overrides: Partial<HttpRequest> = {}): HttpRequest => ({
  body: {},
  ip: '',
  method: '',
  path: '',
  url: '',
  cookies: {},
  params: {},
  query: {},
  headers: {},
  ...overrides,
});