import {PersistedEvent, ReviewModels} from '@centsideas/models';

import {GetEventsCommand} from '../common';

export interface Create {
  userId: string;
  ideaId: string;
}

export interface EditContent {
  id: string;
  userId: string;
  content: string;
}

export interface ChangeScore {
  id: string;
  userId: string;
  score: ReviewModels.Score;
}

export interface Publish {
  id: string;
  userId: string;
}

export interface GetByUserId {
  userId: string;
}

export interface Service {
  create: (payload: Create) => Promise<{id: string}>;
  editContent: (payload: EditContent) => Promise<void>;
  changeScore: (payload: ChangeScore) => Promise<void>;
  publish: (payload: Publish) => Promise<void>;
  getEventsByUserId: (payload: GetByUserId) => Promise<{events: PersistedEvent[]}>;

  getEvents: GetEventsCommand;
}
