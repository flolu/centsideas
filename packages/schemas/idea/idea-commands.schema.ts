import {PersistedEvent} from '@centsideas/models';

interface CreateIdeaCommand {
  userId: string;
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

export interface IdeaCreatedResponse {
  id: string;
}

export interface IdeaCommands {
  create: (payload: CreateIdeaCommand) => Promise<IdeaCreatedResponse>;
  rename: (payload: RenameIdeaCommand) => Promise<void>;
  editDescription: (payload: EditIdeaDescriptionCommand) => Promise<void>;
  updateTags: (payload: UpdateIdeaTagsCommand) => Promise<void>;
  publish: (payload: PublishIdeaCommand) => Promise<void>;
  delete: (payload: DeleteIdeaCommand) => Promise<void>;

  getEvents: (payload: {from: number}) => Promise<{events: PersistedEvent[]}>;
}
