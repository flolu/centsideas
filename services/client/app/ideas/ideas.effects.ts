import * as __ngrxEffectsTypes from '@ngrx/effects/src/models';
import * as __ngrxStoreTypes from '@ngrx/store/src/models';
import * as __rxjsTypes from 'rxjs';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { IdeasActions } from './ideas.actions';
import { IdeasService } from './ideas.service';
import { IdeasSelectors } from './ideas.selectors';

@Injectable()
export class IdeasEffects {
  constructor(
    private actions$: Actions,
    private ideasService: IdeasService,
    private store: Store,
  ) {}

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

  // TODO take a look at ngrx/data
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
      withLatestFrom(this.store.select(IdeasSelectors.selectEditIdeaState)),
      switchMap(([_action, editState]) =>
        this.ideasService
          .updateIdea(editState.ideaId, editState.form.title, editState.form.description)
          .pipe(
            switchMap(updated => [IdeasActions.updateIdeaDone({ updated })]),
            catchError(error => of(IdeasActions.updateIdeaFail({ error }))),
          ),
      ),
    ),
  );

  deleteIdea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IdeasActions.deleteIdea),
      withLatestFrom(this.store.select(IdeasSelectors.selectSelectedIdeaId)),
      switchMap(([_action, ideaId]) =>
        this.ideasService.deleteIdea(ideaId).pipe(
          switchMap(deleted => [IdeasActions.deleteIdeaDone({ deleted })]),
          catchError(error => of(IdeasActions.deleteIdeaFail({ error }))),
        ),
      ),
    ),
  );

  editIdea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IdeasActions.editIdea),
      withLatestFrom(this.store.select(IdeasSelectors.selectSelectedIdea)),
      map(([_action, selectedIdea]) => IdeasActions.editIdeaSetForm({ idea: selectedIdea })),
    ),
  );
}
