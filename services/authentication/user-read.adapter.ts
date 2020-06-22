import {injectable, inject} from 'inversify';

import {Email} from '@centsideas/types';
import {RpcClient, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';
import {UserReadQueries, UserReadService} from '@centsideas/schemas';
import {RpcStatus} from '@centsideas/enums';

import {AuthenticationConfig} from './authentication.config';

@injectable()
export class UserReadAdapter {
  private userReadRpc: RpcClient<UserReadQueries.Service> = this.rpcClientFactory({
    host: this.config.get('user-read.rpc.host'),
    service: UserReadService,
    port: this.config.getNumber('user-read.rpc.port'),
  });

  constructor(
    private config: AuthenticationConfig,
    @inject(RPC_CLIENT_FACTORY) private rpcClientFactory: RpcClientFactory,
  ) {}

  async getUserByEmail(email: Email) {
    try {
      return await this.userReadRpc.client.getByEmail({email: email.toString()});
    } catch (error) {
      if (error.code === RpcStatus.NOT_FOUND) return null;
      throw error;
    }
  }
}
