import { IAuthReducerState } from '../auth/auth.reducer';

export interface IAuthFeatureReducerState {
  auth: IAuthReducerState;
}

export const featureKey = 'auth';
