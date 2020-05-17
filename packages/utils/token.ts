import * as jwt from 'jsonwebtoken';

import {TokenInvalidError} from './errors/token-invalid.error';

export const decodeToken = <T = any>(token: string, jwtSecret: string): T => {
  let decoded: any;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (err) {
    throw new TokenInvalidError(token, err.message);
  }
  return decoded;
};

export const signToken = (payload: any, secret: string, expiresIn: number) =>
  jwt.sign(payload, secret, {expiresIn});
