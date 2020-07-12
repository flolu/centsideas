import {injectable, inject} from 'inversify';
import * as http from 'http';
import * as elasticsearch from '@elastic/elasticsearch';

import {EventsHandler, EventHandler} from '@centsideas/event-sourcing';
import {IdeaEventNames} from '@centsideas/enums';
import {PersistedEvent, IdeaModels} from '@centsideas/models';
import {Logger} from '@centsideas/utils';
import {RpcMethod, RpcServer, RPC_SERVER_FACTORY, RpcServerFactory} from '@centsideas/rpc';
import {SearchService, SearchQueries} from '@centsideas/schemas';

import {SearchConfig} from './search.config';

@injectable()
export class SearchServer extends EventsHandler {
  client = new elasticsearch.Client({node: this.config.get('search.elasticsearch.node')});
  private readonly ideaIndex = 'ideas';
  consumerGroupName = 'centsideas.search';
  private _rpcServer: RpcServer = this.rpcServerFactory({
    services: [SearchService],
    handlerClassInstance: this,
    port: this.config.getNumber('search.rpc.port'),
  });

  constructor(
    private config: SearchConfig,
    private _logger: Logger,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    super();
    // FIXME check if connected to elasticsearch client to determinte server status
    http
      .createServer(async (_, res) => res.writeHead((await this.healthcheck()) ? 200 : 500).end())
      .listen(3000);
  }

  @EventHandler(IdeaEventNames.Created)
  async created({data, streamId, version, insertedAt}: PersistedEvent<IdeaModels.IdeaCreatedData>) {
    const {userId, createdAt} = data;
    await this.client.index({
      index: this.ideaIndex,
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

  @EventHandler(IdeaEventNames.Renamed)
  async ideaRenamed(event: PersistedEvent<IdeaModels.IdeaRenamedData>) {
    await this.client.update({
      index: this.ideaIndex,
      id: event.streamId,
      body: {
        doc: {
          title: event.data.title,
          updatedAt: event.insertedAt,
        },
      },
    });
  }

  @EventHandler(IdeaEventNames.DescriptionEdited)
  async ideaDescriptionEdited(event: PersistedEvent<IdeaModels.IdeaDescriptionEditedData>) {
    await this.client.update({
      index: this.ideaIndex,
      id: event.streamId,
      body: {
        doc: {
          description: event.data.description,
          updatedAt: event.insertedAt,
        },
      },
    });
  }

  @EventHandler(IdeaEventNames.TagsAdded)
  async ideaTagsAdded(event: PersistedEvent<IdeaModels.IdeaTagsAddedData>) {
    const {body} = await await this.client.get({index: this.ideaIndex, id: event.streamId});
    await this.client.update({
      index: this.ideaIndex,
      id: event.streamId,
      body: {
        doc: {
          tags: [body.tags, ...event.data.tags],
          updatedAt: event.insertedAt,
        },
      },
    });
  }

  @EventHandler(IdeaEventNames.TagsRemoved)
  async ideaTagsRemoved(event: PersistedEvent<IdeaModels.IdeaTagsRemovedData>) {
    const {body} = await await this.client.get({index: this.ideaIndex, id: event.streamId});
    await this.client.update({
      index: this.ideaIndex,
      id: event.streamId,
      body: {
        doc: {
          tags: body.tags.filter((t: string) => !event.data.tags.includes(t)),
          updatedAt: event.insertedAt,
        },
      },
    });
  }

  // FIXME instaead of fetching idea from read model... make search the read model
  @EventHandler(IdeaEventNames.Published)
  // TODO catch errors and don't ack kafka message
  async ideaPublished(event: PersistedEvent<IdeaModels.IdeaPublishedData>) {
    await this.client.update({
      index: this.ideaIndex,
      id: event.streamId,
      body: {
        doc: {
          publishedAt: event.insertedAt,
        },
      },
    });
  }

  @EventHandler(IdeaEventNames.Deleted)
  async ideaDeleted(event: PersistedEvent<IdeaModels.IdeaDeletedData>) {
    await this.client.delete({index: this.ideaIndex, id: event.streamId});
  }

  @RpcMethod(SearchService)
  async searchIdeas({input}: SearchQueries.SearchIdeaPayload) {
    // FIXME ideas with higher scores should be ranked higher
    const {body} = await this.client.search({
      index: this.ideaIndex,
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

  private async healthcheck(): Promise<boolean> {
    try {
      const health = await this.client.cluster.health();
      this._logger.info('healthcheck', health);
      return !!health && this.connected;
    } catch (err) {
      this._logger.error(err);
      return false;
    }
  }
}
