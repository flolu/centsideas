import * as shortid from 'shortid';
import {v4 as uuidv4} from 'uuid';

import {Exception} from '@centsideas/utils';
import {RpcStatus, GenericErrorNames} from '@centsideas/enums';

abstract class BaseId {
  protected constructor(protected readonly id: string) {}

  equals(that: Id) {
    return this.id === that.toString();
  }

  toString() {
    return this.id;
  }
}

export class UUId extends BaseId {
  protected static regex = new RegExp(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  );

  static generate() {
    return new UUId(uuidv4());
  }

  static fromString(id: string) {
    if (!UUId.regex.test(id)) throw new InvalidId(id);
    return new UUId(id);
  }
}

export class ShortId extends BaseId {
  static generate() {
    return new ShortId(shortid());
  }

  static fromString(id: string) {
    if (!shortid.isValid(id)) throw new InvalidId(id);
    return new ShortId(id);
  }
}

export type Id = UUId | ShortId;

export class InvalidId extends Exception {
  code = RpcStatus.INVALID_ARGUMENT;
  name = GenericErrorNames.InvalidId;

  constructor(id: string) {
    super(`Id: "${id}" is invalid`);
  }
}
