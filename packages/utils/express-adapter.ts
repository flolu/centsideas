import { Request, Response } from 'express';

import { HttpRequest, HttpResponse } from '@centsideas/models';

import { handleHttpResponseError } from './http-error-response-handler';

export type JsonController = (request: HttpRequest) => Promise<HttpResponse>;

type JsonExpressAdapter = (controller: JsonController) => any;
export const json: JsonExpressAdapter = controller => {
  return async (req: Request, res: Response) => {
    try {
      const httpRequest: HttpRequest = (req as any).body;
      const response: HttpResponse = await controller(httpRequest);
      return res.json(response);
    } catch (error) {
      return handleHttpResponseError(error);
    }
  };
};

export const ExpressAdapters = { json };
