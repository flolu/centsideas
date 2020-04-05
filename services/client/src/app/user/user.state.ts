import { IUserReducerState } from './user.reducer';

export interface IUserFeatureReducerState {
  user: IUserReducerState;
}

export const featureKey = 'user';
