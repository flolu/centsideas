export interface HttpRequest<Body = any> {
  body: Body;
  ip: string;
  method: string;
  path: string;
  url: string;
  cookies: any;
  params: any;
  query: any;
  headers: any;
  locals: { userId: string | null };
}
