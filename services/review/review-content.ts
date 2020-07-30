import * as sanitize from 'sanitize-html';

import {ReviewContentLength} from '@centsideas/enums';

import * as Errors from './review.errors';

export class ReviewContent {
  private constructor(private content: string) {
    this.content = sanitize(this.content);
    if (this.content.length > ReviewContentLength.Max) throw new Errors.ReviewTooLong(content);
    if (this.content.length < ReviewContentLength.Min) throw new Errors.ReviewTooShort(content);
  }

  static fromString(content: string) {
    return new ReviewContent(content);
  }

  toString() {
    return this.content;
  }

  equals(other: ReviewContent) {
    return this.toString() === other.toString();
  }
}
