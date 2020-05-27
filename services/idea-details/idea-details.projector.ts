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

import {IdeaDetailsEnvironment} from './idea-details.environment';
import {IdeaNotFound} from './errors/idea-not-found';

@injectable()
export class IdeaDetailsProjector extends InMemoryProjector<IdeaModels.IdeaDetailModel> {
  private consumerGroupName = 'centsideas-idea-details';
  private ideaEventStoreRpc: RpcClient<IdeaEventStore> = this.rpcFactory(
    this.env.ideaRpcHost,
    'idea',
    'IdeaEventStore',
    this.env.ideaEventStoreRpcPort,
  );

  constructor(
    private eventListener: EventListener,
    private env: IdeaDetailsEnvironment,
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
    const result = await this.ideaEventStoreRpc.client.getEvents({from});
    if (!result.events) return [];
    return result.events.map(deserializeEvent);
  }

  @Project(IdeaEventNames.Created)
  created(event: PersistedEvent) {
    this.logger.info('created @Project', event, this.env);
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
}
