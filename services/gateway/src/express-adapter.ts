import * as express from 'express';
import axios from 'axios';

import { HttpRequest, HttpResponse } from '@cents-ideas/models';
import { logger } from './environment';

export class ExpressAdapter {
  // FIXME timeout handler
  public makeJsonAdapter = (url: string): express.RequestHandler => {
    return async (req: express.Request, res: express.Response) => {
      const httpRequest: HttpRequest = this.makeHttpRequestFromExpressRequest(req);
      logger.info(url);
      const response = await axios.post(url, httpRequest);
      const httpResponse: HttpResponse = response.data;
      logger.info(url, ' -> done');
      this.handleExpressHttpResponse(res, httpResponse);
    };
  };

  private handleExpressHttpResponse = (res: express.Response, httpResponse: HttpResponse): void => {
    if (httpResponse.headers) {
      res.set(httpResponse.headers);
    }
    res.status(httpResponse.status).send(httpResponse.body);
  };

  private makeHttpRequestFromExpressRequest = (expressRequest: express.Request): HttpRequest => {
    return {
      body: expressRequest.body,
      ip: expressRequest.ip,
      method: expressRequest.method,
      path: expressRequest.path,
      url: expressRequest.url,
      cookies: expressRequest.cookies,
      query: expressRequest.query,
      params: expressRequest.params,
      headers: expressRequest.headers,
    };
  };
}
