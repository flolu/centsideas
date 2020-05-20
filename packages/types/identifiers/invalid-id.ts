export class InvalidId extends Error {
  constructor(id: string) {
    super(`Id: "${id}" is invalid`);
  }
}
