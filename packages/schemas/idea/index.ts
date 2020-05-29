import {SchemaService} from '../schema.service';

export * from './idea-commands.proto';
export const IdeaCommandsService: SchemaService = {
  proto: 'idea-commands.proto',
  package: 'ideaCommands',
  service: 'IdeaCommands',
};

export * from './idea-event-store.proto';
export const IdeaEventStoreService: SchemaService = {
  proto: 'idea-event-store.proto',
  package: 'ideaEventStore',
  service: 'IdeaEventStore',
};

export * from './idea-read.proto';
export const IdeaReadService: SchemaService = {
  proto: 'idea-read.proto',
  package: 'ideaRead',
  service: 'IdeaRead',
};
