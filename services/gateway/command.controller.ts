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
  IdeasApiRoutes,
  UsersApiRoutes,
  NotificationsApiRoutes,
  AdminApiRoutes,
} from '@centsideas/enums';
import { ExpressAdapter } from './express-adapter';
import { GatewayEnvironment } from './gateway.environment';
import { Logger } from '@centsideas/utils';

// TODO input and return types

@controller('')
export class CommandController implements interfaces.Controller {
  private ideaClient: any;

  constructor(private expressAdapter: ExpressAdapter, private env: GatewayEnvironment) {
    this.protoIdeaClient();
  }

  @httpPost(`/${ApiEndpoints.Ideas}`)
  createIdea(req: express.Request, res: express.Response) {
    return new Promise(resolve => {
      this.ideaClient.createIdea(
        { title: req.body.title, description: req.body.description, userId: res.locals.userId },
        (err: any, response: any) => {
          if (err) Logger.error(err, 'while creating idea proto client request');
          Logger.info('create idea proto');
          resolve(response);
        },
      );
    });
  }

  @httpPut(`/${ApiEndpoints.Ideas}/:id`)
  updateIdea(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.ideasHost}/${IdeasApiRoutes.Update}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
  }

  @httpDelete(`/${ApiEndpoints.Ideas}/:id`)
  deleteIdea(req: express.Request, res: express.Response, next: express.NextFunction) {
    const url = `http://${this.env.ideasHost}/${IdeasApiRoutes.Delete}`;
    const adapter = this.expressAdapter.makeJsonAdapter(url);
    return adapter(req, res, next);
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

  /* sampleCommand(req: express.Request, res: express.Response, next: express.NextFunction) {
    // TODO goal:

    // 1. collect necessary data from request
    // maybe this type is always any... because validation is done in service
    const payload: any = { ...req.body ...other stuff };

    // 2. send request to service(s) with unvalidated payload
    const response = await this.messageBroker.request(`ideas/commands/create`, payload);

    // 3. handle http response stuff with response from service(s)
    if (response.ok) {
      // handle success response

      res.json(response.data);
    } else {
      // handle error response

      res.status(400).send('error');
    }
  } */

  private protoIdeaClient() {
    const packageDef = protoLoader.loadSync(
      path.join(__dirname, '../../packages/protobuf', 'idea.proto'),
      {},
    );
    const grpcObject = grpc.loadPackageDefinition(packageDef);
    const ideaPackage = grpcObject.ideaPackage;

    this.ideaClient = new (ideaPackage as any).Idea(
      `${this.env.ideasRpcHost}:${this.env.ideasRpcPort}`,
      grpc.credentials.createInsecure(),
    );
  }
}
