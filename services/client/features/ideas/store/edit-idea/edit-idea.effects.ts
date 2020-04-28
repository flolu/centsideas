import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { EditIdeaActions } from './edit-idea.actions';
import { IdeasService } from '../ideas.service';
import { IdeasSelectors } from '../ideas.selectors';

@Injectable()
export class EditIdeaEffects {
  constructor(
    private actions$: Actions,
    private ideasService: IdeasService,
    private store: Store,
  ) {}

  updateIdea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EditIdeaActions.updateIdea),
      withLatestFrom(this.store.select(IdeasSelectors.editIdeaState)),
      switchMap(([_action, editState]) =>
        this.ideasService
          .updateIdea(editState.ideaId, editState.form.title, editState.form.description)
          .pipe(
            map(updated => EditIdeaActions.updateIdeaDone({ updated })),
            catchError(error => of(EditIdeaActions.updateIdeaFail({ error }))),
          ),
      ),
    ),
  );

  deleteIdea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EditIdeaActions.deleteIdea),
      withLatestFrom(this.store.select(IdeasSelectors.selectedIdeaId)),
      switchMap(([_action, ideaId]) =>
        this.ideasService.deleteIdea(ideaId).pipe(
          map(deleted => EditIdeaActions.deleteIdeaDone({ deleted })),
          catchError(error => of(EditIdeaActions.deleteIdeaFail({ error }))),
        ),
      ),
    ),
  );

  editIdea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EditIdeaActions.editIdea),
      withLatestFrom(this.store.select(IdeasSelectors.selectedIdea)),
      map(([_action, selectedIdea]) => EditIdeaActions.editIdeaSetForm({ idea: selectedIdea })),
    ),
  );
}
