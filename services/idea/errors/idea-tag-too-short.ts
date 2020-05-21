import {IdeaTagsLength} from '@centsideas/enums';

export class IdeaTagTooShort extends Error {
  constructor(tag: string) {
    super(`Idea tag ${tag} is too short. Min length is ${IdeaTagsLength.Min}!`);
  }
}
