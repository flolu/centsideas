import * as grpc from '@grpc/grpc-js';

import { IIdeaViewModel } from '@centsideas/models';

interface IIdeaByIdQuery {
  id: string;
}

interface IIdeaViewList {
  ideas: IIdeaViewModel[];
}

export interface IIdeaQueries {
  getAll: (payload: undefined, callback: grpc.requestCallback<IIdeaViewList>) => void;
  getById: (payload: IIdeaByIdQuery, callback: grpc.requestCallback<IIdeaViewModel>) => void;
}

export interface IIdeaQueriesImplementation {
  getAll: grpc.handleUnaryCall<IIdeaByIdQuery, IIdeaViewList>;
  getById: grpc.handleUnaryCall<IIdeaByIdQuery, IIdeaViewModel>;
}
