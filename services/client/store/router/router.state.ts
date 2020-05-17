import {Params} from '@angular/router';

export interface IRouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export interface IRouterState {
  state: IRouterStateUrl;
}
