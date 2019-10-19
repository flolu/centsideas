import { injectable } from 'inversify';

import { IServer } from '@cents-ideas/models';
import { MessageBroker, IEvent } from '@cents-ideas/event-sourcing';
import { Logger } from '@cents-ideas/utils';
import { IdeaEvents } from '@cents-ideas/enums';

import { IConsumerEnvironment } from './environment';
import { ProjectionDatabase } from './projection-database';

@injectable()
export class ConsumerServer implements IServer {
  constructor(
    private logger: Logger,
    private messageBroker: MessageBroker,
    private projectionDatabase: ProjectionDatabase,
  ) {}

  start = (env: IConsumerEnvironment) => {
    const { kafka } = env;
    this.messageBroker.initialize({ brokers: kafka.brokers });
    this.messageBroker.subscribe('ideas', async (event: IEvent) => {
      this.logger.info('got event: ', event.name, 'with payload: ', event.data);
      const ideas = await this.projectionDatabase.ideas();
      switch (event.name) {
        case IdeaEvents.IdeaCreated: {
          const idea = {
            id: event.aggregateId,
            title: '',
            description: '',
            createdAt: event.timestamp,
            published: false,
            publishedAt: null,
            unpublishedAt: null,
            updatedAt: null,
            deleted: false,
            deletedAt: null,
            draft: null,
            lastEvent: {
              number: event.eventNumber,
              id: event.id,
            },
          };
          ideas.insertOne(idea);
          break;
        }
      }
    });
  };
}
