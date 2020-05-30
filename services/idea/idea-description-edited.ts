import {IDomainEvent, DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

import {IdeaDescription} from './idea-description';

@DomainEvent(IdeaEventNames.DescriptionEdited)
export class IdeaDescriptionEdited implements IDomainEvent {
  constructor(public readonly description: IdeaDescription) {}

  serialize(): IdeaModels.IdeaDescriptionEditedData {
    return {
      description: this.description.toString(),
    };
  }

  static deserialize({description}: IdeaModels.IdeaDescriptionEditedData) {
    return new IdeaDescriptionEdited(IdeaDescription.fromString(description));
  }
}
