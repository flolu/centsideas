import {ReviewModels} from '@centsideas/models';

export interface GetByIdeaId {
  ideaId: string;
}

export interface GetByAuthor {
  authorId: string;
}

export interface GetByAuthorAndIdea {
  authorId: string;
  ideaId: string;
}

export interface Service {
  getByIdeaId: (payload: GetByIdeaId) => Promise<ReviewModels.ReviewModel[]>;
  getByAuthroAndIdea: (payload: GetByAuthorAndIdea) => Promise<ReviewModels.ReviewModel | null>;
  getByAuthor: (payload: GetByAuthor) => Promise<ReviewModels.ReviewModel[]>;
}
