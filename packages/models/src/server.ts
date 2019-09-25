import { IServerEnvironment } from '.';

export interface IServer {
  start: (env: IServerEnvironment & any) => void;
}
