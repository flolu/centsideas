export class ISODate {
  protected constructor(private readonly date: string) {}

  static now() {
    return new ISODate(new Date().toISOString());
  }

  toString() {
    return this.date;
  }
}
