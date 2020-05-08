import * as shortid from 'shortid';
import * as uuid from 'uuid';

export class Identifier {
  static makeShortId = (): string => {
    return shortid();
  };

  static makeLongId = (): string => {
    return uuid.v4();
  };
}
