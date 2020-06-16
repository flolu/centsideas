import {SchemaService} from '../schema.service';
import {SchemaMessage} from '../schema-message';

export const IdeaCommandsService: SchemaService = {
  proto: 'idea-commands.proto',
  package: 'idea',
  service: 'IdeaCommands',
};

export const IdeaReadService: SchemaService = {
  proto: 'idea-read.proto',
  package: 'idea',
  service: 'IdeaRead',
};

export const IdeaEventMessage: SchemaMessage = {
  name: 'IdeaEvent',
  package: 'idea',
  proto: 'idea-events.proto',
};

export * as IdeaCommands from './idea-commands.schema';
export * as IdeaReadQueries from './idea-read.schema';
