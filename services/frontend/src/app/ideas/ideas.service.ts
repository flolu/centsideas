import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IIdeaViewModel } from '@cents-ideas/models';
import { SettingsService } from '@ci-frontend/app';

@Injectable()
export class IdeasService {
  constructor(private http: HttpClient, private settingsService: SettingsService) {}

  getIdeas = (): Observable<IIdeaViewModel[]> => {
    // FIXME share type for response in backend and frontend
    // TODO share backend endpoints between frontend and backend
    return this.http
      .get<{ found: IIdeaViewModel[] }>(`${this.settingsService.settings.apiUrl}/ideas`)
      .pipe(map(res => res.found));
  };

  createIdea = (): Observable<IIdeaViewModel> => {
    return this.http
      .post<{ created: IIdeaViewModel }>(`${this.settingsService.settings.apiUrl}/ideas`, {})
      .pipe(map(res => res.created));
  };

  updateIdea = (ideaId: string, title: string, description: string): Observable<IIdeaViewModel> => {
    return this.http
      .put<{ updated: IIdeaViewModel }>(`${this.settingsService.settings.apiUrl}/ideas/${ideaId}`, {
        title,
        description,
      })
      .pipe(map(res => res.updated));
  };

  publishIdea = (ideaId: string): Observable<IIdeaViewModel> => {
    return this.http
      .put<{ published: IIdeaViewModel }>(`${this.settingsService.settings.apiUrl}/ideas/publish/${ideaId}`, {})
      .pipe(map(res => res.published));
  };
}
