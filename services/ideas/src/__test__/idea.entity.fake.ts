import { IIdeaState } from '../idea.entity';

export const fakeEventId = '2WEKaVNO';
export const fakeIdeaId = 'PPBqWA9';
export const fakeIdeaTitle = 'This is the Dumbest Idea Ever';
export const fakeIdeaDescription = 'This concept is so hilarious, that no one would ever actually take action on it!';
export const fakeIdeaTitle2 = 'This is the Dumbest Idea Ever #2';
export const fakeIdeaDescription2 =
  'This concept is so hilarious, that no one would ever actually take action on it! #2';
export const fakeIdeaState: IIdeaState = {
  id: fakeIdeaId,
  title: fakeIdeaTitle,
  description: fakeIdeaDescription,
  createdAt: new Date().toISOString(),
  published: false,
  publishedAt: new Date().toISOString(),
  unpublishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deleted: false,
  deletedAt: new Date().toISOString(),
  draft: null,
};
