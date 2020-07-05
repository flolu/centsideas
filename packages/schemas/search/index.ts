import {SchemaService} from '../schema.service';

export const SearchService: SchemaService = {
  proto: 'search.proto',
  package: 'search',
  service: 'SearchService',
};

export * as SearchQueries from './search.schema';
