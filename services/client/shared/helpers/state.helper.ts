export const LOADING_DONE = {
  loading: false,
  loaded: true,
  error: '',
};

export const LOADING = {
  loading: true,
  loaded: false,
  error: '',
};

export const LOADING_FAIL = (error: string) => ({ loading: false, loaded: false, error });

export interface ILoadingState {
  loading: boolean;
  loaded: boolean;
  error: string;
}

export const initialLoadingState: ILoadingState = { loading: false, loaded: false, error: '' };

// TODO consider ordering them so that we can compare e.g. if (status >= Status.Loaded)
export enum Status {
  Error = -1,
  None = 0,
  Loading = 1,
  Loaded = 2,
  Syncing = 3,
  PatchSyncing = 4,
  Synced = 5,
}
