import {injectable, inject} from 'inversify';

import {RPC_CLIENT_FACTORY, RpcClientFactory, RpcClient} from '@centsideas/rpc';
import {UserReadService, UserReadQueries} from '@centsideas/schemas';
import {Username} from '@centsideas/types';

import {UserConfig} from './user.config';
import {RpcStatus} from '@centsideas/enums';

@injectable()
export class UserReadAdapter {
  private userReadRpc: RpcClient<UserReadQueries.Service> = this.rpcClientFactory({
    host: this.config.get('user-read.rpc.host'),
    service: UserReadService,
    port: this.config.getNumber('user-read.rpc.port'),
  });

  constructor(
    private config: UserConfig,
    @inject(RPC_CLIENT_FACTORY) private rpcClientFactory: RpcClientFactory,
  ) {}

  async getUserByUsername(username: Username) {
    try {
      return await this.userReadRpc.client.getByUsername({username: username.toString()});
    } catch (error) {
      if (error.code === RpcStatus.NOT_FOUND) return null;
      throw error;
    }
  }
}
