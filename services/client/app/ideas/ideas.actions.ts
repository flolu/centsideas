import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createAction, props } from '@ngrx/store';

import { IIdeaViewModel, IIdeaState, ICreateIdeaDto } from '@cents-ideas/models';

import { appPrefix, failSuffix, doneSuffix } from '../../shared/helpers/actions.helper';
import { IIdeaForm } from './ideas.state';

const prefix = `${appPrefix}/ideas`;
const getPrefix = prefix + '/get';
const getByIdPrefix = prefix + '/get-by-id';
const createPrefix = prefix + '/create';
const updatePrefix = prefix + '/update';
const deletePrefix = prefix + '/delete';
const uiEditPrefix = prefix + '/ui/edit';

const getIdeas = createAction(getPrefix);
const getIdeasDone = createAction(getPrefix + doneSuffix, props<{ ideas: IIdeaViewModel[] }>());
const getIdeasFail = createAction(getPrefix + failSuffix, props<{ error: string }>());

const getIdeaById = createAction(getByIdPrefix, props<{ id: string }>());
const getIdeaByIdDone = createAction(getByIdPrefix + doneSuffix, props<{ idea: IIdeaViewModel }>());
const getIdeaByIdFail = createAction(getByIdPrefix + failSuffix, props<{ error: string }>());

const createIdea = createAction(createPrefix, props<ICreateIdeaDto>());
const createIdeaDone = createAction(createPrefix + doneSuffix, props<{ created: IIdeaState }>());
const createIdeaFail = createAction(createPrefix + failSuffix, props<{ error: string }>());

const updateIdea = createAction(updatePrefix);
const updateIdeaDone = createAction(updatePrefix + doneSuffix, props<{ updated: IIdeaState }>());
const updateIdeaFail = createAction(updatePrefix + failSuffix, props<{ error: string }>());

const deleteIdea = createAction(deletePrefix);
const deleteIdeaDone = createAction(deletePrefix + doneSuffix, props<{ deleted: IIdeaState }>());
const deleteIdeaFail = createAction(deletePrefix + failSuffix, props<{ error: string }>());

const editIdea = createAction(uiEditPrefix);
const editIdeaSetForm = createAction(uiEditPrefix + '/set-form', props<{ idea: IIdeaViewModel }>());
const ideaFormChanged = createAction(uiEditPrefix + '/form-changed', props<{ value: IIdeaForm }>());
const cancelEditIdea = createAction(uiEditPrefix + '/cancel');

export const IdeasActions = {
  getIdeas,
  getIdeasDone,
  getIdeasFail,
  getIdeaById,
  getIdeaByIdDone,
  getIdeaByIdFail,
  createIdea,
  createIdeaDone,
  createIdeaFail,
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
