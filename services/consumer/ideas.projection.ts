import { Collection } from 'mongodb';
import { injectable } from 'inversify';

import { Logger, renameObjectProperty } from '@cents-ideas/utils';
import { IEvent } from '@cents-ideas/event-sourcing';
import { IdeaEvents } from '@cents-ideas/enums';
import {
  IIdeaCreatedEvent,
  IIdeaDeletedEvent,
  IIdeaUpdatedEvent,
  IIdeaViewModel,
} from '@cents-ideas/models';

import { ProjectionDatabase } from './projection-database';

@injectable()
export class IdeasProjection {
  private ideasCollection!: Collection;

  constructor(private projectionDatabase: ProjectionDatabase) {
    this.initialize();
  }

  private initialize = async () => {
    this.ideasCollection = await this.projectionDatabase.ideas();
  };

  handleEvent = async (event: IEvent) => {
    if (!this.ideasCollection) {
      await this.initialize();
    }
    Logger.debug('handle incoming ideas event', event);
    switch (event.name) {
      case IdeaEvents.IdeaCreated:
        return this.ideaCreated(event);
      case IdeaEvents.IdeaDeleted:
        return this.ideaDeleted(event);
      case IdeaEvents.IdeaUpdated:
        return this.ideaUpdated(event);
    }
  };

  private ideaCreated = async (event: IEvent<IIdeaCreatedEvent>) => {
    const idea: IIdeaViewModel = {
      id: event.aggregateId,
      title: event.data.title,
      userId: event.data.userId,
      description: event.data.description,
      createdAt: event.timestamp,
      updatedAt: null,
      deleted: false,
      deletedAt: null,
      lastEventId: '',
      reviews: [],
      scores: { control: 0, entry: 0, need: 0, time: 0, scale: 0 },
      reviewCount: 0,
    };
    await this.ideasCollection.insertOne(renameObjectProperty(idea, 'id', '_id'));
  };

  private ideaDeleted = async (event: IEvent<IIdeaDeletedEvent>) => {
    await this.ideasCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      {
        $set: {
          deleted: true,
          deletedAt: event.timestamp,
          lastEventId: event.id,
        },
      },
    );
  };

  private ideaUpdated = async (event: IEvent<IIdeaUpdatedEvent>) => {
    const current: IIdeaViewModel | null = await this.ideasCollection.findOne({
      _id: event.aggregateId,
    });
    if (!current) return;

    await this.ideasCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      {
        $set: {
          title: event.data.title || current.title,
          description: event.data.description || current.description,
          updatedAt: event.timestamp,
          lastEventId: event.id,
        },
      },
    );
  };
}
