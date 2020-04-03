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
