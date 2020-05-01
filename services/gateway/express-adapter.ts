import * as express from 'express';
import axios from 'axios';
import { injectable } from 'inversify';

import { HttpRequest, HttpResponse } from '@centsideas/models';
import { HttpStatusCodes } from '@centsideas/enums';
import { Logger } from '@centsideas/utils';

@injectable()
export class ExpressAdapter {
  public makeJsonAdapter(url: string): express.RequestHandler {
    return async (req: express.Request, res: express.Response) => {
      try {
        const httpRequest: HttpRequest = this.makeHttpRequestFromExpressRequest(req, res);

        // TODO try to throw error in a service... i think the respoonse will time out... when it should return an error
        const response = await axios.post(url, httpRequest);
        const httpResponse: HttpResponse = response.data;
        this.handleExpressHttpResponse(res, httpResponse);
      } catch (err) {
        Logger.error(err);
        this.handleExpressHttpResponse(res, {
          status: HttpStatusCodes.InternalServerError,
          body: `Unexpected error occurred: ${err.message}`,
        });
      }
    };
  }

  private handleExpressHttpResponse = (res: express.Response, httpResponse: HttpResponse): void => {
    if (httpResponse.headers) {
      res.set(httpResponse.headers);
    }
    if (httpResponse.cookies) {
      for (const cookie of httpResponse.cookies) {
        res.cookie(cookie.name, cookie.val, cookie.options);
      }
    }
    res.status(httpResponse.status || HttpStatusCodes.InternalServerError).send(httpResponse.body);
  };

  private makeHttpRequestFromExpressRequest = (
    req: express.Request,
    res: express.Response,
  ): HttpRequest => ({
    body: req.body,
    ip: req.ip,
    method: req.method,
    path: req.path,
    url: req.url,
    cookies: req.cookies,
    query: req.query,
    params: req.params,
    headers: req.headers,
    locals: res.locals,
  });
}
