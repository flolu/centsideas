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

export * as IdeaCommands from './idea-commands.schema';
export * as IdeaReadQueries from './idea-read.schema';
export * from './idea-events.schema';
