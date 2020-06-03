import {injectable, interfaces} from 'inversify';

import {Id} from '@centsideas/types';

import {SnapshotStore} from './snapshot-store';
import {PersistedSnapshot} from './snapshot';

@injectable()
export class InMemorySnapshotStore implements SnapshotStore {
  private snapshots: Record<string, PersistedSnapshot> = {};

  async store(snapshot: PersistedSnapshot) {
    this.snapshots[snapshot.aggregateId.toString()] = snapshot;
  }

  async get(id: Id) {
    return this.snapshots[id.toString()];
  }
}

export const inMemorySnapshotStoreFactory = (context: interfaces.Context) => () =>
  context.container.get(InMemorySnapshotStore);
