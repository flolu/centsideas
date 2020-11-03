import {Bio, BioTooLong} from './bio'

describe('bio', () => {
  const bio = `
  That's me, Ronny! 👋
  I'm passionate about building Fastlane businesses.
  I also love to sing "All my ducklings" in my spare time.
  `

  it('can be created from and converted to string', () => {
    expect(Bio.fromString(bio).toString()).toEqual(bio)
  })

  it('recognizes too long display names', () => {
    const long = bio.repeat(10)
    expect(() => Bio.fromString(long)).toThrow(new BioTooLong(long))
  })
})
