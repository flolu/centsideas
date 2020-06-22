import {injectable, inject} from 'inversify';
import * as http from 'http';

import {RPC_SERVER_FACTORY, RpcServerFactory, RpcServer, RpcMethod} from '@centsideas/rpc';
import {UserReadService, UserReadQueries} from '@centsideas/schemas';
import {UserId, Email} from '@centsideas/types';

import {PrivateUserRepository} from './private-user.repository';
import {UserRepository} from './user.repository';

@injectable()
export class UserReadServer implements UserReadQueries.Service {
  private rpcServer: RpcServer = this.rpcServerFactory({
    services: [UserReadService],
    handlerClassInstance: this,
  });

  constructor(
    private repository: UserRepository,
    private privateRepository: PrivateUserRepository,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);
  }

  @RpcMethod(UserReadService)
  getById({id}: UserReadQueries.GetById) {
    return this.repository.getById(UserId.fromString(id));
  }

  @RpcMethod(UserReadService)
  async getAll({}: UserReadQueries.GetUsers) {
    const users = await this.repository.getAll();
    return {users};
  }

  @RpcMethod(UserReadService)
  async getMe({id}: UserReadQueries.GetMe) {
    const userId = UserId.fromString(id);
    const privateUser = await this.privateRepository.getPrivateUserById(userId);
    const user = await this.repository.getById(userId);
    return {private: privateUser, public: user};
  }

  @RpcMethod(UserReadService)
  getByEmail({email}: UserReadQueries.GetByEmail) {
    // NOW sync projector before fetch
    return this.privateRepository.getPrivateUserByEmail(Email.fromString(email));
  }
}
