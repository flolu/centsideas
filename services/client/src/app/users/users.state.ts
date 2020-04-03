import { IUserState } from '@cents-ideas/models';

export interface IAuthState {
  loading: boolean;
  loaded: boolean;
  error: string;
  user: IUserState | null;
  initialized: boolean;
}
