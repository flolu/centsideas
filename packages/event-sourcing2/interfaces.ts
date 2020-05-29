import {EventTopics} from '@centsideas/enums';

export interface EventStoreFactoryOptions {
  url: string;
  name: string;
  topic: EventTopics;
}
