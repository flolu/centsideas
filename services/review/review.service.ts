import {injectable, inject} from 'inversify';

import {EventTopics, ReviewEventNames} from '@centsideas/enums';
import {MONGO_EVENT_STORE_FACTORY, MongoEventStoreFactory} from '@centsideas/event-sourcing';
import {ReviewId, UserId, IdeaId, Timestamp} from '@centsideas/types';
import {PersistedEvent, ReviewModels} from '@centsideas/models';
import {serializeEvent} from '@centsideas/rpc';

import * as Errors from './review.errors';
import {ReviewConfig} from './review.config';
import {Review} from './review';
import {ReviewReadAdapter} from './review-read.adapter';
import {IdeaReadAdapter} from './idea-read.adapter';
import {ReviewContent} from './review-content';
import {ReviewScore} from './review-score';

// TODO should review be deleted or any action be taken when idea was deleted?

@injectable()
export class ReviewService {
  private eventStore = this.eventStoreFactory({
    url: this.config.get('review1.database.url'),
    name: this.config.get('review1.database.name'),
    topic: EventTopics.Review,
  });

  constructor(
    private config: ReviewConfig,
    private reviewReadAdapter: ReviewReadAdapter,
    private ideaReadAdapter: IdeaReadAdapter,
    @inject(MONGO_EVENT_STORE_FACTORY) private eventStoreFactory: MongoEventStoreFactory,
  ) {}

  // TODO rename all userId strings that came from auth token to authenticatedUserId or auid to make it clear (in all services)
  async create(id: ReviewId, userId: string, ideaId: string) {
    const user = UserId.fromString(userId);
    const idea = IdeaId.fromString(ideaId);

    // TODO consider reusing adapters (create a package for adapters)
    const [reviewIdea, existingReview] = await Promise.all([
      this.ideaReadAdapter.getPublicIdeaById(idea),
      this.reviewReadAdapter.getByAuthorAndIdea(user, idea),
    ]);

    if (!reviewIdea) throw new Errors.IdeaNotFound(idea);
    const receiverUser = UserId.fromString(reviewIdea.userId);
    if (existingReview) throw new Errors.OneReviewPerIdea(user, idea);

    const review = Review.create(id, user, receiverUser, idea, Timestamp.now());
    await this.store(review);
    return id.toString();
  }

  async editContent(id: string, auid: string, content: string) {
    const review = await this.build(ReviewId.fromString(id));
    review.editContent(ReviewContent.fromString(content), UserId.fromString(auid));
    await this.store(review);
  }

  async changeScore(id: string, auid: string, score: ReviewModels.Score) {
    const review = await this.build(ReviewId.fromString(id));
    review.changeScore(ReviewScore.fromObject(score), UserId.fromString(auid));
    await this.store(review);
  }

  async publish(id: string, auid: string) {
    const review = await this.build(ReviewId.fromString(id));
    review.publish(Timestamp.now(), UserId.fromString(auid));
    await this.store(review);
  }

  async getEvents(after?: number) {
    const events = await this.eventStore.getEvents(after || -1);
    return events.map(serializeEvent);
  }

  async getEventsByUser(userId: string) {
    const user = UserId.fromString(userId);
    const dbCollection = await this.eventStore._getCollection();
    const result = await dbCollection.aggregate([
      {
        $match: {name: ReviewEventNames.Created, 'data.authorUserId': user.toString()},
      },
      {
        $group: {_id: '$streamId'},
      },
    ]);
    const streamIds = (await result.toArray()).map((s: any) => s._id);
    const events = dbCollection.find({streamId: {$in: streamIds}});
    return (await events.toArray()).map(serializeEvent);
  }

  private async build(id: ReviewId) {
    const events: PersistedEvent[] = await this.eventStore.getStream(id.toString());
    if (!events?.length) throw new Errors.NotFound(id);
    return Review.buildFrom(events);
  }

  private async store(review: Review) {
    await this.eventStore.store(review.flushEvents(), review.persistedAggregateVersion);
  }
}
