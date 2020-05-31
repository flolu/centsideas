import {injectable, inject} from 'inversify';
import * as asynRetry from 'async-retry';

import {MongoProjector, EventListener, Project} from '@centsideas/event-sourcing';
import {RpcClient, deserializeEvent, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';
import {EventTopics, IdeaEventNames} from '@centsideas/enums';
import {IdeaModels, PersistedEvent} from '@centsideas/models';
import {IdeaCommands, IdeaCommandsService} from '@centsideas/schemas';

import {IdeaReadEnvironment} from './idea-read.environment';

@injectable()
export class IdeaProjector extends MongoProjector {
  private consumerGroupName = 'centsideas-idea-read';
  private ideaEventStoreRpc: RpcClient<IdeaCommands> = this.rpcFactory(
    this.env.ideaRpcHost,
    IdeaCommandsService,
  );
  databaseUrl = this.env.ideaReadDatabaseUrl;
  databaseName = this.env.ideaReadDatabaseName;

  constructor(
    private eventListener: EventListener,
    private env: IdeaReadEnvironment,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {
    super();
  }

  async initialize() {
    const collection = await this.ideaCollection();
    await collection.createIndex({id: 1}, {unique: true});
  }

  eventStream = this.eventListener.listen(EventTopics.Idea, this.consumerGroupName);

  async getEvents(from: number) {
    const result = await asynRetry(() => this.ideaEventStoreRpc.client.getEvents({from}), {
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
    return db.collection<IdeaModels.IdeaModel>(this.env.ideaCollectionName);
  }
}
