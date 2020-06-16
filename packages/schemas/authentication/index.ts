import {SchemaService} from '../schema.service';
import {SchemaMessage} from '../schema-message';

export const AuthenticationCommandsService: SchemaService = {
  proto: 'authentication-commands.proto',
  package: 'authentication',
  service: 'AuthenticationCommands',
};

export const AuthenticationEventMessage: SchemaMessage = {
  name: 'AuthenticationEvent',
  package: 'authentication',
  proto: 'authentication-events.proto',
};

export * as AuthenticationCommands from './authentication-commands.schema';
