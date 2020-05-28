import * as sanitize from 'sanitize-html';

import {IdeaTitleLength} from '@centsideas/enums';

import * as Errors from './idea.errors';

export class IdeaTitle {
  private constructor(private title: string) {
    this.title = sanitize(this.title);
    if (this.title.length > IdeaTitleLength.Max) throw new Errors.IdeaTitleTooLong(title);
    if (this.title.length < IdeaTitleLength.Min) throw new Errors.IdeaTitleTooShort(title);
  }

  static fromString(title: string) {
    return new IdeaTitle(title);
  }

  toString() {
    return this.title;
  }
}
