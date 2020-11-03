export class Timestamp {
  protected constructor(private readonly date: Date) {}

  static now() {
    return new Timestamp(new Date())
  }

  static fromString(isoString: string) {
    return new Timestamp(new Date(isoString))
  }

  isBefore(other: Timestamp, orEqual = true) {
    return orEqual ? this.toNumber() <= other.toNumber() : this.toNumber() < other.toNumber()
  }

  addSeconds(seconds: number) {
    this.date.setTime(this.date.getTime() + seconds * 1000)
    return this
  }

  toString() {
    return this.date.toISOString()
  }

  toNumber() {
    return Number(this.date)
  }
}
