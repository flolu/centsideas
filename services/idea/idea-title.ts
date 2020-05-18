// TODO interface for serializable value
// TODO sanitize
export class IdeaTitle {
  // TODO share with frontend for form validation (either share whole class or only move values to shared package)
  static readonly maxLength = 100;
  static readonly minLength = 3;

  constructor(private readonly title: string) {
    // TODO create dedicated error(s)
    if (this.title.length > IdeaTitle.maxLength)
      throw new Error(`Idea title too long. Max length is ${IdeaTitle.maxLength}!`);

    if (this.title.length < IdeaTitle.minLength)
      throw new Error(`Idea title too short. Min length is ${IdeaTitle.minLength}!`);
  }

  toString() {
    return this.title;
  }
}
