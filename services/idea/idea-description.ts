// TODO sanitize
export class IdeaDescription {
  static readonly maxLength = 3000;

  private constructor(private readonly description: string) {
    if (this.description.length > IdeaDescription.maxLength)
      throw new Error(`Idea description too long. Max length is ${IdeaDescription.maxLength}!`);
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
