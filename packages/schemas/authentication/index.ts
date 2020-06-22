import {EventTopics} from '@centsideas/enums';

import {SchemaService} from '../schema.service';
import {SchemaMessage} from '../schema-message';
import {SerializableMessage} from '../serializable-message';

export const AuthenticationCommandsService: SchemaService = {
  proto: 'authentication-commands.proto',
  package: 'authentication',
  service: 'AuthenticationCommands',
};

@SerializableMessage(EventTopics.Session)
export class AuthenticationEventMessage extends SchemaMessage {
  name = 'AuthenticationEvent';
  package = 'authentication';
  proto = 'authentication-events.proto';
}

export * as AuthenticationCommands from './authentication-commands.schema';
