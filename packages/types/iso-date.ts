export class ISODate {
  protected constructor(private readonly date: string) {}

  static now() {
    return new ISODate(new Date().toISOString());
  }

  // TODO test if this works
  static fromString(isoString: string) {
    return new ISODate(new Date(isoString).toISOString());
  }

  toString() {
    return this.date;
  }
}
