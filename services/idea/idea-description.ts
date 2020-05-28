import * as sanitize from 'sanitize-html';

import {IdeaDescriptionLength} from '@centsideas/enums';

import * as Errors from './idea.errors';

export class IdeaDescription {
  static readonly maxLength = IdeaDescriptionLength.Max;

  private constructor(private readonly description: string) {
    this.description = sanitize(this.description);
    if (this.description.length > IdeaDescription.maxLength)
      throw new Errors.IdeaDescriptionTooLong(description);
  }

  static empty() {
    return new IdeaDescription('');
  }

  static fromString(description: string) {
    return new IdeaDescription(description);
  }

  toString() {
    return this.description;
  }
}
