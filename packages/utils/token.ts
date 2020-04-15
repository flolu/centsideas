import * as jwt from 'jsonwebtoken';

import { TokenInvalidError } from './errors/token-invalid.error';

// TODO generic return
export const decodeToken = (token: string, jwtSecret: string): any => {
  let decoded: any;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (err) {
    throw new TokenInvalidError(token);
  }
  return decoded;
};
