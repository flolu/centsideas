import {injectable, inject} from 'inversify';

import {EventListener, PersistedEvent} from '@centsideas/event-sourcing2';
import {EventTopics, IdeaEventNames} from '@centsideas/enums';
import {Logger} from '@centsideas/utils';
import {GlobalEnvironment} from '@centsideas/environment';
import {IdeaModels} from '@centsideas/models';
import {
  RPC_TYPES,
  RpcClientFactory,
  RpcClient,
  IdeaEventStore,
  deserializeEvent,
} from '@centsideas/rpc';
import {IdeaDetailsEnvironment} from './idea-details.environment';

@injectable()
export class IdeaDetailsProjector {
  bookmark = 0;
  documents: Record<string, IdeaModels.IdeaDetailModel> = {};

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
    @inject(RPC_TYPES.RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');

    this.listen();
    this.replay();
  }

  created({id, userId, createdAt}: IdeaModels.IdeaCreatedData) {
    this.documents[id] = {
      id,
      userId,
      createdAt,
      title: '',
      description: '',
      tags: [],
      publishedAt: '',
      deletedAt: '',
    };
  }

  deleted({id, deletedAt}: IdeaModels.IdeaDeletedData) {
    this.documents[id].deletedAt = deletedAt;
  }

  descriptionEdited({id, description}: IdeaModels.IdeaDescriptionEditedData) {
    this.documents[id].description = description;
  }

  published({id, publishedAt}: IdeaModels.IdeaPublishedData) {
    this.documents[id].publishedAt = publishedAt;
  }

  renamed({id, title}: IdeaModels.IdeaRenamedData) {
    this.documents[id].title = title;
  }

  tagsAdded({id, tags}: IdeaModels.IdeaTagsAddedData) {
    this.documents[id].tags.push(...tags);
  }

  tagsRemoved({id, tags}: IdeaModels.IdeaTagsRemovedData) {
    this.documents[id].tags = this.documents[id].tags.filter(t => !tags.includes(t));
  }

  private listen() {
    this.eventListener.listen(EventTopics.Idea, 'centsideas-idea-details').subscribe(message => {
      const eventName = message.headers?.eventName.toString();
      if (!eventName) return;

      const value: PersistedEvent = JSON.parse(message.value.toString());
      this.trigger(value);
    });
  }

  private trigger(event: PersistedEvent) {
    if (event.sequence <= this.bookmark) return;

    const data = event.data as any;
    this.bookmark = event.sequence;

    switch (event.name) {
      case IdeaEventNames.Created:
        return this.created(data);
      case IdeaEventNames.Deleted:
        return this.deleted(data);
      case IdeaEventNames.DescriptionEdited:
        return this.descriptionEdited(data);
      case IdeaEventNames.Published:
        return this.published(data);
      case IdeaEventNames.Renamed:
        return this.renamed(data);
      case IdeaEventNames.TagsAdded:
        return this.tagsAdded(data);
      case IdeaEventNames.TagsRemoved:
        return this.tagsRemoved(data);
    }
  }

  private replay() {
    this.ideaEventStoreRpc.client.getEvents({from: this.bookmark}).then(({events}) => {
      if (!events) return;

      const unknownEvents = events.map(deserializeEvent);
      this.logger.info('replay', unknownEvents.length, 'events');

      unknownEvents.forEach(event => {
        if (event.sequence <= this.bookmark) return;
        this.trigger(event);
      });
    });
  }
}
