import * as shortid from 'shortid';
import * as uuid from 'uuid';

export class Identifier {
  static makeUniqueId = (): string => {
    return shortid();
  };

  static makeLongId = (): string => {
    return uuid.v1();
  };

  static isValidId = (id: string): boolean => {
    return shortid.isValid(id);
  };
}
