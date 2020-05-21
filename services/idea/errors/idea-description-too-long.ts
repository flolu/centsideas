import {IdeaDescriptionLength} from '@centsideas/enums';

export class IdeaDescriptionTooLong extends Error {
  constructor() {
    super(`Idea description too long. Max length is ${IdeaDescriptionLength.Max}!`);
  }
}
