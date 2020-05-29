import {injectable, inject} from 'inversify';

import {MongoProjector, EventListener, PersistedEvent, Project} from '@centsideas/event-sourcing2';
import {
  RpcClient,
  IdeaEventStore,
  RpcClientFactory,
  RPC_CLIENT_FACTORY,
  deserializeEvent,
} from '@centsideas/rpc';
import {EventTopics, IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

import {IdeaReadEnvironment} from './idea-read.environment';
import * as Errors from './idea-read.errors';

@injectable()
export class IdeaProjector extends MongoProjector {
  private consumerGroupName = 'centsideas-idea-read';
  private ideaEventStoreRpc: RpcClient<IdeaEventStore> = this.rpcFactory(
    this.env.ideaRpcHost,
    // TODO dont hardcode those string!
    'idea',
    'IdeaEventStore',
    this.env.ideaEventStoreRpcPort,
  );
  private ideaCollectionName = 'ideas';
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
    // TODO retry until got response
    const result = await this.ideaEventStoreRpc.client.getEvents({from});
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
    return db.collection<IdeaModels.IdeaModel>(this.ideaCollectionName);
  }

  // TODO consider triggering replay before returning the document (or after, depending on the importance of consistency)
  // TODO querying is probably not a task for the projector
  async getById(id: string, userId?: string) {
    const collection = await this.ideaCollection();
    const idea = await collection.findOne({id});
    if (!idea) throw new Errors.IdeaNotFound(id);
    if (!idea.publishedAt && idea.userId !== userId) throw new Errors.IdeaNotFound(id);
    if (idea.deletedAt && idea.userId !== userId) throw new Errors.IdeaNotFound(id);
    return idea;
  }
  async getAll() {
    const collection = await this.ideaCollection();
    const result = await collection.find({
      publishedAt: {$exists: true, $ne: ''},
      deletedAt: '',
    });
    return result.toArray();
  }
}
