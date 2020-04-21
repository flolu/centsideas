import { IUserReducerState } from './user.reducer';
import { INotificationsReducerState } from './notifications/notifications.reducer';

export interface IUserFeatureReducerState {
  user: IUserReducerState;
  notifications: INotificationsReducerState;
}

export interface IUserForm {
  username: string;
  email: string;
}
