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

// TODO maybe don't declare serperately, but instead just anonymously on interface
type CreateIdea = (payload: CreateIdeaCommand) => Promise<IdeaCreatedResponse>;
type RenameIdea = (payload: RenameIdeaCommand) => Promise<void>;
type EditIdeaDescription = (payload: EditIdeaDescriptionCommand) => Promise<void>;
type UpdateIdeaTags = (payload: UpdateIdeaTagsCommand) => Promise<void>;
type PublishIdea = (payload: PublishIdeaCommand) => Promise<void>;
type DeleteIdea = (payload: DeleteIdeaCommand) => Promise<void>;

export interface IdeaCommands {
  create: CreateIdea;
  rename: RenameIdea;
  editDescription: EditIdeaDescription;
  updateTags: UpdateIdeaTags;
  publish: PublishIdea;
  delete: DeleteIdea;
}

type GetIdeaById = (payload: {id: string}) => Promise<IdeaModels.IdeaDetailModel>;

export interface IdeaDetails {
  getById: GetIdeaById;
}

type GetEvents = (payload: {from: number}) => Promise<{events: PersistedEvent[]}>;

export interface IdeaEventStore {
  getEvents: GetEvents;
}
