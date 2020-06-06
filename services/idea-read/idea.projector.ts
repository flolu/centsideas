import {injectable, inject} from 'inversify';
import * as asynRetry from 'async-retry';

import {MongoProjector, EventListener, Project} from '@centsideas/event-sourcing';
import {RpcClient, deserializeEvent, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';
import {EventTopics, IdeaEventNames} from '@centsideas/enums';
import {IdeaModels, PersistedEvent} from '@centsideas/models';
import {IdeaCommands, IdeaCommandsService} from '@centsideas/schemas';

import {IdeaReadConfig} from './idea-read.config';

// FIXME make it possible clear the projector programmatically
@injectable()
export class IdeaProjector extends MongoProjector {
  databaseUrl = this.config.get('idea-read.database.url');
  databaseName = this.config.get('idea-read.database.name');

  private consumerGroupName = 'centsideas-idea-read';
  private ideaEventStoreRpc: RpcClient<IdeaCommands.Service> = this.rpcFactory(
    this.config.get('idea.rpc.host'),
    IdeaCommandsService,
    Number(this.config.get('idea.rpc.port')),
  );
  private collectionName = this.config.get('idea-read.database.collection');

  constructor(
    private eventListener: EventListener,
    private config: IdeaReadConfig,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {
    super();
  }

  async initialize() {
    const collection = await this.ideaCollection();
    await collection.createIndex({id: 1}, {unique: true});
  }

  eventStream = this.eventListener.listen(EventTopics.Idea, this.consumerGroupName);

  async getEvents(after: number) {
    const result = await asynRetry(() => this.ideaEventStoreRpc.client.getEvents({after}), {
      minTimeout: 500,
      retries: 5,
    });
    if (!result.events) return [];
    return result.events.map(deserializeEvent);
  }

  @Project(IdeaEventNames.Created)
  async created({data, streamId, version}: PersistedEvent<IdeaModels.IdeaCreatedData>) {
    const {userId, createdAt} = data;
    const collection = await this.ideaCollection();
    await collection.insertOne({
      id: streamId,
      userId,
      createdAt,
      title: '',
      description: '',
      tags: [],
      publishedAt: '',
      deletedAt: '',
      lastEventVersion: version,
    });
  }

  @Project(IdeaEventNames.Renamed)
  async renamed({data, streamId, version}: PersistedEvent<IdeaModels.IdeaRenamedData>) {
    const {title} = data;
    const collection = await this.ideaCollection();
    await collection.findOneAndUpdate({id: streamId}, {$set: {title, lastEventVersion: version}});
  }

  @Project(IdeaEventNames.DescriptionEdited)
  async descriptionEdited({
    version,
    streamId,
    data,
  }: PersistedEvent<IdeaModels.IdeaDescriptionEditedData>) {
    const {description} = data;
    const collection = await this.ideaCollection();
    await collection.findOneAndUpdate(
      {id: streamId},
      {$set: {description, lastEventVersion: version}},
    );
  }

  @Project(IdeaEventNames.TagsAdded)
  async tagsAdded({version, streamId, data}: PersistedEvent<IdeaModels.IdeaTagsAddedData>) {
    const {tags} = data;
    const collection = await this.ideaCollection();
    await collection.findOneAndUpdate(
      {id: streamId},
      {$push: {tags: {$each: tags}}, $set: {lastEventVersion: version}},
    );
  }

  @Project(IdeaEventNames.TagsRemoved)
  async tagsRemoved({version, streamId, data}: PersistedEvent<IdeaModels.IdeaTagsRemovedData>) {
    const {tags} = data;
    const collection = await this.ideaCollection();
    await collection.findOneAndUpdate(
      {id: streamId},
      {$pull: {fruits: {$in: tags}}, $set: {lastEventVersion: version}},
    );
  }

  @Project(IdeaEventNames.Published)
  async published({version, streamId, data}: PersistedEvent<IdeaModels.IdeaPublishedData>) {
    const {publishedAt} = data;
    const collection = await this.ideaCollection();
    await collection.findOneAndUpdate(
      {id: streamId},
      {$set: {publishedAt, lastEventVersion: version}},
    );
  }

  @Project(IdeaEventNames.Deleted)
  async deleted({version, streamId, data}: PersistedEvent<IdeaModels.IdeaDeletedData>) {
    const {deletedAt} = data;
    const collection = await this.ideaCollection();
    await collection.findOneAndUpdate(
      {id: streamId},
      {$set: {deletedAt, lastEventVersion: version}},
    );
  }

  private async ideaCollection() {
    const db = await this.db();
    return db.collection<IdeaModels.IdeaModel>(this.collectionName);
  }
}
