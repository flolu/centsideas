import * as sanitize from 'sanitize-html';

import {IdeaTagsCount, IdeaTagsLength} from '@centsideas/enums';

import * as Errors from './idea.errors';

export class IdeaTags {
  constructor(private tags: string[] = []) {
    if (tags.length > IdeaTagsCount.Max) throw new Errors.TooManyIdeaTags(tags);
    this.tags = this.cleanTags(this.tags);
    tags.forEach(this.validateTag);
  }

  static empty() {
    return new IdeaTags([]);
  }

  static fromArray(tags: string[]) {
    return new IdeaTags(tags);
  }

  add(toAdd: IdeaTags) {
    const updatedTags = [...this.tags, ...toAdd.toArray()];
    const cleaned = this.cleanTags(updatedTags);
    cleaned.forEach(this.validateTag);
    if (cleaned.length > IdeaTagsCount.Max) throw new Errors.TooManyIdeaTags(cleaned);
    this.tags = cleaned;
  }

  remove(toRemove: IdeaTags) {
    const remove = toRemove.toArray();
    this.tags = this.tags.filter(t => !remove.includes(t));
  }

  toArray() {
    return this.tags;
  }

  findDifference(changedTags: IdeaTags) {
    const added = IdeaTags.fromArray(changedTags.tags.filter(t => !this.tags.includes(t)));
    const removed = IdeaTags.fromArray(this.tags.filter(t => !changedTags.tags.includes(t)));
    return {added, removed};
  }

  private cleanTags(tags: string[]) {
    tags = tags.map(t => sanitize(t));
    tags = tags.filter((tag, pos) => tags.indexOf(tag) === pos);
    tags = tags.map(t => t.replace(new RegExp(' ', 'g'), '-'));
    return tags;
  }

  private validateTag(tag: string) {
    if (tag.length > IdeaTagsLength.Max) throw new Errors.IdeaTagTooLong(tag);
    if (tag.length < IdeaTagsLength.Min) throw new Errors.IdeaTagTooShort(tag);
  }
}
