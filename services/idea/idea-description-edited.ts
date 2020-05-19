import {IdeaId} from '@centsideas/types';

import {IdeaDescription} from './idea-description';
import {DomainEvent} from '@centsideas/event-sourcing2';

interface IdeaDescriptionEditedData {
  id: string;
  description: string;
}

export class IdeaDescriptionEdited implements DomainEvent {
  static readonly eventName = 'idea.description-edited';

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
