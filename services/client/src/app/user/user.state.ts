import { IUserReducerState } from './user.reducer';
import { IAuthReducerState } from './auth.reducer';

export interface IUserFeatureReducerState {
  user: IUserReducerState;
  auth: IAuthReducerState;
}

export const featureKey = 'user';
