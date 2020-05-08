import * as shortid from 'shortid';
import * as uuid from 'uuid';

export class Identifier {
  static makeShortId = (): string => shortid();
  static makeLongId = (): string => uuid.v4();
}
