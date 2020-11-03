import {RpcStatus} from './rpc-status'

export const RpcStatusHttpMap: Record<number, number> = {
  [RpcStatus.OK]: 200,
  [RpcStatus.INVALID_ARGUMENT]: 400,
  [RpcStatus.FAILED_PRECONDITION]: 400,
  [RpcStatus.OUT_OF_RANGE]: 400,
  [RpcStatus.UNAUTHENTICATED]: 401,
  [RpcStatus.PERMISSION_DENIED]: 403,
  [RpcStatus.NOT_FOUND]: 404,
  [RpcStatus.ABORTED]: 409,
  [RpcStatus.ALREADY_EXISTS]: 409,
  [RpcStatus.RESOURCE_EXHAUSTED]: 429,
  [RpcStatus.CANCELLED]: 499,
  [RpcStatus.DATA_LOSS]: 500,
  [RpcStatus.UNKNOWN]: 500,
  [RpcStatus.INTERNAL]: 500,
  [RpcStatus.UNAVAILABLE]: 503,
  [RpcStatus.DEADLINE_EXCEEDED]: 504,
  [RpcStatus.UNIMPLEMENTED]: 500,
}
