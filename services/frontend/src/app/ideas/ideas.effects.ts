import { Injectable } from '@angular/core';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { IdeasService } from './ideas.service';
import {
  getIdeas,
  getIdeasDone,
  getIdeasFail,
  createIdea,
  createIdeaDone,
  createIdeaFail,
  updateIdea,
  updateIdeaDone,
  updateIdeaFail,
  publishIdea,
  publishIdeaDone,
  publishIdeaFail,
} from './ideas.actions';

@Injectable()
export class IdeasEffects {
  constructor(private actions$: Actions, private ideasService: IdeasService) {}

  getIdeas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getIdeas),
      switchMap(() =>
        this.ideasService.getIdeas().pipe(
          map(found => getIdeasDone({ ideas: found })),
          catchError(error => of(getIdeasFail({ error }))),
        ),
      ),
    ),
  );

  createIdea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createIdea),
      switchMap(({ title, description }) =>
        this.ideasService.createIdea().pipe(
          switchMap(created => [createIdeaDone({ created }), updateIdea({ id: created.id, title, description })]),
          catchError(error => of(createIdeaFail({ error }))),
        ),
      ),
    ),
  );

  updateIdea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateIdea),
      switchMap(({ id, title, description }) =>
        this.ideasService.updateIdea(id, title, description).pipe(
          switchMap(updated => [updateIdeaDone({ updated }), publishIdea({ id: updated.id })]),
          catchError(error => of(updateIdeaFail({ error }))),
        ),
      ),
    ),
  );

  publishIdea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(publishIdea),
      switchMap(({ id }) =>
        this.ideasService.publishIdea(id).pipe(
          map(published => publishIdeaDone({ published })),
          catchError(error => of(publishIdeaFail({ error }))),
        ),
      ),
    ),
  );
}
