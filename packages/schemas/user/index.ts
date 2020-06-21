import {SchemaService} from '../schema.service';
import {SchemaMessage} from '../schema-message';

export const UserCommandService: SchemaService = {
  proto: 'user-commands.proto',
  package: 'user',
  service: 'UserCommands',
};

export const UserEventMessage: SchemaMessage = {
  name: 'UserEvent',
  package: 'user',
  proto: 'user-events.proto',
};

export const PrivateUserEventMessage: SchemaMessage = {
  name: 'PrivateUserEvent',
  package: 'user',
  proto: 'user-events.proto',
};

export const UserReadService: SchemaService = {
  proto: 'user-read.proto',
  package: 'user',
  service: 'UserRead',
};

export * as UserCommands from './user-commands.schema';
export * as UserReadQueries from './user-read.schema';
