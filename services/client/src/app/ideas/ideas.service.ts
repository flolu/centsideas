import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiEndpoints } from '@cents-ideas/enums';
import { IIdeaViewModel, IIdeaState } from '@cents-ideas/models';

import { ENVIRONMENT, IEnvironment } from '../../environments';

@Injectable()
export class IdeasService {
  constructor(private http: HttpClient, @Inject(ENVIRONMENT) private env: IEnvironment) {}

  getIdeas = (): Observable<IIdeaViewModel[]> => {
    return this.http.get<IIdeaViewModel[]>(`${this.env.gatewayHost}/${ApiEndpoints.Ideas}`);
  };

  getIdeaById = (id: string): Observable<IIdeaViewModel> => {
    return this.http.get<IIdeaViewModel>(`${this.env.gatewayHost}/${ApiEndpoints.Ideas}/${id}`);
  };

  createIdea = (title: string, description: string): Observable<IIdeaViewModel> => {
    return this.http.post<IIdeaViewModel>(`${this.env.gatewayHost}/${ApiEndpoints.Ideas}`, {
      title,
      description,
    });
  };

  updateIdea = (ideaId: string, title: string, description: string): Observable<IIdeaState> => {
    return this.http.put<IIdeaState>(`${this.env.gatewayHost}/${ApiEndpoints.Ideas}/${ideaId}`, {
      title,
      description,
    });
  };

  deleteIdea = (ideaId: string): Observable<IIdeaState> => {
    return this.http.delete<IIdeaState>(`${this.env.gatewayHost}/${ApiEndpoints.Ideas}/${ideaId}`);
  };
}
