import {Collection} from 'mongodb';
import {injectable} from 'inversify';

import {IdeaEvents} from '@centsideas/enums';
import {
  IIdeaCreatedEvent,
  IIdeaDeletedEvent,
  IIdeaUpdatedEvent,
  IIdeaViewModel,
  IEvent,
} from '@centsideas/models';

import {ProjectionDatabase} from './projection-database';

// FIXME how should errors in the projection db be handled? (best solution would be to tell the consumer that event wasn't yet consumed)

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
      lastEventNumber: 0,
      lastEventId: '',
      reviews: [],
      scores: {control: 0, entry: 0, need: 0, time: 0, scale: 0},
      reviewCount: 0,
    };
    await this.ideasCollection.insertOne(idea);
  };

  private ideaDeleted = async (event: IEvent<IIdeaDeletedEvent>) => {
    await this.ideasCollection.findOneAndDelete({id: event.aggregateId});
  };

  private ideaUpdated = async (event: IEvent<IIdeaUpdatedEvent>) => {
    const current: IIdeaViewModel | null = await this.ideasCollection.findOne({
      id: event.aggregateId,
    });
    if (!current) return;

    await this.ideasCollection.findOneAndUpdate(
      {id: event.aggregateId},
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
