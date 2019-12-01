import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiEndpoints, IdeasApiRoutes } from '@cents-ideas/enums';
import { IIdeaViewModel, IIdeaState } from '@cents-ideas/models';
import { SettingsService } from '@ci-frontend/app';

@Injectable()
export class IdeasService {
  private readonly API_ENDPOINT = ApiEndpoints.Ideas;

  constructor(private http: HttpClient, private settingsService: SettingsService) {}

  getIdeas = (): Observable<IIdeaViewModel[]> => {
    // TODO also fetch rating of idea
    return this.http.get<IIdeaViewModel[]>(`${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}`);
  };

  getIdeaById = (id: string): Observable<IIdeaViewModel> => {
    // TODO: also fetch reviews
    return this.http.get<IIdeaViewModel>(`${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}/${id}`);
  };

  createIdea = (): Observable<IIdeaViewModel> => {
    return this.http.post<IIdeaViewModel>(`${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}`, {});
  };

  updateIdea = (ideaId: string, title: string, description: string): Observable<IIdeaState> => {
    return this.http.put<IIdeaState>(`${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}/${ideaId}`, {
      title,
      description,
    });
  };

  publishIdea = (ideaId: string): Observable<IIdeaViewModel> => {
    return this.http.put<IIdeaViewModel>(
      `${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}/${ideaId}/${IdeasApiRoutes.Publish}`,
      {},
    );
  };
}
