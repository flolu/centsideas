export class StreamVersion {
  protected constructor(private version: number) {}

  static start() {
    return new StreamVersion(0);
  }

  static fromNumber(num: number) {
    return new StreamVersion(num);
  }

  next() {
    this.version++;
  }

  toNumber() {
    return this.version;
  }

  copy() {
    return StreamVersion.fromNumber(this.version);
  }
}
