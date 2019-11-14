import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiEndpoints } from '@cents-ideas/enums';
import { IIdeaViewModel } from '@cents-ideas/models';
import { SettingsService } from '@ci-frontend/app';

@Injectable()
export class IdeasService {
  private readonly API_ENDPOINT = ApiEndpoints.Ideas;

  constructor(private http: HttpClient, private settingsService: SettingsService) {}

  getIdeas = (): Observable<IIdeaViewModel[]> => {
    // FIXME share type for response in backend and frontend
    return this.http
      .get<{ found: IIdeaViewModel[] }>(`${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}`)
      .pipe(map(res => res.found));
  };

  createIdea = (): Observable<IIdeaViewModel> => {
    return this.http
      .post<{ created: IIdeaViewModel }>(`${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}`, {})
      .pipe(map(res => res.created));
  };

  updateIdea = (ideaId: string, title: string, description: string): Observable<IIdeaViewModel> => {
    return this.http
      .put<{ updated: IIdeaViewModel }>(`${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}/${ideaId}`, {
        title,
        description,
      })
      .pipe(map(res => res.updated));
  };

  publishIdea = (ideaId: string): Observable<IIdeaViewModel> => {
    return this.http
      .put<{ published: IIdeaViewModel }>(
        `${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}/${ideaId}/publish`,
        {},
      )
      .pipe(map(res => res.published));
  };
}
