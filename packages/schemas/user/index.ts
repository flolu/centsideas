import {EventTopics} from '@centsideas/enums';

import {SchemaService} from '../schema.service';
import {SchemaMessage} from '../schema-message';
import {SerializableMessage} from '../serializable-message';

export const UserCommandService: SchemaService = {
  proto: 'user-commands.proto',
  package: 'user',
  service: 'UserCommands',
};

export const UserReadService: SchemaService = {
  proto: 'user-read.proto',
  package: 'user',
  service: 'UserRead',
};

@SerializableMessage(EventTopics.User)
export class UserEventMessage extends SchemaMessage {
  name = 'UserEvent';
  package = 'user';
  proto = 'user-events.proto';
}

@SerializableMessage(EventTopics.PrivateUser)
export class PrivateUserEventMessage extends SchemaMessage {
  name = 'PrivateUserEvent';
  package = 'user';
  proto = 'user-events.proto';
}

export * as UserCommands from './user-commands.schema';
export * as UserReadQueries from './user-read.schema';
