import * as shortid from 'shortid';

export class Identifier {
  static makeUniqueId = (): string => {
    return shortid();
  };

  static isValidId = (id: string): boolean => {
    return shortid.isValid(id);
  };
}
