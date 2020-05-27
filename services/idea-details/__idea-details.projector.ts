import {injectable, inject} from 'inversify';

import {EventListener, PersistedEvent, Projector} from '@centsideas/event-sourcing2';
import {EventTopics, IdeaEventNames} from '@centsideas/enums';
import {Logger} from '@centsideas/utils';
import {GlobalEnvironment} from '@centsideas/environment';
import {IdeaModels} from '@centsideas/models';
import {
  RPC_CLIENT_FACTORY,
  RpcClientFactory,
  RpcClient,
  IdeaEventStore,
  deserializeEvent,
} from '@centsideas/rpc';
import {IdeaDetailsEnvironment} from './idea-details.environment';
import {IdeaNotFound} from './errors/idea-not-found';

// NOW delete after new works and added all TODOS
// TODO switch to persistent database and use in mem only for testing
// TODO generic projector base class?
/* @injectable()
export class IdeaDetailsProjector implements Projector {
  private bookmark = 0;
  private documents: Record<string, IdeaModels.IdeaDetailModel> = {};

  private ideaEventStoreRpc: RpcClient<IdeaEventStore> = this.rpcFactory(
    this.env.ideaRpcHost,
    'idea',
    'IdeaEventStore',
    this.env.ideaEventStoreRpcPort,
  );

  constructor(
    private eventListener: EventListener,
    private logger: Logger,
    private env: IdeaDetailsEnvironment,
    private globalEnv: GlobalEnvironment,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');

    this.replay();
    this.listen();
  }

  // TODO consider triggering replay before returning the document (or after, depending on the importance of consistency)
  // TODO querying is probably not a task for the projector
  async getById(id: string, userId?: string) {
    const idea = this.documents[id];
    if (!idea) throw new IdeaNotFound(id);
    if (!idea.publishedAt && idea.userId !== userId) throw new IdeaNotFound(id);
    if (idea.deletedAt && idea.userId !== userId) throw new IdeaNotFound(id);
    return idea;
  }

  listen() {
    this.eventListener.listen(EventTopics.Idea, 'centsideas-idea-details').subscribe(message => {
      const eventName = message.headers?.eventName.toString();
      if (!eventName) return;

      const value: PersistedEvent = JSON.parse(message.value.toString());
      this.trigger(value);
    });
  }

  async trigger(event: PersistedEvent) {
    const bookmark = await this.getBookmark();
    if (event.sequence !== bookmark + 1) return;
    const data = event.data as any;

    // TODO do this AFTER applying event?
    await this.increaseBookmark();

    // FIXME better approach, that does not require switch (e.g. like @Apply decorator in aggregate classes)
    switch (event.name) {
      case IdeaEventNames.Created:
        return this.created(data, event.version);
      case IdeaEventNames.Deleted:
        return this.deleted(data, event.version);
      case IdeaEventNames.DescriptionEdited:
        return this.descriptionEdited(data, event.version);
      case IdeaEventNames.Published:
        return this.published(data, event.version);
      case IdeaEventNames.Renamed:
        return this.renamed(data, event.version);
      case IdeaEventNames.TagsAdded:
        return this.tagsAdded(data, event.version);
      case IdeaEventNames.TagsRemoved:
        return this.tagsRemoved(data, event.version);
    }
  }

  async getEvents(from: number) {
    const result = await this.ideaEventStoreRpc.client.getEvents({from});
    return result.events.map(deserializeEvent);
  }

  async replay() {
    const bookmark = await this.getBookmark();
    const events = await this.getEvents(bookmark);

    if (!events) return;
    const start = Number(new Date());

    this.logger.info('replay', events.length, 'events');
    this.logger.info('current bookmark is', bookmark);

    await Promise.all(events.map(this.trigger));

    const end = Number(new Date());
    this.logger.info('finished replaying', events.length, 'events in', end - start, 'ms');
    const updatedBookmark = await this.getBookmark();
    this.logger.info('new bookmark is', updatedBookmark);
  }

  async getBookmark() {
    return this.bookmark;
  }

  async increaseBookmark() {
    this.bookmark++;
  }

  private created({id, userId, createdAt}: IdeaModels.IdeaCreatedData, version: number) {
    this.documents[id] = {
      id,
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

  private deleted({id, deletedAt}: IdeaModels.IdeaDeletedData, version: number) {
    if (!this.documents[id]) return;
    this.documents[id].deletedAt = deletedAt;
    this.documents[id].lastEventVersion = version;
  }

  private descriptionEdited(
    {id, description}: IdeaModels.IdeaDescriptionEditedData,
    version: number,
  ) {
    if (!this.documents[id]) return;
    this.documents[id].description = description;
    this.documents[id].lastEventVersion = version;
  }

  private published({id, publishedAt}: IdeaModels.IdeaPublishedData, version: number) {
    if (!this.documents[id]) return;
    this.documents[id].publishedAt = publishedAt;
    this.documents[id].lastEventVersion = version;
  }

  private renamed({id, title}: IdeaModels.IdeaRenamedData, version: number) {
    if (!this.documents[id]) return;
    this.documents[id].title = title;
    this.documents[id].lastEventVersion = version;
  }

  private tagsAdded({id, tags}: IdeaModels.IdeaTagsAddedData, version: number) {
    if (!this.documents[id]) return;
    this.documents[id].tags.push(...tags);
    this.documents[id].lastEventVersion = version;
  }

  private tagsRemoved({id, tags}: IdeaModels.IdeaTagsRemovedData, version: number) {
    if (!this.documents[id]) return;
    this.documents[id].tags = this.documents[id].tags.filter(t => !tags.includes(t));
    this.documents[id].lastEventVersion = version;
  }
}
 */
