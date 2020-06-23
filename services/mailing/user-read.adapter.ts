import {injectable, inject} from 'inversify';

import {RPC_CLIENT_FACTORY, RpcClientFactory, RpcClient} from '@centsideas/rpc';
import {UserReadService, UserReadQueries} from '@centsideas/schemas';
import {UserId} from '@centsideas/types';

import {MailingConfig} from './mailing.config';

@injectable()
export class UserReadAdapter {
  private userReadRpc: RpcClient<UserReadQueries.Service> = this.rpcClientFactory({
    host: this.config.get('user-read.rpc.host'),
    service: UserReadService,
    port: this.config.getNumber('user-read.rpc.port'),
  });

  constructor(
    private config: MailingConfig,
    @inject(RPC_CLIENT_FACTORY) private rpcClientFactory: RpcClientFactory,
  ) {}

  getEmailById(user: UserId) {
    return this.userReadRpc.client.getEmailById({id: user.toString()});
  }
}
