import {IMeReducerState} from './me/me.state';
import {INotificationsReducerState} from './notifications/notifications.state';

export interface IUserFeatureReducerState {
  me: IMeReducerState;
  notifications: INotificationsReducerState;
}
