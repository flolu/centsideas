import {IdeaModels} from '@centsideas/models';
import {PersistedEvent} from '@centsideas/event-sourcing2';

interface CreateIdeaCommand {
  userId: string;
}
export interface IdeaCreatedResponse {
  id: string;
}

interface RenameIdeaCommand {
  id: string;
  userId: string;
  title: string;
}

interface EditIdeaDescriptionCommand {
  id: string;
  userId: string;
  description: string;
}

interface UpdateIdeaTagsCommand {
  id: string;
  userId: string;
  tags: string[];
}

interface PublishIdeaCommand {
  id: string;
  userId: string;
}

interface DeleteIdeaCommand {
  id: string;
  userId: string;
}

export interface IdeaCommands {
  create: (payload: CreateIdeaCommand) => Promise<IdeaCreatedResponse>;
  rename: (payload: RenameIdeaCommand) => Promise<void>;
  editDescription: (payload: EditIdeaDescriptionCommand) => Promise<void>;
  updateTags: (payload: UpdateIdeaTagsCommand) => Promise<void>;
  publish: (payload: PublishIdeaCommand) => Promise<void>;
  delete: (payload: DeleteIdeaCommand) => Promise<void>;
}

export interface IdeaDetails {
  getById: (payload: {id: string; userId: string}) => Promise<IdeaModels.IdeaDetailModel>;
}

type GetEvents = (payload: {from: number}) => Promise<{events: PersistedEvent[]}>;

export interface IdeaEventStore {
  getEvents: GetEvents;
}
