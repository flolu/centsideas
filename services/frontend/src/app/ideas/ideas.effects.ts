import { Injectable } from '@angular/core';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { IdeasActions } from '@ci-frontend/ideas';
import { IdeasService } from './ideas.service';

@Injectable()
export class IdeasEffects {
  constructor(private actions$: Actions, private ideasService: IdeasService) {}

  getIdeas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IdeasActions.getIdeas),
      switchMap(() =>
        this.ideasService.getIdeas().pipe(
          map(found => IdeasActions.getIdeasDone({ ideas: found })),
          catchError(error => of(IdeasActions.getIdeasFail({ error }))),
        ),
      ),
    ),
  );

  getIdeaById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IdeasActions.getIdeaById),
      switchMap(action =>
        this.ideasService.getIdeaById(action.id).pipe(
          map(found => IdeasActions.getIdeaByIdDone({ idea: found })),
          catchError(error => of(IdeasActions.getIdeaByIdFail({ error }))),
        ),
      ),
    ),
  );

  createIdea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IdeasActions.createIdea),
      switchMap(({ title, description }) =>
        this.ideasService.createIdea(title, description).pipe(
          map(created => IdeasActions.createIdeaDone({ created })),
          catchError(error => of(IdeasActions.createIdeaFail({ error }))),
        ),
      ),
    ),
  );

  updateIdea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IdeasActions.updateIdea),
      switchMap(({ id, title, description }) =>
        this.ideasService.updateIdea(id, title, description).pipe(
          switchMap(updated => [IdeasActions.updateIdeaDone({ updated })]),
          catchError(error => of(IdeasActions.updateIdeaFail({ error }))),
        ),
      ),
    ),
  );
}
