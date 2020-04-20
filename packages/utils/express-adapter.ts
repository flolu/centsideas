import { Request, Response } from 'express';

import { HttpRequest, HttpResponse } from '@centsideas/models';

export type JsonController = (request: HttpRequest) => Promise<HttpResponse>;

type JsonExpressAdapter = (controller: JsonController) => any;
export const json: JsonExpressAdapter = controller => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = req.body;
    const response: HttpResponse = await controller(httpRequest);
    return res.json(response);
  };
};

export const ExpressAdapters = { json };
