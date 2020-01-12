export interface HttpResponse<T = any> {
  body: T;
  status: number;
  headers: { [key: string]: string };
}
