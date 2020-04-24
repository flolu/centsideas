import * as __rxjsTypes from 'rxjs';

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ENVIRONMENT, IClientEnvironment } from '@cic/environment';
import { ApiEndpoints } from '@centsideas/enums';
import { IIdeaViewModel, IIdeaState } from '@centsideas/models';

@Injectable()
export class IdeasService {
  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private environment: IClientEnvironment,
  ) {}

  getIdeas() {
    return this.http.get<IIdeaViewModel[]>(`${this.baseUrl}`);
  }

  getIdeaById(id: string) {
    return this.http.get<IIdeaViewModel>(`${this.baseUrl}/${id}`);
  }

  createIdea(title: string, description: string) {
    return this.http.post<IIdeaViewModel>(`${this.baseUrl}`, {
      title,
      description,
    });
  }

  updateIdea(ideaId: string, title: string, description: string) {
    return this.http.put<IIdeaState>(`${this.baseUrl}/${ideaId}`, {
      title,
      description,
    });
  }

  deleteIdea(ideaId: string) {
    return this.http.delete<IIdeaState>(`${this.baseUrl}/${ideaId}`);
  }

  private get baseUrl() {
    return `${this.environment.gatewayHost}/${ApiEndpoints.Ideas}`;
  }
}
