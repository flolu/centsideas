import {Exception} from '@centsideas/utils';
import {RpcStatus, GenericErrorNames} from '@centsideas/enums';

export class InvalidId extends Exception {
  code = RpcStatus.INVALID_ARGUMENT;
  name = GenericErrorNames.InvalidId;

  constructor(id: string) {
    super(`Id: "${id}" is invalid`);
  }
}
