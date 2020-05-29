import {SchemaService} from '../schema.service';

export * from './idea-commands.schema';
export const IdeaCommandsService: SchemaService = {
  proto: 'idea-commands.proto',
  package: 'idea',
  service: 'IdeaCommands',
};

export * from './idea-event-store.schema';
export const IdeaEventStoreService: SchemaService = {
  proto: 'idea-event-store.proto',
  package: 'idea',
  service: 'IdeaEventStore',
};

export * from './idea-read.schema';
export const IdeaReadService: SchemaService = {
  proto: 'idea-read.proto',
  package: 'idea',
  service: 'IdeaRead',
};
