import {GetEventsCommand} from '../common';

export interface RenameUser {
  userId: string;
  username: string;
}

export interface RequestDeletion {
  userId: string;
}

export interface ConfirmDeletion {
  token: string;
}

export interface RequestEmailChange {
  userId: string;
  newEmail: string;
}

export interface ConfirmEmailChange {
  token: string;
}

export interface Service {
  rename: (payload: RenameUser) => Promise<void>;
  requestDeletion: (payload: RequestDeletion) => Promise<void>;
  confirmDeletion: (payload: ConfirmDeletion) => Promise<void>;
  requestEmailChange: (payload: RequestEmailChange) => Promise<void>;
  confirmEmailChange: (payload: ConfirmEmailChange) => Promise<void>;

  getEvents: GetEventsCommand;
  getPrivateEvents: GetEventsCommand;
}
