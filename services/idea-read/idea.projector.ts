import {injectable, inject} from 'inversify';
import {map, filter} from 'rxjs/operators';

import {
  InMemoryProjector,
  EventListener,
  PersistedEvent,
  Project,
} from '@centsideas/event-sourcing2';
import {IdeaModels} from '@centsideas/models';
import {
  deserializeEvent,
  RpcClientFactory,
  RPC_CLIENT_FACTORY,
  RpcClient,
  IdeaEventStore,
} from '@centsideas/rpc';
import {EventTopics, IdeaEventNames} from '@centsideas/enums';

import {IdeaReadEnvironment} from './idea-read.environment';
import * as Errors from './idea-read.errors';

@injectable()
export class IdeaProjector extends InMemoryProjector<IdeaModels.IdeaDetailModel> {
  private consumerGroupName = 'centsideas-idea-read';
  private ideaEventStoreRpc: RpcClient<IdeaEventStore> = this.rpcFactory(
    this.env.ideaRpcHost,
    'idea',
    'IdeaEventStore',
    this.env.ideaEventStoreRpcPort,
  );

  constructor(
    private eventListener: EventListener,
    private env: IdeaReadEnvironment,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {
    super();
  }

  listen() {
    return this.eventListener.listen(EventTopics.Idea, this.consumerGroupName).pipe(
      filter(message => !!message.headers?.eventName.toString()),
      map(message => {
        // TODO util for deserialzing kafka event message
        const value: PersistedEvent = JSON.parse(message.value.toString());
        return value;
      }),
    );
  }

  async getEvents(from: number) {
    // TODO retry until got response
    const result = await this.ideaEventStoreRpc.client.getEvents({from});
    if (!result.events) return [];
    return result.events.map(deserializeEvent);
  }

  /**
   * TODO current design doesn't allow to switch between in memory and other storage
   * would be better to design like a pure reudcer function (state, event) => newState
   */
  @Project(IdeaEventNames.Created)
  async created({data, streamId, version}: PersistedEvent<IdeaModels.IdeaCreatedData>) {
    const {userId, createdAt} = data;
    this.documents[streamId] = {
      id: streamId,
      userId,
      createdAt,
      title: '',
      description: '',
      tags: [],
      publishedAt: '',
      deletedAt: '',
      lastEventVersion: version,
    };
  }

  @Project(IdeaEventNames.Renamed)
  async renamed({data, streamId, version}: PersistedEvent<IdeaModels.IdeaRenamedData>) {
    const {title} = data;
    this.documents[streamId].title = title;
    this.documents[streamId].lastEventVersion = version;
  }

  @Project(IdeaEventNames.DescriptionEdited)
  async descriptionEdited({
    version,
    streamId,
    data,
  }: PersistedEvent<IdeaModels.IdeaDescriptionEditedData>) {
    const {description} = data;
    this.documents[streamId].description = description;
    this.documents[streamId].lastEventVersion = version;
  }

  @Project(IdeaEventNames.TagsAdded)
  async tagsAdded({version, streamId, data}: PersistedEvent<IdeaModels.IdeaTagsAddedData>) {
    const {tags} = data;
    this.documents[streamId].tags.push(...tags);
    this.documents[streamId].lastEventVersion = version;
  }

  @Project(IdeaEventNames.TagsRemoved)
  async tagsRemoved({version, streamId, data}: PersistedEvent<IdeaModels.IdeaTagsRemovedData>) {
    const {tags} = data;
    this.documents[streamId].tags = this.documents[streamId].tags.filter(t => !tags.includes(t));
    this.documents[streamId].lastEventVersion = version;
  }

  @Project(IdeaEventNames.Published)
  async published({version, streamId, data}: PersistedEvent<IdeaModels.IdeaPublishedData>) {
    const {publishedAt} = data;
    this.documents[streamId].publishedAt = publishedAt;
    this.documents[streamId].lastEventVersion = version;
  }

  @Project(IdeaEventNames.Deleted)
  async deleted({version, streamId, data}: PersistedEvent<IdeaModels.IdeaDeletedData>) {
    const {deletedAt} = data;
    this.documents[streamId].deletedAt = deletedAt;
    this.documents[streamId].lastEventVersion = version;
  }

  // TODO consider triggering replay before returning the document (or after, depending on the importance of consistency)
  // TODO querying is probably not a task for the projector
  async getById(id: string, userId?: string) {
    const idea = this.documents[id];
    if (!idea) throw new Errors.IdeaNotFound(id);
    if (!idea.publishedAt && idea.userId !== userId) throw new Errors.IdeaNotFound(id);
    if (idea.deletedAt && idea.userId !== userId) throw new Errors.IdeaNotFound(id);
    return idea;
  }
}
