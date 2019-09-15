import { Request, Response } from 'express';
import { HttpRequest, HttpResponse } from '@cents-ideas/models';

export const expressJsonAdapter = (controller: (request: HttpRequest) => Promise<HttpResponse>) => async (
  req: Request,
  res: Response,
) => {
  const httpRequest: HttpRequest = req.body;
  const response: HttpResponse = await controller(httpRequest);
  return res.json(response);
};
