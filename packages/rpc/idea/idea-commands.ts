import { IIdeaState } from '@centsideas/models';

interface ICreateIdeaCommand {
  title: string;
  description: string;
  userId: string;
}

interface IUpdateIdeaCommand {
  title: string;
  description: string;
  userId: string;
  ideaId: string;
}

interface IDeleteIdeaCommand {
  userId: string;
  ideaId: string;
}

export type CreateIdea = (payload: ICreateIdeaCommand) => Promise<IIdeaState>;
export type UpdateIdea = (payload: IUpdateIdeaCommand) => Promise<IIdeaState>;
export type DeleteIdea = (payload: IDeleteIdeaCommand) => Promise<IIdeaState>;

export interface IIdeaCommands {
  create: CreateIdea;
  update: UpdateIdea;
  delete: DeleteIdea;
}
