import {PersistedEvent} from '@centsideas/models';

import {GetEventsCommand} from '../common';

export interface CreateIdea {
  userId: string;
}

export interface RenameIdea {
  id: string;
  userId: string;
  title: string;
}

export interface EditIdeaDescription {
  id: string;
  userId: string;
  description: string;
}

export interface UpdateIdeaTags {
  id: string;
  userId: string;
  tags: string[];
}

export interface PublishIdea {
  id: string;
  userId: string;
}

export interface DeleteIdea {
  id: string;
  userId: string;
}

export interface IdeaCreatedResponse {
  id: string;
}

export interface GetByUserId {
  userId: string;
}

export interface Service {
  create: (payload: CreateIdea) => Promise<IdeaCreatedResponse>;
  rename: (payload: RenameIdea) => Promise<void>;
  editDescription: (payload: EditIdeaDescription) => Promise<void>;
  updateTags: (payload: UpdateIdeaTags) => Promise<void>;
  publish: (payload: PublishIdea) => Promise<void>;
  delete: (payload: DeleteIdea) => Promise<void>;
  getEventsByUserId: (payload: GetByUserId) => Promise<{events: PersistedEvent[]}>;

  getEvents: GetEventsCommand;
}
