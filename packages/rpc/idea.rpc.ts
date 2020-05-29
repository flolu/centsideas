import {IdeaModels, PersistedEvent} from '@centsideas/models';

import {loadService} from './util';

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
  getById: (payload: {id: string; userId: string}) => Promise<IdeaModels.IdeaModel>;
  getAll: (payload: void) => Promise<{ideas: IdeaModels.IdeaModel[]}>;
}

export interface IdeaEventStore {
  getEvents: (payload: {from: number}) => Promise<{events: PersistedEvent[]}>;
}

const ideaProtoFileName = 'idea';
export const ideaRpcServices = {
  eventStoreService: loadService(ideaProtoFileName, 'IdeaEventStore'),
  commandService: loadService(ideaProtoFileName, 'IdeaCommands'),
};
