import {createAction, props} from '@ngrx/store';

import {IIdeaViewModel, IIdeaState} from '@centsideas/models';
import {appPrefix, failSuffix, doneSuffix} from '@cic/shared';
import {IIdeaForm} from '../ideas.state';

const prefix = `${appPrefix}/edit-idea`;
const updatePrefix = prefix + '/update';
const deletePrefix = prefix + '/delete';
const uiEditPrefix = prefix + '/ui/edit';

const updateIdea = createAction(updatePrefix);
const updateIdeaDone = createAction(updatePrefix + doneSuffix, props<{updated: IIdeaState}>());
const updateIdeaFail = createAction(updatePrefix + failSuffix, props<{error: string}>());

const deleteIdea = createAction(deletePrefix);
const deleteIdeaDone = createAction(deletePrefix + doneSuffix, props<{deleted: IIdeaState}>());
const deleteIdeaFail = createAction(deletePrefix + failSuffix, props<{error: string}>());

const editIdea = createAction(uiEditPrefix);
const editIdeaSetForm = createAction(uiEditPrefix + '/set-form', props<{idea: IIdeaViewModel}>());
const ideaFormChanged = createAction(uiEditPrefix + '/form-changed', props<{value: IIdeaForm}>());
const cancelEditIdea = createAction(uiEditPrefix + '/cancel');

export const EditIdeaActions = {
  updateIdea,
  updateIdeaDone,
  updateIdeaFail,
  deleteIdea,
  deleteIdeaDone,
  deleteIdeaFail,
  editIdea,
  editIdeaSetForm,
  ideaFormChanged,
  cancelEditIdea,
};
