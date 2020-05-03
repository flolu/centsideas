import * as express from 'express';
import {
  controller,
  interfaces,
  httpPost,
  httpPut,
  httpDelete,
  httpGet,
} from 'inversify-express-utils';
import { inject } from 'inversify';

import {
  ApiEndpoints,
  UsersApiRoutes,
  NotificationsApiRoutes,
  AdminApiRoutes,
} from '@centsideas/enums';
import { IIdeaState } from '@centsideas/models';
import { IIdeaCommands, RpcClient } from '@centsideas/rpc';

import { ExpressAdapter } from './express-adapter';
import { GatewayEnvironment } from './gateway.environment';
import { AuthMiddleware } from './middlewares';
import TYPES from './types';

@controller('')
export class CommandController implements interfaces.Controller {
  constructor(
    private expressAdapter: ExpressAdapter,
    private env: GatewayEnvironment,
    @inject(TYPES.IDEAS_COMMAND_RPC_CLIENT) private ideasRpc: RpcClient<IIdeaCommands>,
  ) {}

  // TODO error handling
  @httpPost(`/${ApiEndpoints.Ideas}`, AuthMiddleware)
  createIdea(req: express.Request, res: express.Response): Promise<IIdeaState> {
    return new Promise(resolve => {
      const { title, description } = req.body;
      const { userId } = res.locals;

      this.ideasRpc.client.create({ userId, title, description }, (err, response) => {
        if (err) throw err;
        resolve(response);
      });
    });
  }

  @httpPut(`/${ApiEndpoints.Ideas}/:id`, AuthMiddleware)
  updateIdea(req: express.Request, res: express.Response) {
    return new Promise(resolve => {
      const ideaId = req.params.id;
      const { title, description } = req.body;
      const { userId } = res.locals;

      this.ideasRpc.client.update({ userId, title, description, ideaId }, (err, response) => {
        if (err) throw err;
        resolve(response);
      });
    });
  }

  @httpDelete(`/${ApiEndpoints.Ideas}/:id`, AuthMiddleware)
  deleteIdea(req: express.Request, res: express.Response) {
    return new Promise(resolve => {
      const ideaId = req.params.id;
      const { userId } = res.locals;

      this.ideasRpc.client.delete({ userId, ideaId }, (err, response) => {
        if (err) throw err;
        resolve(response);
      });
    });
  }

  @httpPut(`/${ApiEndpoints.Users}/:id`, AuthMiddleware)
  updateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.usersHost}/${UsersApiRoutes.Update}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.GoogleLogin}`)
  googleLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.usersHost}/${UsersApiRoutes.GoogleLogin}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpGet(`/${ApiEndpoints.Users}/${UsersApiRoutes.GoogleLoginRedirect}`)
  googleLoginRedirectUrl(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.usersHost}/${UsersApiRoutes.GoogleLoginRedirect}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.RefreshToken}`, AuthMiddleware)
  refreshToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.usersHost}/${UsersApiRoutes.RefreshToken}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.Login}`)
  login(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.usersHost}/${UsersApiRoutes.Login}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.ConfirmLogin}`)
  confirmLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.usersHost}/${UsersApiRoutes.ConfirmLogin}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.ConfirmEmailChange}`, AuthMiddleware)
  confirmEmailChange(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.usersHost}/${UsersApiRoutes.ConfirmEmailChange}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.Logout}`, AuthMiddleware)
  logout(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.usersHost}/${UsersApiRoutes.Logout}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpPost(
    `/${ApiEndpoints.Notifications}/${NotificationsApiRoutes.SubscribePush}`,
    AuthMiddleware,
  )
  subscribePush(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.notificationsHost}/${NotificationsApiRoutes.SubscribePush}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpPost(
    `/${ApiEndpoints.Notifications}/${NotificationsApiRoutes.UpdateSettings}`,
    AuthMiddleware,
  )
  updateNotificationSettings(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const url = `http://${this.env.notificationsHost}/${NotificationsApiRoutes.UpdateSettings}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpGet(`/${ApiEndpoints.Notifications}`, AuthMiddleware)
  getNotificationSettings(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.notificationsHost}/${NotificationsApiRoutes.GetSettings}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpGet(`/${ApiEndpoints.Admin}`)
  getAdminEvents(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.adminHost}/${AdminApiRoutes.GetEvents}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }
}
