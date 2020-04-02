import * as jwt from 'jsonwebtoken';

import { ITokenDataFull } from '@cents-ideas/models';

import { TokenInvalidError } from './errors/token-invalid.error';

export const decodeToken = (token: string, jwtSecret: string): ITokenDataFull => {
  let decoded: any;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (err) {
    throw new TokenInvalidError(token);
  }
  return decoded;
};
