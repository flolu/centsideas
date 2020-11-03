import {Username, UsernameTooLong, UsernameTooShort, UsernameInvalid} from './username'

describe('username', () => {
  const sample1 = 'ronny'
  const sample2 = 'fa_nc.y123'

  it('can be created from and converted to string ', () => {
    expect(Username.fromString(sample1).toString()).toEqual(sample1)
    expect(Username.fromString(sample2).toString()).toEqual(sample2)
  })

  it('compares equality of two usernames', () => {
    expect(Username.fromString(sample1).equals(Username.fromString(sample2))).toEqual(false)
    expect(Username.fromString(sample1).equals(Username.fromString('ronny'))).toEqual(true)
  })

  it('recognizes too long usernames', () => {
    const username = 'too_long'.repeat(10)
    expect(() => Username.fromString(username)).toThrow(new UsernameTooLong(username))
  })

  it('recognizes too short usernames', () => {
    const username = 'no'
    expect(() => Username.fromString(username)).toThrow(new UsernameTooShort(username))
  })

  it('recognizes invalid usernames', () => {
    const invalid1 = 'sh*t'
    expect(() => Username.fromString(invalid1)).toThrow(new UsernameInvalid(invalid1))
    const invalid2 = 'what.the.🐤'
    expect(() => Username.fromString(invalid2)).toThrow(new UsernameInvalid(invalid2))
    const invalid3 = '__________'
    expect(() => Username.fromString(invalid3)).toThrow(new UsernameInvalid(invalid3))
  })
})
