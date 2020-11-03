import * as jwt from 'jsonwebtoken'

import {Id} from './id'
import {Token, InvalidToken, InvalidTokenSecret} from './token'

interface SampleTokenPayload {
  id: string
  count: number
}

class SampleToken extends Token<SampleTokenPayload> {
  constructor(public readonly id: Id, public readonly count: number) {
    super(3600)
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<SampleTokenPayload>(token, secret)
    return new SampleToken(Id.fromString(decoded.id), decoded.count)
  }

  protected get serializedPayload() {
    return {
      id: this.id.toString(),
      count: this.count,
    }
  }
}

describe('token', () => {
  const secret = '🔒'

  it('signs tokens with a secret', () => {
    const id = Id.generate()
    const count = 3
    const token = new SampleToken(id, count)
    const tokenString = token.sign(secret)
    const fullPayload: any = jwt.verify(tokenString, secret)

    expect(fullPayload.id).toEqual(id.toString())
    expect(fullPayload.count).toEqual(count)
    expect(fullPayload.iat).toBeDefined()
    expect(fullPayload.exp).toBeDefined()
  })

  it('tokens expire within the selected range', async () => {
    const id = Id.generate()
    const count = 3
    const token = new SampleToken(id, count)
    const tokenString = token.sign(secret, -1)

    expect(() => jwt.verify(tokenString, secret)).toThrow()
  })

  it('tokens can be decoded from a string', () => {
    const id = Id.generate()
    const count = 3
    const token = new SampleToken(id, count)
    const tokenString = token.sign(secret)
    const fullPayload: any = jwt.verify(tokenString, secret)

    const decodedToken = SampleToken.decode<SampleTokenPayload>(tokenString, secret)
    expect(decodedToken).toEqual(fullPayload)
  })

  it('invalid tokens are recognized', () => {
    const id = Id.generate()
    const count = 3
    const token = new SampleToken(id, count)
    const tokenString = token.sign(secret)

    const invalidTokenString = tokenString.replace('.', 'a')
    expect(() => SampleToken.fromString(invalidTokenString, secret)).toThrow(
      new InvalidToken(invalidTokenString),
    )
  })

  it('recognizes when a wrong secret is used for decoding', () => {
    const id = Id.generate()
    const count = 3
    const token = new SampleToken(id, count)
    const tokenString = token.sign(secret)

    const wrongSecret = '🙅'
    expect(() => SampleToken.fromString(tokenString, wrongSecret)).toThrow(new InvalidTokenSecret())
  })
})
