import {IdeaIdRequiredError} from './idea-id-required.error';
import {SaveIdeaPayloadRequiredError} from './save-idea-payload-required.error';
import {IdeaNotFoundError} from './idea-not-found.error';
import {IdeaTitleLengthError} from './idea-title-length.error';
import {IdeaDescriptionLengthError} from './idea-description-length.error';
import {IdeaAlreadyDeletedError} from './idea-already-deleted.error';

export const IdeaErrors = {
  IdeaIdRequiredError,
  SaveIdeaPayloadRequiredError,
  IdeaNotFoundError,
  IdeaTitleLengthError,
  IdeaDescriptionLengthError,
  IdeaAlreadyDeletedError,
};
