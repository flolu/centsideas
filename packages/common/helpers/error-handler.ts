import {NextFunction, Request, Response} from 'express'

import {RpcStatusHttpMap, ServiceName} from '../enums'

export function errorHandlerFactory(service: ServiceName) {
  return (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const data = {
      name: err.name,
      code: err.code,
      message: err.message,
      timestamp: err.timestamp.toString(),
      details: err.details,
      stack: err.stack,
      service,
    }
    const status = RpcStatusHttpMap[err.code] || 500
    res.status(status).json(data)
  }
}
