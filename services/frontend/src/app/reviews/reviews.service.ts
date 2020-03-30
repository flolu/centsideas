import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiEndpoints, ReviewsApiRoutes } from '@cents-ideas/enums';
import { IReviewViewModel, IReviewScores } from '@cents-ideas/models';

import { SettingsService } from '../settings.service';

@Injectable()
export class ReviewsService {
  private readonly API_ENDPOINT = ApiEndpoints.Reviews;

  constructor(private http: HttpClient, private settingsService: SettingsService) {}

  createReview = (ideaId: string): Observable<IReviewViewModel> => {
    return this.http.post<IReviewViewModel>(
      `${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}`,
      { ideaId },
    );
  };

  saveReviewDraft = (
    reviewId: string,
    content: string,
    scores: IReviewScores,
  ): Observable<IReviewViewModel> => {
    return this.http.put<IReviewViewModel>(
      `${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}/${reviewId}/${ReviewsApiRoutes.SaveDraft}`,
      { content, scores },
    );
  };

  updateReview = (
    reviewId: string,
    content: string,
    scores: IReviewScores,
  ): Observable<IReviewViewModel> => {
    return this.http.put<IReviewViewModel>(
      `${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}/${reviewId}/${ReviewsApiRoutes.Update}`,
      { content, scores },
    );
  };

  publishReview = (reviewId: string): Observable<IReviewViewModel> => {
    return this.http.put<IReviewViewModel>(
      `${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}/${reviewId}/${ReviewsApiRoutes.Publish}`,
      {},
    );
  };
}
