import {Email, InvalidEmail} from './email'

describe('email', () => {
  it('can be created from and converted to string', () => {
    const sample = 'ronny@centsideas.com'
    const email = Email.fromString(sample)
    expect(email.toString()).toEqual(sample)
  })

  it('recognizes invalid emails', () => {
    const wrong1 = 'not@avalid_email'
    expect(() => Email.fromString(wrong1)).toThrow(new InvalidEmail(wrong1))
    const wrong2 = 'meh'
    expect(() => Email.fromString(wrong2)).toThrow(new InvalidEmail(wrong2))
  })

  it('compares two emails', () => {
    const email = Email.fromString('ronny@centsideas.com')
    const other = Email.fromString('john@centsideas.com')
    expect(email.equals(email)).toEqual(true)
    expect(email.equals(other)).toEqual(false)
    expect(other.equals(email)).toEqual(false)
  })
})
