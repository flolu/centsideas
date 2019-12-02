import { injectable } from 'inversify';
import { Collection } from 'mongodb';
import { Logger, renameObjectProperty } from '@cents-ideas/utils';
import { ProjectionDatabase } from './projection-database';
import { IEvent } from '@cents-ideas/event-sourcing';
import { ReviewEvents } from '@cents-ideas/enums';
import { IReviewViewModel, IReviewCreatedEvent } from '@cents-ideas/models';

@injectable()
export class ReviewsProjection {
  private reviewsCollection!: Collection;

  constructor(private logger: Logger, private projectionDatabase: ProjectionDatabase) {}

  private initialize = async () => {
    this.reviewsCollection = await this.projectionDatabase.reviews();
  };

  handleEvent = async (event: IEvent) => {
    if (!this.reviewsCollection) {
      this.reviewsCollection = await this.projectionDatabase.reviews();
    }
    this.logger.debug('handle incoming reviews event', event.name);
    switch (event.name) {
      case ReviewEvents.ReviewCreated:
        return this.reviewCreated(event);
      case ReviewEvents.ReviewUpdated:
        return this.reviewUpdated(event);
      case ReviewEvents.ReviewPublished:
        return this.reviewPublished(event);
    }
  };

  private reviewCreated = async (event: IEvent<IReviewCreatedEvent>) => {
    const review: IReviewViewModel = {
      id: event.aggregateId,
      ideaId: event.data.ideaId,
      content: '',
      scores: { control: 0, entry: 0, need: 0, time: 0, scale: 0 },
      createdAt: event.timestamp,
      published: false,
      publishedAt: null,
      unpublishedAt: null,
      updatedAt: null,
      draft: null,
    };
    await this.reviewsCollection.insertOne(renameObjectProperty(review, 'id', '_id'));
  };

  private reviewUpdated = async (event: IEvent<any>) => {
    const current: IReviewViewModel | null = await this.reviewsCollection.findOne({ _id: event.aggregateId });
    if (!current) return;
    await this.reviewsCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      {
        $set: {
          content: event.data.content || current.content,
          scores: event.data.scores || current.scores,
          updatedAt: event.timestamp,
        },
      },
    );
  };

  private reviewPublished = async (event: IEvent<any>) => {
    await this.reviewsCollection.findOneAndUpdate(
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
}
