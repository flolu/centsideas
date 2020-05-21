import {IdeaTagsCount} from '@centsideas/enums/idea-tags.enum';

export class TooManyIdeaTags extends Error {
  constructor() {
    super(`Too many tags. Max number of tags is ${IdeaTagsCount.Max}!`);
  }
}
