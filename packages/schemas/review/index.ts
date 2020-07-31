import {EventTopics} from '@centsideas/enums';

import {SchemaService} from '../schema.service';
import {SerializableMessage} from '../serializable-message';
import {SchemaMessage} from '../schema-message';

export const ReviewCommandsService: SchemaService = {
  proto: 'review-commands.proto',
  package: 'review',
  service: 'ReviewCommands',
};

export const ReviewReadService: SchemaService = {
  proto: 'review-read.proto',
  package: 'review',
  service: 'ReviewRead',
};

@SerializableMessage(EventTopics.Review)
export class ReviewEventMessage extends SchemaMessage {
  name = 'ReviewEvent';
  package = 'review';
  proto = 'review-events.proto';
}

export * as ReviewCommands from './review-commands.schema';
export * as ReviewQueries from './review-read.schema';
