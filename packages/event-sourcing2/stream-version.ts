export class StreamVersion {
  protected constructor(private version: number) {}

  static start() {
    return new StreamVersion(0);
  }

  next() {
    this.version++;
  }

  toNumber() {
    return this.version;
  }
}
