// TODO sanitize
export class IdeaTags {
  static readonly maxLength = 30;
  static readonly minLength = 2;
  static readonly maxCount = 25;
  static readonly minCount = 0;

  constructor(private tags: string[]) {
    if (tags.length > IdeaTags.maxCount)
      throw new Error(`Too many tags. Max number of tags is ${IdeaTags.maxCount}!`);

    this.tags = this.removeDuplicates(this.tags);
    tags.forEach(this.validateTag);

    if (tags.length < IdeaTags.minCount)
      throw new Error(`Please add at least ${IdeaTags.minCount} tags!`);
  }

  static empty() {
    return new IdeaTags([]);
  }

  static fromArray(tags: string[]) {
    return new IdeaTags(tags);
  }

  add(toAdd: IdeaTags) {
    toAdd.tags.forEach(this.validateTag);
    this.tags = [...this.tags, ...toAdd.tags];
  }

  remove(toRemove: IdeaTags) {
    this.tags = this.tags.filter(toRemove.tags.includes);
  }

  toArray() {
    return this.tags;
  }

  findDifference(changedTags: IdeaTags) {
    const added = IdeaTags.fromArray(changedTags.tags.filter(t => !this.tags.includes(t)));
    const removed = IdeaTags.fromArray(this.tags.filter(t => !changedTags.tags.includes(t)));
    return {added, removed};
  }

  private removeDuplicates(tags: string[]) {
    return tags.filter((tag, pos) => tags.indexOf(tag) === pos);
  }

  private validateTag(tag: string) {
    if (tag.length > IdeaTags.maxLength)
      throw new Error(`Idea tag ${tag} is too long. Max length is ${IdeaTags.maxLength}!`);

    if (tag.length < IdeaTags.minLength)
      throw new Error(`Idea tag ${tag} is too short. Min length is ${IdeaTags.minLength}!`);
  }
}
