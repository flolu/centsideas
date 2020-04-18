import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { HeaderKeys } from '@centsideas/enums';
import { IAccessTokenPayload } from '@centsideas/models';

import env from './environment';

export const authMiddleware: any = (req: Request, res: Response, next: NextFunction): void => {
  res.locals.userId = null;
  const authHeader = req.headers[HeaderKeys.Auth];
  if (!authHeader) return next();

  try {
    const accessToken = (authHeader as string).split(' ')[1];
    const decoded = jwt.verify(accessToken, env.accessTokenSecret);
    const data: IAccessTokenPayload = decoded as any;
    res.locals.userId = data.userId;
    // tslint:disable-next-line:no-empty
  } catch (error) {}

  next();
};
