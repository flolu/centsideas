export interface HttpRequest<T = any> {
  body: T;
  ip: string;
  method: string;
  path: string;
  url: string;
  cookies: any;
  query: { [key: string]: string };
  params: { [key: string]: string };
  headers: { [key: string]: string | string[] | undefined };
}
