export interface PersistedEvent {
  id: string;
  streamId: string;
  version: number;
  name: string;
  data: object;
  insertedAt: string;
  sequence: number;
}
