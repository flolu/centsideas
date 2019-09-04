interface IdeaPayload {
  id: string;
  title: string;
  description: string;
}

export class Idea {
  readonly id: string;
  readonly title: string;
  readonly description: string;

  constructor(payload: IdeaPayload = { id: '', description: '', title: '' }) {
    const { id, description, title } = payload;
    this.id = id;
    this.title = title;
    this.description = description;
  }
}
