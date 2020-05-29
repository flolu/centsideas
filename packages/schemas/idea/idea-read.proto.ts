import {IdeaModels} from '@centsideas/models';

export interface IdeaRead {
  getById: (payload: {id: string; userId: string}) => Promise<IdeaModels.IdeaModel>;
  getAll: (payload: void) => Promise<{ideas: IdeaModels.IdeaModel[]}>;
}
