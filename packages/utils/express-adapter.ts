import { Request, Response } from 'express';
import { injectable } from 'inversify';

import { HttpRequest, HttpResponse } from '@centsideas/models';

@injectable()
export class ExpressAdapter {
  json(controller: (request: HttpRequest) => Promise<HttpResponse>): any {
    return async (req: Request, res: Response) => {
      const httpRequest: HttpRequest = req.body;
      const response: HttpResponse = await controller(httpRequest);
      return res.json(response);
    };
  }
}
