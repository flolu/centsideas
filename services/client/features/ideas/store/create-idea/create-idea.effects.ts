import * as __ngrxEffectsTypes from '@ngrx/effects/src/models';
import * as __ngrxStoreTypes from '@ngrx/store/src/models';
import * as __rxjsTypes from 'rxjs';

import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { CreateIdeaActions } from './create-idea.actions';
import { IdeasService } from '../ideas.service';

@Injectable()
export class CreateIdeaEffects {
  constructor(private actions$: Actions, private ideasService: IdeasService) {}

  createIdea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateIdeaActions.createIdea),
      switchMap(({ title, description }) =>
        this.ideasService.createIdea(title, description).pipe(
          map(created => CreateIdeaActions.createIdeaDone({ created })),
          catchError(error => of(CreateIdeaActions.createIdeaFail({ error }))),
        ),
      ),
    ),
  );
}
