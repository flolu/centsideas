import { Request, Response } from 'express';
import { injectable } from 'inversify';

import { HttpRequest, HttpResponse } from '@centsideas/models';

export type JsonController = (request: HttpRequest) => Promise<HttpResponse>;

// TODO don't inject this ... instead use method from below
@injectable()
export class ExpressAdapter {
  json(controller: JsonController): any {
    return async (req: Request, res: Response) => {
      const httpRequest: HttpRequest = req.body;
      const response: HttpResponse = await controller(httpRequest);
      return res.json(response);
    };
  }
}

type JsonExpressAdapter = (controller: JsonController) => any;
export const json: JsonExpressAdapter = controller => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = req.body;
    const response: HttpResponse = await controller(httpRequest);
    return res.json(response);
  };
};

export const ExpressAdapters = { json };
