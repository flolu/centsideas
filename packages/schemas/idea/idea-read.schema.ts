import {IdeaModels} from '@centsideas/models';

export interface GetBydId {
  id: string;
  userId: string;
}

export interface GetUnpublished {
  userId: string;
}

export interface GetAllByUserId {
  userId: string;
  privates: boolean;
}

export interface Service {
  getById: (payload: GetBydId) => Promise<IdeaModels.IdeaModel>;
  getAll: (payload: void) => Promise<{ideas: IdeaModels.IdeaModel[]}>;
  getAllByUserId: (payload: GetAllByUserId) => Promise<{ideas: IdeaModels.IdeaModel[]}>;
  getUnpublished: (payload: GetUnpublished) => Promise<IdeaModels.IdeaModel>;
}
