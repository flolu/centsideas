import { Collection } from 'mongodb';
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
  IIdeaViewModel,
} from '@cents-ideas/models';

import { ProjectionDatabase } from './projection-database';

@injectable()
export class IdeasProjection {
  private ideasCollection!: Collection;

  constructor(private logger: Logger, private projectionDatabase: ProjectionDatabase) {
    this.initialize();
  }

  private initialize = async () => {
    this.ideasCollection = await this.projectionDatabase.ideas();
  };

  // FIXME maybe utilize same reducer as in ideas service??!?!?!?
  handleEvent = async (event: IEvent) => {
    if (!this.ideasCollection) {
      this.ideasCollection = await this.projectionDatabase.ideas();
    }
    this.logger.debug('handle incoming ideas event', event);
    switch (event.name) {
      case IdeaEvents.IdeaCreated:
        return this.ideaCreated(event);
      case IdeaEvents.IdeaDraftSaved:
        return this.ideaDraftSaved(event);
      case IdeaEvents.IdeaDraftDiscarded:
        return this.ideaDraftDiscarded(event);
      case IdeaEvents.IdeaDraftCommitted:
        return this.ideaDraftCommitted(event);
      case IdeaEvents.IdeaPublished:
        return this.ideaPublished(event);
      case IdeaEvents.IdeaUnpublished:
        return this.ideaUnpublished(event);
      case IdeaEvents.IdeaDeleted:
        return this.ideaDeleted(event);
      case IdeaEvents.IdeaUpdated:
        return this.ideaUpdated(event);
    }
  };

  private ideaCreated = async (event: IEvent<IIdeaCreatedEvent>) => {
    const idea: IIdeaViewModel = {
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
      lastEventId: '',
      reviews: [],
      user: null,
      scores: { control: 0, entry: 0, need: 0, time: 0, scale: 0 },
    };
    await this.ideasCollection.insertOne(renameObjectProperty(idea, 'id', '_id'));
  };

  private ideaDraftSaved = async (event: IEvent<IIdeaDraftSavedEvent>) => {
    const current: IIdeaViewModel | null = await this.ideasCollection.findOne({ _id: event.aggregateId });
    if (!current) return;
    await this.ideasCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      {
        $set: {
          draft: {
            ...current.draft,
            title: event.data.title || (current.draft && current.draft.title) || '',
            description: event.data.description || (current.draft && current.draft.description) || '',
          },
          lastEvent: {
            number: event.eventNumber,
            id: event.id,
          },
        },
      },
    );
  };

  private ideaDraftCommitted = async (event: IEvent<IIdeaDraftCommittedEvent>) => {
    const current: IIdeaViewModel | null = await this.ideasCollection.findOne({ _id: event.aggregateId });
    if (!current) return;
    await this.ideasCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      {
        $set: {
          draft: null,
          title: (current.draft && current.draft.title) || '',
          description: (current.draft && current.draft.description) || '',
          updatedAt: event.timestamp,
          lastEvent: {
            number: event.eventNumber,
            id: event.id,
          },
        },
      },
    );
  };

  private ideaDraftDiscarded = async (event: IEvent<IIdeaDraftDiscardedEvent>) => {
    await this.ideasCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      {
        $set: {
          draft: null,
          lastEvent: {
            number: event.eventNumber,
            id: event.id,
          },
        },
      },
    );
  };

  private ideaUnpublished = async (event: IEvent<IIdeaUnpublishedEvent>) => {
    await this.ideasCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      {
        $set: {
          published: false,
          unpublishedAt: event.timestamp,
          lastEvent: {
            number: event.eventNumber,
            id: event.id,
          },
        },
      },
    );
  };

  private ideaPublished = async (event: IEvent<IIdeaPublishedEvent>) => {
    await this.ideasCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      {
        $set: {
          published: true,
          publishedAt: event.timestamp,
          lastEvent: {
            number: event.eventNumber,
            id: event.id,
          },
        },
      },
    );
  };

  private ideaDeleted = async (event: IEvent<IIdeaDeletedEvent>) => {
    await this.ideasCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      {
        $set: {
          deleted: true,
          deletedAt: event.timestamp,
          lastEvent: {
            number: event.eventNumber,
            id: event.id,
          },
        },
      },
    );
  };

  private ideaUpdated = async (event: IEvent<IIdeaUpdatedEvent>) => {
    const current: IIdeaViewModel | null = await this.ideasCollection.findOne({ _id: event.aggregateId });
    if (!current) return;

    await this.ideasCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      {
        $set: {
          title: event.data.title || current.title,
          description: event.data.description || current.description,
          updatedAt: event.timestamp,
        },
      },
    );
  };
}
