import * as __ngrxEffectsTypes from '@ngrx/effects/src/models';
import * as __ngrxStoreTypes from '@ngrx/store/src/models';
import * as __rxjsTypes from 'rxjs';

import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { IdeasActions } from './ideas.actions';
import { IdeasService } from '../ideas.service';

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
}
