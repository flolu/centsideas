export interface IIdeasState {
  loading: boolean;
  loaded: boolean;
  error: string;
}

export interface IIdeasFeatureReducerState {
  ideas: IIdeasState;
}

export const featureKey = 'ideas';
