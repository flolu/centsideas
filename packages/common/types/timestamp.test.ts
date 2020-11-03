import {Timestamp} from './timestamp'

describe('timestamp', () => {
  const isoDateRegex = new RegExp(
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
  )

  it('creates new timestamps from current time', () => {
    const now = new Date()
    const ts = Timestamp.now()
    expect(isoDateRegex.test(ts.toString())).toEqual(true)
    expect(new Date(ts.toString()).toISOString()).toEqual(ts.toString())
    expect(Math.abs(Number(new Date(ts.toString())) - Number(now))).toBeLessThan(10)
  })

  it('creates new timestamps from string', () => {
    const timestamp = '2010-06-15T00:00:00'
    expect(() => Timestamp.fromString(timestamp)).not.toThrow()
  })

  it('converts timestamps to string', () => {
    expect(isoDateRegex.test(Timestamp.now().toString())).toEqual(true)
  })

  it('converts timestamps to number', () => {
    const date = new Date()
    const timestamp = Timestamp.fromString(date.toISOString())
    expect(timestamp.toNumber()).toEqual(Number(date))
  })

  it('checks if another timestamp is before', () => {
    const timestamp1 = Timestamp.fromString('2000-08-31T16:47+00:00')
    const timestamp2 = Timestamp.fromString('2007-08-31T16:47+00:00')
    expect(timestamp1.isBefore(timestamp2)).toEqual(true)
    expect(timestamp2.isBefore(timestamp1)).toEqual(false)
    expect(timestamp1.isBefore(timestamp1)).toEqual(true)
    expect(timestamp2.isBefore(timestamp2)).toEqual(true)
    expect(timestamp1.isBefore(timestamp1, false)).toEqual(false)
    expect(timestamp2.isBefore(timestamp2, false)).toEqual(false)
  })

  it('adds seconds', () => {
    const timestamp1String = '2000-08-31T16:47+00:00'
    const timestamp2 = Timestamp.fromString('2000-08-31T16:48+00:00')
    const timestamp3 = Timestamp.fromString('2000-08-31T16:46+00:00')
    expect(Timestamp.fromString(timestamp1String).addSeconds(60).toString()).toEqual(
      timestamp2.toString(),
    )
    expect(Timestamp.fromString(timestamp1String).addSeconds(-60).toString()).toEqual(
      timestamp3.toString(),
    )
  })
})
