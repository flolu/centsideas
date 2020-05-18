export class StreamVersion {
  protected constructor(public version: number) {}

  static start() {
    return new StreamVersion(0);
  }

  next() {
    this.version++;
  }
}
