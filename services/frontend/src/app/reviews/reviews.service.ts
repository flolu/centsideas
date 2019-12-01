import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiEndpoints, ReviewsApiRoutes } from '@cents-ideas/enums';
import { IReviewViewModel, IReviewScores } from '@cents-ideas/models';

import { SettingsService } from '../settings.service';
import { Observable } from 'rxjs';

@Injectable()
export class ReviewsService {
  private readonly API_ENDPOINT = ApiEndpoints.Reviews;

  constructor(private http: HttpClient, private settingsService: SettingsService) {}

  createReview = (): Observable<IReviewViewModel> => {
    return this.http.post<IReviewViewModel>(`${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}`, {});
  };

  saveReviewDraft = (reviewId: string, content: string, scores: IReviewScores): Observable<IReviewViewModel> => {
    return this.http.put<IReviewViewModel>(
      `${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}/${ReviewsApiRoutes.SaveDraft}/${reviewId}`,
      { content, scores },
    );
  };

  publishReview = (reviewId: string): Observable<IReviewViewModel> => {
    return this.http.put<IReviewViewModel>(
      `${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}/${ReviewsApiRoutes.Publish}/${reviewId}`,
      {},
    );
  };
}
