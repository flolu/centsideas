export class Timestamp {
  protected constructor(private readonly date: string) {}

  static now() {
    return new Timestamp(new Date().toISOString());
  }

  static fromString(isoString: string) {
    return new Timestamp(new Date(isoString).toISOString());
  }

  toString() {
    return this.date;
  }
}
