export interface PersistedEvent<T = object> {
  id: string;
  streamId: string;
  version: number;
  name: string;
  data: T;
  insertedAt: string;
  sequence: number;
}
