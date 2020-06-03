import {Id} from '@centsideas/types';

import {PersistedSnapshot} from './snapshot';

export interface SnapshotStore {
  get(id: Id): Promise<PersistedSnapshot | undefined>;
  store(snapshot: PersistedSnapshot): Promise<void>;
}

export interface SnapshotStoreFactoryOptions {
  url: string;
  name: string;
}
