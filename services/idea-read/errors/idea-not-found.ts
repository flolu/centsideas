export class IdeaNotFound extends Error {
  constructor(id: string) {
    super(`Id with id ${id} not found`);
  }
}
