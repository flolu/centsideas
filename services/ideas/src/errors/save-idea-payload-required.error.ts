import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class SaveIdeaPayloadRequiredError extends EntityError {
  static validate = (title: string, description: string): void => {
    if (!(title && description)) {
      throw new SaveIdeaPayloadRequiredError(!title, !description);
    }
  };

  constructor(titleMissing: boolean, descriptionMissing: boolean) {
    super(
      `Title and description are required to save an idea. Missing: ${titleMissing ? 'title' : ''} ${
        descriptionMissing ? ', description' : ''
      }`,
      HttpStatusCodes.BadRequest,
    );
  }
}
