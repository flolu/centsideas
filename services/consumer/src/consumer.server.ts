import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import {
  IServer,
  IIdeaDraftSavedEvent,
  IIdeaUpdatedEvent,
  IIdeaDeletedEvent,
  IIdeaDraftCommittedEvent,
  IIdeaDraftDiscardedEvent,
  IIdeaPublishedEvent,
  IIdeaUnpublishedEvent,
  IIdeaCreatedEvent,
  HttpRequest,
  HttpResponse,
} from '@cents-ideas/models';
import { MessageBroker, IEvent } from '@cents-ideas/event-sourcing';
import { Logger, ExpressAdapter } from '@cents-ideas/utils';
import { IdeaEvents, HttpStatusCodes } from '@cents-ideas/enums';

import { IConsumerEnvironment } from './environment';
import { ProjectionDatabase } from './projection-database';

@injectable()
export class ConsumerServer implements IServer {
  private env!: IConsumerEnvironment;
  private app = express();

  constructor(
    private logger: Logger,
    private messageBroker: MessageBroker,
    private projectionDatabase: ProjectionDatabase,
    private expressAdapter: ExpressAdapter,
  ) {}

  // FIXME maybe utilize same reducer as in ideas service
  // TODO update timestamps, too
  // TODO types
  start = (env: IConsumerEnvironment) => {
    this.env = env;

    this.handleIdeasDatabase();
    this.app.use(bodyParser.json());

    this.app.post(
      '**',
      this.expressAdapter.json(
        (req: HttpRequest): Promise<HttpResponse> =>
          new Promise(async resolve => {
            const _loggerName = 'get all';
            try {
              this.logger.info(_loggerName);
              const ideasCollection = await this.projectionDatabase.ideas();
              const ideas = await ideasCollection.find().toArray();
              resolve({
                status: HttpStatusCodes.Ok,
                body: { found: ideas },
                headers: {},
              });
            } catch (error) {
              this.logger.error(_loggerName, error.status && error.status < 500 ? error.message : error.stack);
              resolve({
                status: (error && error.status) || HttpStatusCodes.InternalServerError,
                body: { error: error.message },
                headers: {},
              });
            }
          }),
      ),
    );

    this.app.listen(this.env.port, () =>
      this.logger.info('consumer service listening on internal port', this.env.port),
    );
  };

  // TODO own class for handling this
  private handleIdeasDatabase = () => {
    this.messageBroker.initialize({ brokers: this.env.kafka.brokers });
    this.messageBroker.subscribe('ideas', async (event: IEvent) => {
      this.logger.info('got event: ', event.name, 'with payload: ', event.data);
      const ideas = await this.projectionDatabase.ideas();
      switch (event.name) {
        case IdeaEvents.IdeaCreated: {
          const typedEvent: IEvent<IIdeaCreatedEvent> = event;
          const idea = {
            _id: event.aggregateId,
            title: '',
            description: '',
            createdAt: typedEvent.timestamp,
            published: false,
            publishedAt: null,
            unpublishedAt: null,
            updatedAt: null,
            deleted: false,
            deletedAt: null,
            draft: null,
            // TODO update last event on other cases
            lastEvent: {
              number: typedEvent.eventNumber,
              id: typedEvent.id,
            },
          };
          ideas.insertOne(idea);
          break;
        }
        case IdeaEvents.IdeaDraftSaved: {
          const typedEvent: IEvent<IIdeaDraftSavedEvent> = event;
          ideas.findOneAndUpdate({ _id: typedEvent.aggregateId }, { $set: { draft: typedEvent.data } });
          break;
        }
        case IdeaEvents.IdeaDraftDiscarded: {
          const typedEvent: IEvent<IIdeaDraftDiscardedEvent> = event;
          ideas.findOneAndUpdate({ _id: typedEvent.aggregateId }, { $set: { draft: null } });
          break;
        }
        case IdeaEvents.IdeaDraftCommitted: {
          const typedEvent: IEvent<IIdeaDraftCommittedEvent> = event;
          const current = await ideas.findOne({ _id: typedEvent.aggregateId });
          ideas.findOneAndUpdate(
            { id: typedEvent.aggregateId },
            { $set: { draft: null, title: current.draft.title, description: current.draft.description } },
          );
          break;
        }
        case IdeaEvents.IdeaPublished: {
          const typedEvent: IEvent<IIdeaPublishedEvent> = event;
          ideas.findOneAndUpdate(
            { id: typedEvent.aggregateId },
            { $set: { published: true, unpublishedAt: typedEvent.timestamp } },
          );
          break;
        }
        case IdeaEvents.IdeaUnpublished: {
          const typedEvent: IEvent<IIdeaUnpublishedEvent> = event;
          ideas.findOneAndUpdate(
            { id: typedEvent.aggregateId },
            { $set: { published: false, publishedAt: typedEvent.timestamp } },
          );
          break;
        }
        case IdeaEvents.IdeaDeleted: {
          const typedEvent: IEvent<IIdeaDeletedEvent> = event;
          ideas.findOneAndUpdate(
            { id: typedEvent.aggregateId },
            { $set: { deleted: true, deletedAt: typedEvent.timestamp } },
          );
          break;
        }
        case IdeaEvents.IdeaUpdated: {
          const typedEvent: IEvent<IIdeaUpdatedEvent> = event;
          let update: any = {};
          if (typedEvent.data.title) {
            update['title'] = typedEvent.data.title;
          }
          if (typedEvent.data.description) {
            update['description'] = typedEvent.data.description;
          }
          ideas.findOneAndUpdate({ _id: typedEvent.aggregateId }, { $set: update });
          break;
        }
      }
    });
  };
}
