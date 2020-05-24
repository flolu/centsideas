import {injectable} from 'inversify';

import {InMemoryEventStore} from '@centsideas/event-sourcing2';
import {EventTopics} from '@centsideas/enums';

@injectable()
export class IdeaEventStore extends InMemoryEventStore {
  topic = EventTopics.Idea;
}
