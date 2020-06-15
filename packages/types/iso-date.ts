// TODO consider renaming to timestamp
export class ISODate {
  protected constructor(private readonly date: string) {}

  static now() {
    return new ISODate(new Date().toISOString());
  }

  static fromString(isoString: string) {
    return new ISODate(new Date(isoString).toISOString());
  }

  toString() {
    return this.date;
  }
}
