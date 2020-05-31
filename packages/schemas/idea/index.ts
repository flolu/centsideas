import {SchemaService} from '../schema.service';

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

export * from './idea-commands.schema';
export * from './idea-events.schema';
export * from './idea-read.schema';
