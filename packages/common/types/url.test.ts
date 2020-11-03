import {URL, InvalidURL} from './url'

describe('url', () => {
  it('can be created from and converted to string', () => {
    const sample = 'https://centsideas.com'
    const url = URL.fromString(sample)
    expect(url.toString()).toEqual(sample)
  })

  it('recognizes invalid urls', () => {
    const wrong1 = 'https://centsideas.com foo'
    expect(() => URL.fromString(wrong1)).toThrow(new InvalidURL(wrong1))
    const wrong2 = 'meh'
    expect(() => URL.fromString(wrong2)).toThrow(new InvalidURL(wrong2))
  })

  it('can validate in a non-strict way', () => {
    const domain = 'centsideas.com'
    expect(() => URL.fromString(domain, false)).not.toThrow()
    expect(() => URL.fromString(domain, true)).toThrow(new InvalidURL(domain))
  })
})
