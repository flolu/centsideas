import {Exception} from '@centsideas/utils';
import {RpcStatus, IdeaErrorNames} from '@centsideas/enums';
import {IdeaId} from '@centsideas/types';

export class IdeaNotFound extends Exception {
  code = RpcStatus.NOT_FOUND;
  name = IdeaErrorNames.NotFound;

  constructor(id?: IdeaId) {
    super(`Id with id ${id ? id : '<not specified>'} not found`, {id});
  }
}
