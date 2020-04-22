import { NotificationMedium } from '@centsideas/enums';

export interface INotificationCreatedEvent {
  notificationId: string;
  receiverUserId: string | null;
  inResponseTo: IInResponseTo;
  medium: NotificationMedium;
}

export interface INotificationSentEvent {}

export interface IInResponseTo {
  eventId: string;
  eventName: string;
  topic: string;
}
