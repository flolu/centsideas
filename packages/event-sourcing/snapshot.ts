export interface PersistedSnapshot<T = any> {
  aggregateId: string;
  version: number;
  data: T;
}
