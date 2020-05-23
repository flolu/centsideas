import {IdeaId} from '@centsideas/types';
import {DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaDescriptionEditedData} from '@centsideas/models';

import {IdeaDescription} from '../idea-description';

export class IdeaDescriptionEdited implements DomainEvent {
  readonly eventName = IdeaEventNames.DescriptionEdited;

  constructor(public readonly id: IdeaId, public readonly description: IdeaDescription) {}

  serialize(): IdeaDescriptionEditedData {
    return {
      id: this.id.toString(),
      description: this.description.toString(),
    };
  }

  static deserialize({id, description}: IdeaDescriptionEditedData) {
    return new IdeaDescriptionEdited(
      IdeaId.fromString(id),
      IdeaDescription.fromString(description),
    );
  }
}
