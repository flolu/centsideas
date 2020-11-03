import {Location, LocationTooLong} from './location'

describe('location', () => {
  const location = 'Ort'

  it('can be created from and converted to string', () => {
    expect(Location.fromString(location).toString()).toEqual(location)
  })

  it('recognizes too long locations', () => {
    const long = location.repeat(50)
    expect(() => Location.fromString(long)).toThrow(new LocationTooLong(long))
  })
})
