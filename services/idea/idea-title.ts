import * as sanitize from 'sanitize-html';

import {IdeaTitleLength} from '@centsideas/enums';

import {IdeaTitleTooShort} from './errors/idea-title-too-short';
import {IdeaTitleTooLong} from './errors/idea-title-too-long';

export class IdeaTitle {
  private constructor(private title: string) {
    this.title = sanitize(this.title);
    if (this.title.length > IdeaTitleLength.Max) throw new IdeaTitleTooLong();
    if (this.title.length < IdeaTitleLength.Min) throw new IdeaTitleTooShort();
  }

  static fromString(title: string) {
    return new IdeaTitle(title);
  }

  toString() {
    return this.title;
  }
}
