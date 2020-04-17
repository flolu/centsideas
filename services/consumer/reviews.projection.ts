import { injectable } from 'inversify';
import { Collection } from 'mongodb';

import { renameObjectProperty } from '@cents-ideas/utils';
import { IEvent } from '@cents-ideas/event-sourcing';
import { ReviewEvents } from '@cents-ideas/enums';
import {
  IReviewViewModel,
  IReviewCreatedEvent,
  IIdeaViewModel,
  IReviewScores,
} from '@cents-ideas/models';

import { ProjectionDatabase } from './projection-database';

@injectable()
export class ReviewsProjection {
  private reviewsCollection!: Collection;
  private ideasCollection!: Collection;

  constructor(private projectionDatabase: ProjectionDatabase) {
    this.initialize();
  }

  private initialize = async () => {
    const collections = await Promise.all([
      this.projectionDatabase.reviews(),
      this.projectionDatabase.ideas(),
    ]);
    this.reviewsCollection = collections[0];
    this.ideasCollection = collections[1];
  };

  handleEvent = async (event: IEvent) => {
    if (!this.reviewsCollection) {
      this.reviewsCollection = await this.projectionDatabase.reviews();
      this.ideasCollection = await this.projectionDatabase.ideas();
    }
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
      userId: event.data.userId,
      content: '',
      scores: { control: 0, entry: 0, need: 0, time: 0, scale: 0 },
      createdAt: event.timestamp,
      published: false,
      publishedAt: null,
      unpublishedAt: null,
      updatedAt: null,
      draft: null,
      lastEventId: '',
    };
    await this.reviewsCollection.insertOne(renameObjectProperty(review, 'id', '_id'));
  };

  private reviewUpdated = async (event: IEvent<any>) => {
    const currentReview: IReviewViewModel | null = await this.reviewsCollection.findOne({
      _id: event.aggregateId,
    });
    if (!currentReview) return;
    const newReviewScores: IReviewScores = event.data.scores || currentReview.scores;
    await this.reviewsCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      {
        $set: {
          content: event.data.content || currentReview.content,
          scores: newReviewScores,
          updatedAt: event.timestamp,
          lastEventId: event.id,
        },
      },
    );
    const idea: IIdeaViewModel | null = await this.ideasCollection.findOne({
      _id: currentReview.ideaId,
    });
    if (!idea) throw new Error(`didn't ind idea, although it must exist!`);

    if (currentReview.published) {
      const scoreTotals: IReviewScores = {
        control: idea.scores.control * idea.reviewCount,
        entry: idea.scores.entry * idea.reviewCount,
        need: idea.scores.need * idea.reviewCount,
        time: idea.scores.time * idea.reviewCount,
        scale: idea.scores.scale * idea.reviewCount,
      };
      const updatedScores: IReviewScores = {
        control:
          (scoreTotals.control + (newReviewScores.control - currentReview.scores.control)) /
          idea.reviewCount,
        entry:
          (scoreTotals.entry + (newReviewScores.entry - currentReview.scores.entry)) /
          idea.reviewCount,
        need:
          (scoreTotals.need + (newReviewScores.need - currentReview.scores.need)) /
          idea.reviewCount,
        time:
          (scoreTotals.time + (newReviewScores.time - currentReview.scores.time)) /
          idea.reviewCount,
        scale:
          (scoreTotals.scale + (newReviewScores.scale - currentReview.scores.scale)) /
          idea.reviewCount,
      };
      await this.ideasCollection.findOneAndUpdate(
        { _id: currentReview.ideaId },
        {
          $set: {
            scores: updatedScores,
          },
        },
      );
    }
  };

  private reviewPublished = async (event: IEvent<any>) => {
    // FIXME transactional update
    await this.reviewsCollection.findOneAndUpdate(
      { _id: event.aggregateId },
      {
        $set: {
          published: true,
          publishedAt: event.timestamp,
          lastEventId: event.id,
        },
      },
    );
    const review: IReviewViewModel | null = await this.reviewsCollection.findOne({
      _id: event.aggregateId,
    });
    if (!review) throw new Error(`didn't find review, although it must exist!`);
    const idea: IIdeaViewModel | null = await this.ideasCollection.findOne({
      _id: review.ideaId,
    });
    if (!idea) throw new Error(`didn't ind idea, although it must exist!`);

    const scoreTotals: IReviewScores = {
      control: idea.scores.control * idea.reviewCount,
      entry: idea.scores.entry * idea.reviewCount,
      need: idea.scores.need * idea.reviewCount,
      time: idea.scores.time * idea.reviewCount,
      scale: idea.scores.scale * idea.reviewCount,
    };
    await this.ideasCollection.findOneAndUpdate(
      { _id: review.ideaId },
      {
        $inc: {
          reviewCount: 1,
        },
        $set: {
          scores: {
            control: (scoreTotals.control + review.scores.control) / (idea.reviewCount + 1),
            entry: (scoreTotals.entry + review.scores.entry) / (idea.reviewCount + 1),
            need: (scoreTotals.need + review.scores.need) / (idea.reviewCount + 1),
            time: (scoreTotals.time + review.scores.time) / (idea.reviewCount + 1),
            scale: (scoreTotals.scale + review.scores.scale) / (idea.reviewCount + 1),
          },
        },
      },
    );
  };
}
