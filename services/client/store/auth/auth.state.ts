import {IUserState} from '@centsideas/models';
import {LoadStatus} from '@cic/shared';

export interface IAuthReducerState {
  user: IUserState | null;
  error: string;
  accessToken: string;
  status: LoadStatus;
}
