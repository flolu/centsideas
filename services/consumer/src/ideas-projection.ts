import { injectable } from 'inversify';

import { Logger, renameObjectProperty } from '@cents-ideas/utils';
import { IEvent } from '@cents-ideas/event-sourcing';
import { IdeaEvents } from '@cents-ideas/enums';
import {
  IIdeaCreatedEvent,
  IIdeaDraftSavedEvent,
  IIdeaDraftDiscardedEvent,
  IIdeaDraftCommittedEvent,
  IIdeaPublishedEvent,
  IIdeaUnpublishedEvent,
  IIdeaDeletedEvent,
  IIdeaUpdatedEvent,
} from '@cents-ideas/models';

import { ProjectionDatabase } from './projection-database';

@injectable()
export class IdeasProjection {
  constructor(private logger: Logger, private projectionDatabase: ProjectionDatabase) {}

  // FIXME maybe utilize same reducer as in ideas service??!?!?!?
  // TODO update timestamps, too
  // TODO types
  // TODO typedEvent.id does not exist but is called _id
  handleEvent = async (event: IEvent) => {
    this.logger.debug('handle incoming ideas event', event);
    const ideas = await this.projectionDatabase.ideas();
    switch (event.name) {
      case IdeaEvents.IdeaCreated: {
        const typedEvent: IEvent<IIdeaCreatedEvent> = event;
        const idea = {
          id: event.aggregateId,
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
          lastEvent: {
            number: typedEvent.eventNumber,
            id: typedEvent.id,
          },
        };
        await ideas.insertOne(renameObjectProperty(idea, 'id', '_id'));
        break;
      }
      case IdeaEvents.IdeaDraftSaved: {
        const typedEvent: IEvent<IIdeaDraftSavedEvent> = event;
        await ideas.findOneAndUpdate(
          { _id: typedEvent.aggregateId },
          {
            $set: {
              draft: typedEvent.data,
              lastEvent: {
                number: typedEvent.eventNumber,
                id: typedEvent.id,
              },
            },
          },
        );
        break;
      }
      case IdeaEvents.IdeaDraftDiscarded: {
        const typedEvent: IEvent<IIdeaDraftDiscardedEvent> = event;
        await ideas.findOneAndUpdate(
          { _id: typedEvent.aggregateId },
          {
            $set: {
              draft: null,
              lastEvent: {
                number: typedEvent.eventNumber,
                id: typedEvent.id,
              },
            },
          },
        );
        break;
      }
      case IdeaEvents.IdeaDraftCommitted: {
        const typedEvent: IEvent<IIdeaDraftCommittedEvent> = event;
        const current = await ideas.findOne({ _id: typedEvent.aggregateId });
        await ideas.findOneAndUpdate(
          { _id: typedEvent.aggregateId },
          {
            $set: {
              draft: null,
              title: current.draft.title,
              description: current.draft.description,
              lastEvent: {
                number: typedEvent.eventNumber,
                id: typedEvent.id,
              },
            },
          },
        );
        break;
      }
      case IdeaEvents.IdeaPublished: {
        const typedEvent: IEvent<IIdeaPublishedEvent> = event;
        await ideas.findOneAndUpdate(
          { _id: typedEvent.aggregateId },
          {
            $set: {
              published: true,
              unpublishedAt: typedEvent.timestamp,
              lastEvent: {
                number: typedEvent.eventNumber,
                id: typedEvent.id,
              },
            },
          },
        );
        break;
      }
      case IdeaEvents.IdeaUnpublished: {
        const typedEvent: IEvent<IIdeaUnpublishedEvent> = event;
        await ideas.findOneAndUpdate(
          { _id: typedEvent.aggregateId },
          {
            $set: {
              published: false,
              publishedAt: typedEvent.timestamp,
              lastEvent: {
                number: typedEvent.eventNumber,
                id: typedEvent.id,
              },
            },
          },
        );
        break;
      }
      case IdeaEvents.IdeaDeleted: {
        const typedEvent: IEvent<IIdeaDeletedEvent> = event;
        await ideas.findOneAndUpdate(
          { _id: typedEvent.aggregateId },
          {
            $set: {
              deleted: true,
              deletedAt: typedEvent.timestamp,
              lastEvent: {
                number: typedEvent.eventNumber,
                id: typedEvent.id,
              },
            },
          },
        );
        break;
      }
      case IdeaEvents.IdeaUpdated: {
        const typedEvent: IEvent<IIdeaUpdatedEvent> = event;
        let update: any = {
          lastEvent: {
            number: typedEvent.eventNumber,
            id: typedEvent.id,
          },
        };
        if (typedEvent.data.title) {
          update['title'] = typedEvent.data.title;
        }
        if (typedEvent.data.description) {
          update['description'] = typedEvent.data.description;
        }
        await ideas.findOneAndUpdate({ _id: typedEvent.aggregateId }, { $set: update });
        break;
      }
    }
  };
}
