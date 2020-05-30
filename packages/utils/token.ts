import * as jwt from 'jsonwebtoken';

import {InvalidAuthToken} from './exception';

export const decodeToken = <T = any>(token: string, jwtSecret: string): T => {
  let decoded: any;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (err) {
    throw new InvalidAuthToken(err.message, {token});
  }
  return decoded;
};

export const signToken = (payload: any, secret: string, expiresIn: number) =>
  jwt.sign(payload, secret, {expiresIn});
