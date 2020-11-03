import {Id, InvalidId} from './id'

describe('id', () => {
  const uuid = '123e4567-e89b-12d3-a456-426614174000'

  it('can be generated', () => {
    expect(() => Id.generate()).not.toThrow()
  })

  it('can be created from string', () => {
    expect(() => Id.fromString(uuid)).not.toThrow()
  })

  it('can be converted to string', () => {
    expect(Id.fromString(uuid).toString()).toEqual(uuid)
  })

  it('can be compared', () => {
    const id = Id.generate()
    expect(id.equals(Id.fromString(uuid))).toEqual(false)
    expect(id.equals(Id.fromString(id.toString()))).toEqual(true)
  })

  it('recognizes wrong ids', () => {
    const wrong1 = 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx_nope'
    expect(() => Id.fromString(wrong1)).toThrow(new InvalidId(wrong1))
    const wrong2 = '46Juzcyx'
    expect(() => Id.fromString(wrong2)).toThrow(new InvalidId(wrong2))
  })
})
