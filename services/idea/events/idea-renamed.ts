import {DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaId} from '@centsideas/types';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

import {IdeaTitle} from '../idea-title';

export class IdeaRenamed implements DomainEvent {
  readonly eventName = IdeaEventNames.Renamed;

  constructor(public readonly id: IdeaId, public readonly title: IdeaTitle) {}

  serialize(): IdeaModels.IdeaRenamedData {
    return {id: this.id.toString(), title: this.title.toString()};
  }

  static deserialize({id, title}: IdeaModels.IdeaRenamedData) {
    return new IdeaRenamed(IdeaId.fromString(id), IdeaTitle.fromString(title));
  }
}
