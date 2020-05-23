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
