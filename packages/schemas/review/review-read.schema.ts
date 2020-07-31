import {ReviewModels} from '@centsideas/models';

export interface GetByIdeaId {
  ideaId: string;
  auid?: string;
}

export interface GetByAuthor {
  authorId: string;
  auid?: string;
}

export interface GetByAuthorAndIdea {
  ideaId: string;
  auid: string;
}

export interface Service {
  getByIdeaId: (payload: GetByIdeaId) => Promise<ReviewModels.ReviewModel[]>;
  getByAuthorAndIdea: (payload: GetByAuthorAndIdea) => Promise<ReviewModels.ReviewModel | null>;
  getByAuthor: (payload: GetByAuthor) => Promise<ReviewModels.ReviewModel[]>;
}
