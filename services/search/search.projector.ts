import {injectable, inject} from 'inversify';
import * as asynRetry from 'async-retry';

import {ElasticProjector, EventProjector} from '@centsideas/event-sourcing';
import {IdeaEventNames, EventTopics} from '@centsideas/enums';
import {PersistedEvent, IdeaModels} from '@centsideas/models';
import {Logger} from '@centsideas/utils';
import {
  RpcMethod,
  RpcServer,
  RPC_SERVER_FACTORY,
  RpcServerFactory,
  RpcClient,
  RPC_CLIENT_FACTORY,
  RpcClientFactory,
  deserializeEvent,
} from '@centsideas/rpc';
import {SearchService, SearchQueries, IdeaCommandsService, IdeaCommands} from '@centsideas/schemas';

import {SearchConfig} from './search.config';

@injectable()
export class SearchProjector extends ElasticProjector {
  elasticNode = this.config.get('search.elasticsearch.node');
  elasticUserPassword = process.env.elasticsearch_password;
  elasticTlsCertificate = process.env.elasticsearch_certificate || '';
  index = 'ideas';
  consumerGroupName = 'centsideas.search.ideas';
  topic = EventTopics.Idea;
  async initialize() {
    //
  }

  private ideaEventStoreRpc: RpcClient<IdeaCommands.Service> = this.rpcFactory({
    host: this.config.get('idea.rpc.host'),
    service: IdeaCommandsService,
    port: this.config.getNumber('idea.rpc.port'),
  });
  private _rpcServer: RpcServer = this.rpcServerFactory({
    services: [SearchService],
    handlerClassInstance: this,
    port: this.config.getNumber('search.rpc.port'),
  });

  constructor(
    private config: SearchConfig,
    private _logger: Logger,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {
    super();
  }

  async getEvents(after: number) {
    const result = await asynRetry(() => this.ideaEventStoreRpc.client.getEvents({after}), {
      minTimeout: 500,
      retries: 5,
    });
    if (!result.events) return [];
    return result.events.map(deserializeEvent);
  }

  @EventProjector(IdeaEventNames.Created)
  async created({data, streamId, version, insertedAt}: PersistedEvent<IdeaModels.IdeaCreatedData>) {
    const {userId, createdAt} = data;
    const client = await this.getClient();
    await client.index({
      index: this.index,
      body: {
        id: streamId,
        userId,
        createdAt,
        title: undefined,
        description: undefined,
        tags: [],
        publishedAt: undefined,
        deletedAt: undefined,
        lastEventVersion: version,
        updatedAt: insertedAt,
      },
      id: streamId,
    });
  }

  @EventProjector(IdeaEventNames.Renamed)
  async ideaRenamed({
    version,
    insertedAt,
    data,
    streamId,
  }: PersistedEvent<IdeaModels.IdeaRenamedData>) {
    const client = await this.getClient();
    await client.update({
      index: this.index,
      id: streamId,
      body: {
        doc: {
          title: data.title,
          updatedAt: insertedAt,
          lastEventVersion: version,
        },
      },
    });
  }

  @EventProjector(IdeaEventNames.DescriptionEdited)
  async ideaDescriptionEdited({
    version,
    insertedAt,
    data,
    streamId,
  }: PersistedEvent<IdeaModels.IdeaDescriptionEditedData>) {
    const client = await this.getClient();
    await client.update({
      index: this.index,
      id: streamId,
      body: {
        doc: {
          description: data.description,
          updatedAt: insertedAt,
          lastEventVersion: version,
        },
      },
    });
  }

  @EventProjector(IdeaEventNames.TagsAdded)
  async ideaTagsAdded({
    version,
    insertedAt,
    data,
    streamId,
  }: PersistedEvent<IdeaModels.IdeaTagsAddedData>) {
    const client = await this.getClient();
    const {body} = await client.get({index: this.index, id: streamId});
    const source = body._source;
    await client.update({
      index: this.index,
      id: streamId,
      body: {
        doc: {
          tags: [...source.tags, ...data.tags],
          updatedAt: insertedAt,
          lastEventVersion: version,
        },
      },
    });
  }

  @EventProjector(IdeaEventNames.TagsRemoved)
  async ideaTagsRemoved({
    version,
    insertedAt,
    data,
    streamId,
  }: PersistedEvent<IdeaModels.IdeaTagsRemovedData>) {
    const client = await this.getClient();
    const {body} = await client.get({index: this.index, id: streamId});
    const source = body._source;
    await client.update({
      index: this.index,
      id: streamId,
      body: {
        doc: {
          tags: source.tags.filter((t: string) => !data.tags.includes(t)),
          updatedAt: insertedAt,
          lastEventVersion: version,
        },
      },
    });
  }

  @EventProjector(IdeaEventNames.Published)
  async ideaPublished({
    version,
    insertedAt,
    streamId,
  }: PersistedEvent<IdeaModels.IdeaPublishedData>) {
    const client = await this.getClient();
    await client.update({
      index: this.index,
      id: streamId,
      body: {
        doc: {
          publishedAt: insertedAt,
          lastEventVersion: version,
        },
      },
    });
  }

  @EventProjector(IdeaEventNames.Deleted)
  async ideaDeleted(event: PersistedEvent<IdeaModels.IdeaDeletedData>) {
    const client = await this.getClient();
    await client.delete({index: this.index, id: event.streamId});
  }

  @RpcMethod(SearchService)
  async searchIdeas({input}: SearchQueries.SearchIdeaPayload) {
    const client = await this.getClient();
    // FIXME ideas with higher scores should be ranked higher
    const {body} = await client.search({
      index: this.index,
      body: {
        query: {
          bool: {
            should: [
              {
                match: {
                  title: {
                    query: input,
                    operator: 'and',
                    fuzziness: 'auto',
                    boost: 1,
                  },
                },
              },
              {
                match: {
                  description: {
                    query: input,
                    operator: 'and',
                    fuzziness: 'auto',
                  },
                },
              },
              {
                match: {
                  tags: {
                    query: input,
                    operator: 'and',
                    fuzziness: 'auto',
                    boost: 0.5,
                  },
                },
              },
              /**
               * boost ideas, that have been published in the
               * last 10 days
               */
              {
                range: {
                  publishedAt: {
                    boost: 1,
                    gte: new Date(Number(new Date()) - 1000 * 60 * 60 * 24 * 10),
                  },
                },
              },
            ],
          },
        },
      },
    });
    this._logger.info(body.hits);
    return {hits: body.hits.hits.map((h: any) => ({...h._source, score: h._score}))};
  }
}
