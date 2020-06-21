import {Exception} from '@centsideas/utils';
import {RpcStatus, IdeaErrorNames} from '@centsideas/enums';

export class IdeaNotFound extends Exception {
  code = RpcStatus.NOT_FOUND;
  name = IdeaErrorNames.NotFound;

  constructor(id: string) {
    super(`Id with id ${id ? id : '<not specified>'} not found`, {id});
  }
}
