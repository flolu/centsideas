export interface HttpResponse<T = any> {
  body: T;
  status: number;
  headers: Record<string, string>;
}
