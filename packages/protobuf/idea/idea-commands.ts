import * as grpc from '@grpc/grpc-js';

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

export interface IIdeaCommands {
  create: (payload: ICreateIdeaCommand, callback: grpc.requestCallback<IIdeaState>) => void;
  update: (payload: IUpdateIdeaCommand, callback: grpc.requestCallback<IIdeaState>) => void;
  delete: (payload: IDeleteIdeaCommand, callback: grpc.requestCallback<IIdeaState>) => void;
}
