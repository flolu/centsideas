import * as express from 'express';
import {
  controller,
  interfaces,
  httpPost,
  httpPut,
  httpDelete,
  httpGet,
} from 'inversify-express-utils';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

import {
  ApiEndpoints,
  UsersApiRoutes,
  NotificationsApiRoutes,
  AdminApiRoutes,
} from '@centsideas/enums';
import { IIdeaState } from '@centsideas/models';
import { IIdeaCommands } from '@centsideas/rpc';
import { ExpressAdapter } from './express-adapter';
import { GatewayEnvironment } from './gateway.environment';

@controller('')
export class CommandController implements interfaces.Controller {
  private readonly protoRootPath = path.resolve(__dirname, '../../', 'packages', 'rpc');
  private readonly ideaCommandsProto = path.join(this.protoRootPath, 'idea', 'idea-commands.proto');
  private ideasClient: IIdeaCommands;

  constructor(private expressAdapter: ExpressAdapter, private env: GatewayEnvironment) {
    const packageDef = protoLoader.loadSync(this.ideaCommandsProto);
    const grpcObject = grpc.loadPackageDefinition(packageDef);
    const ideasPackage = grpcObject.ideaCommands;
    this.ideasClient = new (ideasPackage as any).IdeaCommands(
      `${this.env.ideasRpcHost}:${this.env.ideasRpcPort}`,
      grpc.credentials.createInsecure(),
    );
  }

  // TODO error handling
  @httpPost(`/${ApiEndpoints.Ideas}`)
  createIdea(req: express.Request, res: express.Response): Promise<IIdeaState> {
    return new Promise(resolve => {
      const { title, description } = req.body;
      const { userId } = res.locals;

      this.ideasClient.create({ userId, title, description }, (err, response) => {
        if (err) throw err;
        resolve(response);
      });
    });
  }

  @httpPut(`/${ApiEndpoints.Ideas}/:id`)
  updateIdea(req: express.Request, res: express.Response) {
    return new Promise(resolve => {
      const ideaId = req.params.id;
      const { title, description } = req.body;
      const { userId } = res.locals;

      this.ideasClient.update({ userId, title, description, ideaId }, (err, response) => {
        if (err) throw err;
        resolve(response);
      });
    });
  }

  @httpDelete(`/${ApiEndpoints.Ideas}/:id`)
  deleteIdea(req: express.Request, res: express.Response) {
    return new Promise(resolve => {
      const ideaId = req.params.id;
      const { userId } = res.locals;

      this.ideasClient.delete({ userId, ideaId }, (err, response) => {
        if (err) throw err;
        resolve(response);
      });
    });
  }

  @httpPut(`/${ApiEndpoints.Users}/:id`)
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

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.RefreshToken}`)
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

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.ConfirmEmailChange}`)
  confirmEmailChange(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.usersHost}/${UsersApiRoutes.ConfirmEmailChange}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpPost(`/${ApiEndpoints.Users}/${UsersApiRoutes.Logout}`)
  logout(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.usersHost}/${UsersApiRoutes.Logout}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpPost(`/${ApiEndpoints.Notifications}/${NotificationsApiRoutes.SubscribePush}`)
  subscribePush(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.notificationsHost}/${NotificationsApiRoutes.SubscribePush}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpPost(`/${ApiEndpoints.Notifications}/${NotificationsApiRoutes.UpdateSettings}`)
  updateNotificationSettings(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const url = `http://${this.env.notificationsHost}/${NotificationsApiRoutes.UpdateSettings}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpGet(`/${ApiEndpoints.Notifications}`)
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
