import {InMemoryEventStore} from '@centsideas/event-sourcing2';
import {IdeaEventNames} from '@centsideas/enums';

import * as Events from './events';
import {Idea} from './idea';

export class IdeaEventStore extends InMemoryEventStore<Idea> {
  eventMap = {
    [IdeaEventNames.Created]: Events.IdeaCreated,
    [IdeaEventNames.Renamed]: Events.IdeaRenamed,
    [IdeaEventNames.DescriptionEdited]: Events.IdeaDescriptionEdited,
    [IdeaEventNames.TagsAdded]: Events.IdeaTagsAdded,
    [IdeaEventNames.TagsRemoved]: Events.IdeaTagsRemoved,
    [IdeaEventNames.Published]: Events.IdeaPublished,
    [IdeaEventNames.Deleted]: Events.IdeaDeleted,
  };
  aggregate = Idea;
}
