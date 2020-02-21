import { IUserState } from '@cents-ideas/models';

export interface IUsersState {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  user: IUserState | null;
  initialized: boolean;
}
