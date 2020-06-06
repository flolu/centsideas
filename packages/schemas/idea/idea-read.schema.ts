import {IdeaModels} from '@centsideas/models';

export interface GetBydId {
  id: string;
  userId: string;
}

export interface GetUnpublished {
  userId: string;
}

export interface Service {
  getById: (payload: GetBydId) => Promise<IdeaModels.IdeaModel>;
  getAll: (payload: void) => Promise<{ideas: IdeaModels.IdeaModel[]}>;
  getUnpublished: (payload: GetUnpublished) => Promise<IdeaModels.IdeaModel>;
}
