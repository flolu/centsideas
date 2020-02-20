import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiEndpoints } from '@cents-ideas/enums';
import { IIdeaViewModel, IIdeaState } from '@cents-ideas/models';
import { SettingsService } from '@ci-frontend/app';

@Injectable()
export class IdeasService {
  private readonly API_ENDPOINT = ApiEndpoints.Ideas;

  constructor(private http: HttpClient, private settingsService: SettingsService) {}

  getIdeas = (): Observable<IIdeaViewModel[]> => {
    return this.http.get<IIdeaViewModel[]>(`${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}`);
  };

  getIdeaById = (id: string): Observable<IIdeaViewModel> => {
    return this.http.get<IIdeaViewModel>(`${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}/${id}`);
  };

  createIdea = (title: string, description: string): Observable<IIdeaViewModel> => {
    return this.http.post<IIdeaViewModel>(`${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}`, {
      title,
      description,
    });
  };

  updateIdea = (ideaId: string, title: string, description: string): Observable<IIdeaState> => {
    return this.http.put<IIdeaState>(`${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}/${ideaId}`, {
      title,
      description,
    });
  };
}
