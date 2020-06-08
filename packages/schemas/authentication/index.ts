import {SchemaService} from '../schema.service';

export const AuthenticationCommandsService: SchemaService = {
  proto: 'authentication-commands.proto',
  package: 'authentication',
  service: 'AuthenticationCommands',
};

export * as AuthenticationCommands from './authentication-commands.schema';
export * from './authentication-events.schema';
