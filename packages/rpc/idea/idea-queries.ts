import {IIdeaViewModel} from '@centsideas/models';

interface IIdeaByIdQuery {
  id: string;
}

interface IIdeaViewList {
  ideas: IIdeaViewModel[];
}

export type GetAllIdeas = (payload: undefined) => Promise<IIdeaViewList>;
export type GetIdeaById = (payload: IIdeaByIdQuery) => Promise<IIdeaViewModel>;

export interface IIdeaQueries {
  getAll: GetAllIdeas;
  getById: GetIdeaById;
}
