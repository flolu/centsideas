export interface PersistedEvent {
  id: string;
  streamId: string;
  version: number;
  name: string;
  data: any;
  insertedAt: string;
  sequence: number;
  metadata: any;
}
