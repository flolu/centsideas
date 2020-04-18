import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiEndpoints } from '@centsideas/enums';
import { IIdeaViewModel, IIdeaState } from '@centsideas/models';
import { EnvironmentService } from '../../shared/environment/environment.service';

@Injectable()
export class IdeasService {
  constructor(private http: HttpClient, private environmentService: EnvironmentService) {}

  getIdeas = (): Observable<IIdeaViewModel[]> => {
    return this.http.get<IIdeaViewModel[]>(`${this.baseUrl}`);
  };

  getIdeaById = (id: string): Observable<IIdeaViewModel> => {
    return this.http.get<IIdeaViewModel>(`${this.baseUrl}/${id}`);
  };

  createIdea = (title: string, description: string): Observable<IIdeaViewModel> => {
    return this.http.post<IIdeaViewModel>(`${this.baseUrl}`, {
      title,
      description,
    });
  };

  updateIdea = (ideaId: string, title: string, description: string): Observable<IIdeaState> => {
    return this.http.put<IIdeaState>(`${this.baseUrl}/${ideaId}`, {
      title,
      description,
    });
  };

  deleteIdea = (ideaId: string): Observable<IIdeaState> => {
    return this.http.delete<IIdeaState>(`${this.baseUrl}/${ideaId}`);
  };

  private get baseUrl() {
    return `${this.environmentService.env.gatewayHost}/${ApiEndpoints.Ideas}`;
  }
}
