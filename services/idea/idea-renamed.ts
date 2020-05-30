import {IDomainEvent, DomainEvent} from '@centsideas/event-sourcing';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

import {IdeaTitle} from './idea-title';

@DomainEvent(IdeaEventNames.Renamed)
export class IdeaRenamed implements IDomainEvent {
  constructor(public readonly title: IdeaTitle) {}

  serialize(): IdeaModels.IdeaRenamedData {
    return {title: this.title.toString()};
  }

  static deserialize({title}: IdeaModels.IdeaRenamedData) {
    return new IdeaRenamed(IdeaTitle.fromString(title));
  }
}
