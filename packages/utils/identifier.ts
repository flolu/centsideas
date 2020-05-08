import * as shortid from 'shortid';
import * as uuid from 'uuid';

// FIXME worker id https://www.npmjs.com/package/shortid#shortidworkerinteger
export class Identifier {
  static makeShortId = (): string => shortid();
  static makeLongId = (): string => uuid.v4();
}
