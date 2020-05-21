import {IdeaTagsLength} from '@centsideas/enums';

export class IdeaTagTooLong extends Error {
  constructor(tag: string) {
    super(`Idea tag ${tag} is too long. Max length is ${IdeaTagsLength.Max}!`);
  }
}
