import {DisplayName, DisplayNameTooLong} from './display-name'

describe('display name', () => {
  const name = 'Ronny Schnackelmann'

  it('can be created from and converted to string', () => {
    expect(DisplayName.fromString(name).toString()).toEqual(name)
  })

  it('recognizes too long display names', () => {
    const long = name.repeat(10)
    expect(() => DisplayName.fromString(long)).toThrow(new DisplayNameTooLong(long))
  })

  it('can contain special characters', () => {
    expect(() => DisplayName.fromString('What the 🦆?')).not.toThrow()
  })
})
