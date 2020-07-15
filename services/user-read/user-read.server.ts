import {injectable, inject} from 'inversify';

import {RPC_SERVER_FACTORY, RpcServerFactory, RpcServer, RpcMethod} from '@centsideas/rpc';
import {UserReadService, UserReadQueries} from '@centsideas/schemas';
import {UserId, Email, Username} from '@centsideas/types';
import {ServiceServer} from '@centsideas/utils';

import {PrivateUserRepository} from './private-user.repository';
import {UserRepository} from './user.repository';
import {UserProjector} from './user.projector';
import {PrivateUserProjector} from './private-user.projector';

@injectable()
export class UserReadServer extends ServiceServer implements UserReadQueries.Service {
  private rpcServer: RpcServer = this.rpcServerFactory({
    services: [UserReadService],
    handlerClassInstance: this,
  });

  constructor(
    private repository: UserRepository,
    private privateRepository: PrivateUserRepository,
    private projector: UserProjector,
    private privateUserProjector: PrivateUserProjector,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    super();
  }

  @RpcMethod(UserReadService)
  getById({id}: UserReadQueries.GetById) {
    return this.repository.getById(UserId.fromString(id));
  }

  @RpcMethod(UserReadService)
  async getAll() {
    const users = await this.repository.getAll();
    return {users};
  }

  @RpcMethod(UserReadService)
  async getMe({id}: UserReadQueries.GetMe) {
    const userId = UserId.fromString(id);
    const privateUser = await this.privateRepository.getById(userId);
    const user = await this.repository.getById(userId);
    return {private: privateUser, public: user};
  }

  @RpcMethod(UserReadService)
  async getByEmail({email}: UserReadQueries.GetByEmail) {
    await this.privateUserProjector.replay();
    return this.privateRepository.getByEmail(Email.fromString(email));
  }

  @RpcMethod(UserReadService)
  async getByUsername({username}: UserReadQueries.GetByUsername) {
    await this.privateUserProjector.replay();
    return this.repository.getByUsername(Username.fromString(username));
  }

  @RpcMethod(UserReadService)
  async getEmailById({id}: UserReadQueries.GetById) {
    const privateUser = await this.privateRepository.getEmailById(UserId.fromString(id));
    return {email: privateUser.email};
  }

  async healthcheck() {
    return this.projector.connected && this.rpcServer.isRunning;
  }

  async shutdownHandler() {
    await Promise.all([this.projector.shutdown(), this.rpcServer.disconnect()]);
  }
}
