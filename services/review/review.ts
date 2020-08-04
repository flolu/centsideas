import {Aggregate, PersistedSnapshot, Apply} from '@centsideas/event-sourcing';
import {UserId, ReviewId, Timestamp, IdeaId} from '@centsideas/types';
import {PersistedEvent, ReviewModels} from '@centsideas/models';

import * as Errors from './review.errors';
import {ReviewContent} from './review-content';
import {ReviewScore} from './review-score';
import {ReviewCreated} from './review-created';
import {ReviewContentEdited} from './review-content-edited';
import {ReviewScoreChanged} from './review-score-changed';
import {ReviewPublished} from './review-published';

export interface SerializedReview {
  id: string;
  authorUserId: string;
  receiverUserId: string;
  ideaId: string;
  content: string | undefined;
  score: ReviewModels.Score | undefined;
  publishedAt: string | undefined;
}

export class Review extends Aggregate<SerializedReview> {
  protected id!: ReviewId;
  private authorUserId!: UserId;
  private receiverUserId!: UserId;
  private ideaId!: IdeaId;
  private content: ReviewContent | undefined;
  private score: ReviewScore | undefined;
  private publishedAt: Timestamp | undefined;

  static buildFrom(events: PersistedEvent[], snapshot?: PersistedSnapshot<SerializedReview>) {
    const review = new Review();
    if (snapshot) review.applySnapshot(snapshot, events);
    else review.replay(events);
    return review;
  }

  protected deserialize(data: SerializedReview) {
    this.id = ReviewId.fromString(data.id);
    this.authorUserId = UserId.fromString(data.authorUserId);
    this.receiverUserId = UserId.fromString(data.receiverUserId);
    this.ideaId = IdeaId.fromString(data.ideaId);
    this.content = data.content ? ReviewContent.fromString(data.content) : undefined;
    this.score = data.score ? ReviewScore.fromObject(data.score) : undefined;
    this.publishedAt = data.publishedAt ? Timestamp.fromString(data.publishedAt) : undefined;
  }

  protected serialize(): SerializedReview {
    return {
      id: this.id.toString(),
      authorUserId: this.authorUserId.toString(),
      receiverUserId: this.receiverUserId.toString(),
      ideaId: this.ideaId.toString(),
      content: this.content?.toString(),
      score: this.score?.toObject(),
      publishedAt: this.publishedAt?.toString(),
    };
  }

  static create(
    id: ReviewId,
    author: UserId,
    receiver: UserId,
    idea: IdeaId,
    createdAt: Timestamp,
  ) {
    const review = new Review();
    review.raise(new ReviewCreated(id, author, receiver, idea, createdAt));
    return review;
  }

  editContent(content: ReviewContent, user: UserId) {
    this.checkGeneralConditions(user);
    if (this.content?.equals(content)) return;
    this.raise(new ReviewContentEdited(content));
  }

  changeScore(score: ReviewScore, user: UserId) {
    this.checkGeneralConditions(user);
    if (this.score?.equals(score)) return;
    this.raise(new ReviewScoreChanged(score));
  }

  publish(publishedAt: Timestamp, user: UserId) {
    this.checkGeneralConditions(user);
    if (this.publishedAt) return;
    if (!!this.publishedAt) throw new Errors.AlreadyPublished(this.id);
    if (!this.content) throw new Errors.ReviewContentRequired(this.id);
    if (!this.score) throw new Errors.ReviewScoreRequired(this.id);
    this.raise(new ReviewPublished(publishedAt));
  }

  private checkGeneralConditions(user: UserId) {
    if (!this.authorUserId.equals(user)) throw new Errors.NoPermissionToAccessReview(this.id, user);
  }

  @Apply(ReviewCreated)
  protected created(event: ReviewCreated) {
    this.id = event.id;
    this.authorUserId = event.author;
    this.receiverUserId = event.receiver;
    this.ideaId = event.idea;
  }

  @Apply(ReviewContentEdited)
  protected reviewContentEdited(event: ReviewContentEdited) {
    this.content = event.content;
  }

  @Apply(ReviewScoreChanged)
  protected reviewScoreChanged(event: ReviewScoreChanged) {
    this.score = event.score;
  }

  @Apply(ReviewPublished)
  protected reviewPublished(event: ReviewPublished) {
    this.publishedAt = event.publishedAt;
  }
}
