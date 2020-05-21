import {IdeaTitleLength} from '@centsideas/enums';

export class IdeaTitleTooShort extends Error {
  constructor() {
    super(`Idea title too short. Min length is ${IdeaTitleLength.Min}!`);
  }
}
