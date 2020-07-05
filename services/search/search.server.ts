import {injectable, inject} from 'inversify';
import * as http from 'http';

import * as elasticsearch from '@elastic/elasticsearch';
import {EventsHandler, EventHandler} from '@centsideas/event-sourcing';

import {IdeaEventNames} from '@centsideas/enums';
import {PersistedEvent, IdeaModels} from '@centsideas/models';
import {IdeaId} from '@centsideas/types';
import {Logger} from '@centsideas/utils';
import {RpcMethod, RpcServer, RPC_SERVER_FACTORY, RpcServerFactory} from '@centsideas/rpc';
import {SearchService, SearchQueries} from '@centsideas/schemas';

import {SearchConfig} from './search.config';
import {IdeaReadAdapter} from './idea-read.adapter';

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
    private ideaReadAdapter: IdeaReadAdapter,
    private _logger: Logger,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    super();
    http.createServer((_, res) => res.writeHead(200).end()).listen(3000);
  }

  @EventHandler(IdeaEventNames.Published)
  // TODO catch errors and don't ack kafka message
  async ideaPublished(event: PersistedEvent<IdeaModels.IdeaPublishedData>) {
    this._logger.info('idea published', event);
    // TODO make sure is sync
    const {id, title, tags, description} = await this.ideaReadAdapter.getById(
      IdeaId.fromString(event.streamId),
    );
    this._logger.info('fetched idea from idea read`', id, title, tags, description);
    await this.client.index({
      index: this.ideaIndex,
      body: {id, title, tags, description},
    });
    this._logger.info('saved idea to index');
  }

  /*  TODO  @EventHandler(IdeaEventNames.Renamed)
  async ideaRenamed() {}

  @EventHandler(IdeaEventNames.DescriptionEdited)
  async ideaDescriptionEdited() {}

  @EventHandler(IdeaEventNames.TagsAdded)
  async ideaTagsAdded() {}

  @EventHandler(IdeaEventNames.TagsRemoved)
  async ideaTagsRemoved() {}

  @EventHandler(IdeaEventNames.Deleted)
  async ideaDeleted() {} */

  @RpcMethod(SearchService)
  async searchIdeas({input}: SearchQueries.SearchIdeaPayload) {
    await this.client.indices.refresh({index: this.ideaIndex});
    const {body} = await this.client.search({
      index: this.ideaIndex,
      body: {
        query: {
          match: {title: input},
        },
      },
    });
    const hits = body.hits.hits.map((h: any) => h._source);
    return {hits, max_score: body.max_score};
  }
}
