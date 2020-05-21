import {IdeaTitleLength} from '@centsideas/enums';

export class IdeaTitleTooLong extends Error {
  constructor() {
    super(`Idea title too long. Max length is ${IdeaTitleLength.Max}!`);
  }
}
