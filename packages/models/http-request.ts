// TODO i would prefer a solution that is less ugly!
export interface HttpRequest<Body = any, Params = any, Query = any, Headers = any> {
  body: Body;
  ip: string;
  method: string;
  path: string;
  url: string;
  cookies: any;
  params: Params;
  query: Query;
  headers: Headers;
  locals: { userId: string | null };
}
