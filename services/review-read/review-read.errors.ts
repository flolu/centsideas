import {Exception} from '@centsideas/utils';
import {RpcStatus, ReviewErrorNames} from '@centsideas/enums';
import {ReviewId} from '@centsideas/types';

export class NotFound extends Exception {
  name = ReviewErrorNames.NotFound;
  code = RpcStatus.NOT_FOUND;
  constructor(id?: ReviewId) {
    super(`Review ${id ? 'with id ' + id : ''} not found`, {id});
  }
}
